import os
import uuid
import random
import shutil
from flask import Flask, request, jsonify, send_from_directory
from src.model_utils import predict_disease
from src.plant_validator import validate_plant_image
from src.disease_info import DISEASE

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)

# Enable CORS for cross-origin requests from React frontend
try:
    from flask_cors import CORS
    CORS(app, resources={r"/*": {"origins": "*"}})
except ImportError:
    pass

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

# Configure uploads directory
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
# Limit uploads to 16MB
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024

# Allowed image extensions
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/", methods=["GET"])
@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint to verify backend status."""
    return jsonify({
        "status": "healthy",
        "service": "BioShield AI Plant Disease Detection Backend",
        "version": "2.0.0"
    })

@app.route("/api/diseases", methods=["GET"])
def list_diseases():
    """Returns the full knowledge base of supported plant diseases."""
    return jsonify({
        "success": True,
        "count": len(DISEASE),
        "diseases": DISEASE
    })

@app.route("/uploads/<path:filename>", methods=["GET"])
def serve_upload(filename):
    """Serves uploaded leaf images."""
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    """API endpoint to upload a leaf image and get predictions."""
    if request.method == "OPTIONS":
        return "", 200

    if "file" not in request.files:
        return jsonify({"success": False, "error": "No file uploaded"}), 400
        
    file = request.files["file"]
    
    if file.filename == "":
        return jsonify({"success": False, "error": "No selected file"}), 400
        
    if not allowed_file(file.filename):
        return jsonify({"success": False, "error": f"Invalid file type. Supported types: {', '.join(ALLOWED_EXTENSIONS)}"}), 400
        
    try:
        # Save file with a secure, unique filename to avoid overwrites
        file_ext = file.filename.rsplit(".", 1)[1].lower()
        unique_filename = f"{uuid.uuid4().hex}.{file_ext}"
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], unique_filename)
        file.save(filepath)

        # Gatekeeper: Verify the uploaded image is actually a plant/leaf before predicting
        is_plant, validation_error, metrics = validate_plant_image(filepath)
        if not is_plant:
            try:
                os.remove(filepath)
            except OSError:
                pass
            return jsonify({
                "success": False,
                "error_code": "NOT_A_PLANT_IMAGE",
                "title": "Not the Correct Pic",
                "error": validation_error,
                "details": metrics
            }), 422

        # Run prediction only on verified plant images
        try:
            class_name, confidence = predict_disease(filepath)
        except FileNotFoundError as e:
            # Model not trained yet
            return jsonify({
                "success": False, 
                "error": "The deep learning model has not been trained yet. Please run 'python src/train.py' to generate the model before using the web app."
            }), 503
            
        # Retrieve information for the predicted disease
        info = DISEASE.get(class_name)
        if not info:
            info = {
                "plant_name": class_name.split("___")[0].replace("_", " "),
                "disease_name": class_name.split("___")[1].replace("_", " "),
                "symptoms": ["Information not available in knowledge base."],
                "causes": ["N/A"],
                "prevention": ["N/A"],
                "treatment": ["N/A"]
            }
            
        image_url = f"/uploads/{unique_filename}"
        
        return jsonify({
            "success": True,
            "plant_name": info["plant_name"],
            "disease_name": info["disease_name"],
            "confidence": round(confidence * 100, 2), # percentage
            "symptoms": info["symptoms"],
            "causes": info["causes"],
            "prevention": info["prevention"],
            "treatment": info["treatment"],
            "image_url": image_url
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": f"An error occurred: {str(e)}"}), 500

@app.route("/predict_sample", methods=["GET"])
def predict_sample():
    """API endpoint to predict on a pre-generated sample image."""
    class_name = request.args.get("class_name")
    if not class_name:
        return jsonify({"success": False, "error": "No class name provided"}), 400
        
    validation_class_dir = os.path.join(BASE_DIR, "dataset", "validation", class_name)
    if not os.path.exists(validation_class_dir):
        return jsonify({
            "success": False, 
            "error": f"Sample dataset not found for '{class_name}'. Please ensure sample images exist in the dataset directory."
        }), 404
        
    # Get all images in the validation directory for this class
    images = [img for img in os.listdir(validation_class_dir) if allowed_file(img)]
    if not images:
        return jsonify({"success": False, "error": f"No sample images found in validation directory for {class_name}"}), 404
        
    # Pick a random sample image from the class
    selected_img = random.choice(images)
    src_path = os.path.join(validation_class_dir, selected_img)
    
    # Copy to uploads folder with a unique name
    unique_filename = f"sample_{uuid.uuid4().hex}.png"
    dest_path = os.path.join(app.config["UPLOAD_FOLDER"], unique_filename)
    
    try:
        shutil.copy(src_path, dest_path)
    except Exception as e:
        return jsonify({"success": False, "error": f"Failed to process sample image: {str(e)}"}), 500
        
    # Run prediction
    try:
        predicted_class, confidence = predict_disease(dest_path)
    except FileNotFoundError as e:
        return jsonify({
            "success": False, 
            "error": "The deep learning model has not been trained yet. Please run 'python src/train.py' to generate the model before using the web app."
        }), 503
        
    # Retrieve information for the predicted disease
    info = DISEASE.get(predicted_class)
    if not info:
        info = {
            "plant_name": predicted_class.split("___")[0].replace("_", " "),
            "disease_name": predicted_class.split("___")[1].replace("_", " "),
            "symptoms": ["Information not available in knowledge base."],
            "causes": ["N/A"],
            "prevention": ["N/A"],
            "treatment": ["N/A"]
        }
        
    image_url = f"/uploads/{unique_filename}"
    
    return jsonify({
        "success": True,
        "plant_name": info["plant_name"],
        "disease_name": info["disease_name"],
        "confidence": round(confidence * 100, 2), # percentage
        "symptoms": info["symptoms"],
        "causes": info["causes"],
        "prevention": info["prevention"],
        "treatment": info["treatment"],
        "image_url": image_url
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host="0.0.0.0", port=port)
