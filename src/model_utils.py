import os
import json
from PIL import Image
import torch
import torch.nn as nn
from torchvision import transforms

# Load classes from class_names.json if available, otherwise fall back to default classes.

def load_disease_classes():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    class_path = os.path.join(base_dir, "..", "class_names.json")
    if os.path.exists(class_path):
        with open(class_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return [
        "Apple___Black_rot",
        "Apple___healthy",
        "Corn___Common_rust",
        "Corn___healthy",
        "Potato___Early_blight",
        "Potato___Late_blight",
        "Potato___healthy",
        "Tomato___Bacterial_spot",
        "Tomato___Early_blight",
        "Tomato___healthy"
    ]

DISEASE_CLASSES = load_disease_classes()

# --- PyTorch CNN Architecture (Must match train.py exactly) ---
class LeafCNN(nn.Module):
    def __init__(self, num_classes=10):
        super(LeafCNN, self).__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 16, kernel_size=3, padding=1),
            nn.BatchNorm2d(16),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            
            nn.Conv2d(16, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(2, 2)
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(64 * 28 * 28, 128),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(128, num_classes)
        )
        
    def forward(self, x):
        x = self.features(x)
        x = self.classifier(x)
        return x

_model = None

def load_prediction_model():
    """Loads the pre-trained PyTorch model from disk."""
    global _model
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_dir, "..", "plant_disease_model.pth")
    
    if not os.path.exists(model_path):
        raise FileNotFoundError(
            f"Trained model '{model_path}' not found. "
            "Please run 'python train.py' first to train and save the model."
        )
    
    if _model is None:
        print(f"Loading PyTorch model weights from {model_path}...")
        device = torch.device("cpu") # Default to CPU for web serving
        _model = LeafCNN(num_classes=len(DISEASE_CLASSES))
        # Load state dictionary mapping tensors to CPU
        state_dict = torch.load(model_path, map_location=device, weights_only=True)
        _model.load_state_dict(state_dict)
        _model.to(device)
        _model.eval()
        print("Model loaded successfully.")
    return _model

def predict_disease(image_path):
    """
    Loads an image, preprocesses it, runs inference, and returns the 
    predicted class and confidence score.
    """
    # Load model
    model = load_prediction_model()
    
    # Open image using PIL and ensure RGB mode
    img = Image.open(image_path).convert("RGB")
    
    # Apply standard torchvision transformations
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor() # maps pixels to [0.0, 1.0]
    ])
    img_tensor = transform(img)
    
    # Add batch dimension: shape (1, 3, 224, 224)
    img_tensor = img_tensor.unsqueeze(0)
    
    # Run prediction
    with torch.no_grad():
        outputs = model(img_tensor)
        probabilities = torch.softmax(outputs, dim=1)
        confidence, class_idx = torch.max(probabilities, dim=1)
        
    confidence_val = float(confidence.item())
    predicted_class = DISEASE_CLASSES[class_idx.item()]
    
    return predicted_class, confidence_val
