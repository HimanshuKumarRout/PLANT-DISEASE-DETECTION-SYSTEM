import os
import cv2
import numpy as np
from PIL import Image, ImageOps


_FACE_CASCADE = None


def _get_face_cascade():
    """Lazy-loads OpenCV's built-in frontal face Haar cascade."""
    global _FACE_CASCADE
    if _FACE_CASCADE is None:
        cascade_path = os.path.join(
            cv2.data.haarcascades, "haarcascade_frontalface_default.xml"
        )
        if os.path.exists(cascade_path):
            _FACE_CASCADE = cv2.CascadeClassifier(cascade_path)
    return _FACE_CASCADE


def _load_normalized_bgr(image_path):
    """Loads an image safely with EXIF orientation and resizes for fast CV checks."""
    with Image.open(image_path) as pil_img:
        pil_img = ImageOps.exif_transpose(pil_img).convert("RGB")
        rgb = np.array(pil_img)

    if rgb.size == 0:
        return None

    h0, w0 = rgb.shape[:2]
    if min(h0, w0) < 32:
        raise ValueError("Image resolution is too small (minimum 32x32 pixels).")

    bgr = cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)
    max_dim = max(h0, w0)
    if max_dim > 320 or max_dim < 160:
        scale = 320.0 / max_dim
        new_w = max(32, int(round(w0 * scale)))
        new_h = max(32, int(round(h0 * scale)))
        bgr = cv2.resize(bgr, (new_w, new_h), interpolation=cv2.INTER_AREA)

    return bgr


