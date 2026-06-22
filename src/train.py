import os
import random
import json
import numpy as np
from PIL import Image, ImageDraw
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import transforms, datasets
from torch.utils.data import DataLoader

# Set random seed for reproducibility
random.seed(42)
np.random.seed(42)
torch.manual_seed(42)
if torch.cuda.is_available():
    torch.cuda.manual_seed_all(42)

# Define classes in alphabetical order
DISEASE_CLASSES = [
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

def generate_synthetic_leaf(class_name, output_path):
    """Generates a synthetic 224x224 leaf image corresponding to the class name."""
    # Create 224x224 RGB image with off-white/grey textured background
    bg_color = (random.randint(235, 245), random.randint(230, 240), random.randint(225, 235))
    img = Image.new("RGB", (224, 224), color=bg_color)
    draw = ImageDraw.Draw(img)
    
    # Draw leaf center
    cx, cy = 112, 112
    rx = random.randint(60, 75)
    ry = random.randint(80, 95)
    
    # Select leaf color base based on class name
    if "healthy" in class_name:
        leaf_color = (46, 160, 55)      # Bright healthy green
    elif "Late_blight" in class_name:
        leaf_color = (65, 100, 50)      # Dull, decaying green
    elif "Early_blight" in class_name:
        leaf_color = (85, 120, 45)      # Yellowish-green
    elif "Bacterial_spot" in class_name:
        leaf_color = (55, 135, 50)      # Moderate green
    elif "Black_rot" in class_name:
        leaf_color = (50, 110, 55)      # Deep dark green
    elif "Common_rust" in class_name:
        leaf_color = (110, 140, 50)     # Brownish-green
    else:
        leaf_color = (34, 139, 34)      # Standard green
        
    # Draw leaf shape (main body)
    draw.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=leaf_color, outline=(25, 85, 25), width=2)
    
    # Draw pointed tip of the leaf
    draw.polygon([(cx - 15, cy - ry), (cx, cy - ry - 22), (cx + 15, cy - ry)], fill=leaf_color, outline=(25, 85, 25))
    
    # Draw petiole/stem
    draw.line([cx, cy + ry, cx, cy + ry + 20], fill=(101, 67, 33), width=4)
    
    # Draw veins (lighter green/yellow)
    vein_color = (140, 210, 90)
    # Main center vein
    draw.line([cx, cy - ry - 10, cx, cy + ry], fill=vein_color, width=2)
    # Lateral veins
    for i in range(-ry + 20, ry - 20, 20):
        y_pos = cy + i
        offset = abs(i) // 4
        # Left side vein
        draw.line([cx, y_pos, cx - rx + offset, y_pos - 15], fill=vein_color, width=1)
        # Right side vein
        draw.line([cx, y_pos, cx + rx - offset, y_pos - 15], fill=vein_color, width=1)

    # Apply class-specific disease spots/marks
    if "Bacterial_spot" in class_name:
        # Small black spots with yellow halos
        for _ in range(random.randint(15, 30)):
            sx = random.randint(cx - rx + 15, cx + rx - 15)
            sy = random.randint(cy - ry + 15, cy + ry - 15)
            dist = ((sx - cx)**2) / rx**2 + ((sy - cy)**2) / ry**2
            if dist < 0.8:
                # Yellow halo
                draw.ellipse([sx - 5, sy - 5, sx + 5, sy + 5], fill=(225, 225, 40))
                # Small dark spot
                draw.ellipse([sx - 2, sy - 2, sx + 2, sy + 2], fill=(20, 20, 20))
                
    elif "Early_blight" in class_name:
        # Dark brown concentric target spots
        for _ in range(random.randint(4, 7)):
            sx = random.randint(cx - rx//2, cx + rx//2)
            sy = random.randint(cy - ry//2, cy + ry//2)
            dist = ((sx - cx)**2) / rx**2 + ((sy - cy)**2) / ry**2
            if dist < 0.7:
                for r in [9, 6, 3]:
                    # Alter colors for target appearance
                    color_val = 60 + r * 5
                    draw.ellipse([sx - r, sy - r, sx + r, sy + r], fill=(color_val, color_val - 20, color_val - 40))
                    
    elif "Late_blight" in class_name:
        # Dark, large, irregular water-soaked patches with fuzzy white edges
        for _ in range(random.randint(2, 4)):
            sx = random.randint(cx - rx + 15, cx + rx - 15)
            sy = random.randint(cy - ry + 15, cy + ry - 15)
            dist = ((sx - cx)**2) / rx**2 + ((sy - cy)**2) / ry**2
            if dist < 0.8:
                # White fuzzy borders
                draw.ellipse([sx - 16, sy - 16, sx + 16, sy + 16], fill=(240, 240, 240))
                # Water soaked dark area
                draw.ellipse([sx - 14, sy - 14, sx + 14, sy + 14], fill=(30, 45, 25))
                
    elif "Black_rot" in class_name:
        # Distinct black rotting wedges/patches
        for _ in range(random.randint(4, 8)):
            sx = random.randint(cx - rx + 15, cx + rx - 15)
            sy = random.randint(cy - ry + 15, cy + ry - 15)
            dist = ((sx - cx)**2) / rx**2 + ((sy - cy)**2) / ry**2
            if dist < 0.8:
                draw.ellipse([sx - 12, sy - 12, sx + 12, sy + 12], fill=(10, 10, 10))
                
    elif "Common_rust" in class_name:
        # Pustules that are orange/reddish-brown
        for _ in range(random.randint(25, 40)):
            sx = random.randint(cx - rx + 12, cx + rx - 12)
            sy = random.randint(cy - ry + 12, cy + ry - 12)
            dist = ((sx - cx)**2) / rx**2 + ((sy - cy)**2) / ry**2
            if dist < 0.85:
                # Rusty orange base
                draw.ellipse([sx - 4, sy - 3, sx + 4, sy + 3], fill=(160, 75, 10))
                # Bright orange spore center
                draw.ellipse([sx - 2, sy - 2, sx + 2, sy + 2], fill=(210, 115, 20))
                
    # Save the generated leaf image
    img.save(output_path)

def create_dataset():
    """Generates the train and validation datasets of synthetic leaf images."""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_dir = os.path.join(base_dir, "..", "dataset")
    print("Generating synthetic dataset...")
    
    # Train and validation splits
    splits = {
        "train": 50,      # 50 images per class
        "validation": 15  # 15 images per class
    }
    
    for split, count in splits.items():
        split_dir = os.path.join(dataset_dir, split)
        os.makedirs(split_dir, exist_ok=True)
        
        for class_name in DISEASE_CLASSES:
            class_dir = os.path.join(split_dir, class_name)
            os.makedirs(class_dir, exist_ok=True)
            
            print(f"  Generating {count} images for {split}/{class_name}...")
            for i in range(count):
                img_path = os.path.join(class_dir, f"leaf_{i:03d}.png")
                generate_synthetic_leaf(class_name, img_path)
                
    print("Dataset generation completed!")

# --- PyTorch CNN Architecture ---

class LeafCNN(nn.Module):
    def __init__(self, num_classes=10):
        super(LeafCNN, self).__init__()
        self.features = nn.Sequential(
            # Block 1: Input size (3, 224, 224) -> Output (16, 112, 112)
            nn.Conv2d(3, 16, kernel_size=3, padding=1),
            nn.BatchNorm2d(16),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            
            # Block 2: Input size (16, 112, 112) -> Output (32, 56, 56)
            nn.Conv2d(16, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            
            # Block 3: Input size (32, 56, 56) -> Output (64, 28, 28)
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

def build_and_train_model():
    """Builds, trains, and saves the PyTorch CNN model."""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_dir = os.path.join(base_dir, "..", "dataset")
    train_dir = os.path.join(dataset_dir, "train")
    val_dir = os.path.join(dataset_dir, "validation")
    
    # Check device
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")
    
    # Image Transforms (rescaling is handled by ToTensor returning [0,1])
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor()
    ])
    
    # Load Datasets
    print("Loading datasets...")
    train_dataset = datasets.ImageFolder(train_dir, transform=transform)
    val_dataset = datasets.ImageFolder(val_dir, transform=transform)
    
    # Assert class index alignments
    assert train_dataset.classes == DISEASE_CLASSES, "Mismatch in dataset directory sorting classes"
    
    # Save class labels for inference
    class_names_path = os.path.join(base_dir, "..", "class_names.json")
    with open(class_names_path, "w", encoding="utf-8") as f:
        json.dump(train_dataset.classes, f, indent=2)
    
    # DataLoaders
    train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False)
    
    # Initialize Model, Loss, Optimizer
    print("Building PyTorch CNN architecture...")
    model = LeafCNN(num_classes=len(DISEASE_CLASSES)).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    
    epochs = 10
    print(f"Starting training for {epochs} epochs...")
    
    for epoch in range(epochs):
        model.train()
        running_loss = 0.0
        correct_train = 0
        total_train = 0
        
        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)
            
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item() * images.size(0)
            _, predicted = torch.max(outputs, 1)
            total_train += labels.size(0)
            correct_train += (predicted == labels).sum().item()
            
        epoch_loss = running_loss / len(train_loader.dataset)
        epoch_acc = correct_train / total_train
        
        # Validation evaluation
        model.eval()
        correct_val = 0
        total_val = 0
        val_loss = 0.0
        
        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                loss = criterion(outputs, labels)
                val_loss += loss.item() * images.size(0)
                _, predicted = torch.max(outputs, 1)
                total_val += labels.size(0)
                correct_val += (predicted == labels).sum().item()
                
        epoch_val_loss = val_loss / len(val_loader.dataset)
        epoch_val_acc = correct_val / total_val
        
        print(f"Epoch {epoch+1}/{epochs} - "
              f"Train Loss: {epoch_loss:.4f}, Train Acc: {epoch_acc*100:.2f}% | "
              f"Val Loss: {epoch_val_loss:.4f}, Val Acc: {epoch_val_acc*100:.2f}%")
              
    # Save the model state dictionary
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_name = os.path.join(base_dir, "..", "plant_disease_model.pth")
    print(f"Saving trained model weights to {model_name}...")
    torch.save(model.state_dict(), model_name)
    print("Training pipeline finished successfully!")

if __name__ == "__main__":
    # Create dataset folders and generate images
    create_dataset()
    # Build and train the PyTorch model
    build_and_train_model()