def validate_plant_image(image_path):
    """
    Validates whether an uploaded image represents a real or dataset plant leaf.

    Runs multi-stage OpenCV analysis (brightness/variance, noise detection,
    human face/portrait exclusion, botanical chlorophyll spectral masks,
    connected component coherence, edge detail, and center framing) before
    allowing the CNN classifier to run.

    Returns:
        tuple[bool, str | None, dict]: (is_valid, error_message, metrics)
    """
    try:
        bgr = _load_normalized_bgr(image_path)
    except Exception as exc:
        return (
            False,
            f"This is not the correct pic. Could not read a valid plant image ({exc}).",
            {},
        )

    if bgr is None or bgr.size == 0:
        return (
            False,
            "This is not the correct pic. The uploaded file contains no readable image data.",
            {},
        )

    height, width = bgr.shape[:2]
    total_pixels = float(height * width)
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)

    # Stage 1: Reject blank, pitch-black, washed-out, or solid color fills
    gray_std = float(gray.std())
    channel_std = float(np.mean(bgr.std(axis=(0, 1))))
    if gray_std < 9.0 and channel_std < 9.0:
        return (
            False,
            "This is not the correct pic. The uploaded image appears blank or a solid uniform color rather than a plant leaf.",
            {"gray_std": round(gray_std, 2), "channel_std": round(channel_std, 2)},
        )

    # Stage 2: Reject random noise / corrupted static images
    gray_f = gray.astype(np.float32)
    jump_x = np.mean(np.abs(np.diff(gray_f, axis=1)) > 25.0)
    jump_y = np.mean(np.abs(np.diff(gray_f, axis=0)) > 25.0)
    noise_jump_ratio = float(0.5 * (jump_x + jump_y))
    if noise_jump_ratio > 0.50:
        return (
            False,
            "This is not the correct pic. High random noise detected instead of a valid plant leaf photograph.",
            {"noise_jump_ratio": round(noise_jump_ratio, 3)},
        )

    # Stage 3: Botanical chlorophyll & yellow-green chlorosis spectral masks
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
    hue, sat, val = hsv[:, :, 0], hsv[:, :, 1], hsv[:, :, 2]
    b, g, r = cv2.split(bgr.astype(np.float32))

    # Excess Green Index (ExG = 2G - R - B normalized to [-2, 2])
    exg = (2.0 * g - r - b) / 255.0

    # Core chlorophyll green (excludes teal/aqua UI colors above Hue 76 and warm skin/red below Hue 24)
    green_mask = (
        (hue >= 24)
        & (hue <= 76)
        & (sat >= 24)
        & (val >= 20)
        & (g > b + 6.0)
        & (g >= r * 0.85)
        & (exg > 0.015)
    )

    # Extended botanical spectrum (covers chlorotic yellowing, olive, and rust-affected foliage)
    extended_mask = (
        (hue >= 20)
        & (hue <= 78)
        & (sat >= 22)
        & (val >= 20)
        & (g > b + 8.0)
        & (g >= r * 0.78)
    )

    # Remove thin 1-2px digital lines/text speckles before checking blob coherence
    kernel = np.ones((3, 3), np.uint8)
    green_opened = cv2.morphologyEx(green_mask.astype(np.uint8), cv2.MORPH_OPEN, kernel)
    ext_opened = cv2.morphologyEx(extended_mask.astype(np.uint8), cv2.MORPH_OPEN, kernel)

    n_g, _, stats_g, _ = cv2.connectedComponentsWithStats(green_opened, connectivity=8)
    max_green_blob = float(stats_g[1:, cv2.CC_STAT_AREA].max() / total_pixels) if n_g > 1 else 0.0

    n_e, _, stats_e, _ = cv2.connectedComponentsWithStats(ext_opened, connectivity=8)
    max_ext_blob = float(stats_e[1:, cv2.CC_STAT_AREA].max() / total_pixels) if n_e > 1 else 0.0

    green_ratio = float(green_mask.mean())
    extended_ratio = float(extended_mask.mean())

    # Center 70% region check to ensure a leaf/plant is actually the main subject
    cy1, cy2 = int(height * 0.15), int(height * 0.85)
    cx1, cx2 = int(width * 0.15), int(width * 0.85)
    center_green_ratio = float(green_mask[cy1:cy2, cx1:cx2].mean())
    center_extended_ratio = float(extended_mask[cy1:cy2, cx1:cx2].mean())

    metrics = {
        "green_ratio": round(green_ratio, 4),
        "extended_ratio": round(extended_ratio, 4),
        "max_green_blob": round(max_green_blob, 4),
        "max_ext_blob": round(max_ext_blob, 4),
        "center_green_ratio": round(center_green_ratio, 4),
    }

    # Stage 4: Human face & skin-dominated portrait check (still allows hand holding a leaf)
    ycrcb = cv2.cvtColor(bgr, cv2.COLOR_BGR2YCrCb)
    cr, cb = ycrcb[:, :, 1], ycrcb[:, :, 2]
    skin_mask = (cr >= 133) & (cr <= 173) & (cb >= 77) & (cb <= 127) & (r > g) & (r > b)

    cascade = _get_face_cascade()
    if cascade is not None:
        faces = cascade.detectMultiScale(
            cv2.equalizeHist(gray), scaleFactor=1.1, minNeighbors=6, minSize=(45, 45)
        )
        for (fx, fy, fw, fh) in faces:
            face_area_ratio = (fw * fh) / total_pixels
            skin_in_face = float(skin_mask[fy : fy + fh, fx : fx + fw].mean())
            if face_area_ratio >= 0.04 and skin_in_face >= 0.25 and green_ratio < 0.25:
                return (
                    False,
                    "This is not the correct pic. A human face or portrait was detected instead of a plant leaf.",
                    metrics,
                )

    skin_ratio = float(skin_mask.mean())
    if skin_ratio > 0.30 and green_ratio < 0.12:
        return (
            False,
            "This is not the correct pic. Please upload a close-up plant leaf photo rather than a person or unrelated subject.",
            metrics,
        )

    # Stage 5: Edge / structural detail check (catches smooth gradients or plain walls)
    edges = cv2.Canny(gray, 40, 120)
    edge_ratio = float((edges > 0).mean())
    metrics["edge_ratio"] = round(edge_ratio, 4)
    if edge_ratio < 0.002:
        return (
            False,
            "This is not the correct pic. No recognizable leaf contours or plant textures were found.",
            metrics,
        )

    # Stage 6: Botanical foliage coverage & coherent blob verification
    has_healthy_or_moderate_leaf = green_ratio >= 0.05 and max_green_blob >= 0.02
    has_chlorotic_diseased_leaf = (
        green_ratio >= 0.03 and extended_ratio >= 0.14 and max_ext_blob >= 0.06
    )

    if not (has_healthy_or_moderate_leaf or has_chlorotic_diseased_leaf):
        return (
            False,
            "This is not the correct pic. No plant or leaf foliage was detected in the uploaded image. Please upload a clear photo of an Apple, Corn, Potato, or Tomato leaf.",
            metrics,
        )

    # Stage 7: Ensure foliage appears in the central subject frame, not merely a sliver at edges
    if center_green_ratio < 0.03 and center_extended_ratio < 0.07:
        return (
            False,
            "This is not the correct pic. Please upload a centered plant leaf photograph rather than an unrelated object near background greenery.",
            metrics,
        )

    return True, None, metrics
