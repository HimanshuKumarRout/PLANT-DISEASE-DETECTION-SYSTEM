<div align="center">
  <h1>🌿 Plant Disease Detection System</h1>
  <p>
    <strong>A deep learning-based web application for detecting plant diseases using image recognition and machine learning.</strong>
  </p>
  <p>
    <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&amp;logo=python&amp;logoColor=white" />
    <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&amp;logo=flask&amp;logoColor=white" />
    <img src="https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&amp;logo=pytorch&amp;logoColor=white" />
    <img src="https://img.shields.io/badge/Deep%20Learning-AI-success?style=for-the-badge" />
  </p>
</div>

<br />

## 🌟 Overview

**Plant Disease Detection System** is a machine learning-powered web application that detects plant diseases from uploaded leaf images using deep learning and computer vision techniques.

Built with **Flask** and **PyTorch**, the system analyzes plant images in real time and predicts diseases with confidence scores, helping farmers, researchers, and agriculture enthusiasts identify crop issues quickly and efficiently.

---

## 🚀 Key Features

* 🌿 **Disease Detection** – Identify plant diseases from uploaded images
* 🤖 **Deep Learning Model** – PyTorch-based image classification
* 📸 **Image Upload Support** – Analyze plant leaf images instantly
* ⚡ **Real-Time Predictions** – Fast disease detection with confidence scores
* 🌍 **Multiple Plant Types Supported**
* 🖥️ **Flask Web Interface** – User-friendly responsive UI
* 📊 **Confidence Score Display** – View prediction accuracy

---

## 🌱 Supported Plant Diseases

### 🍎 Apple

* Black Rot
* Healthy

### 🌽 Corn

* Common Rust
* Healthy

### 🥔 Potato

* Early Blight
* Late Blight
* Healthy

### 🍅 Tomato

* Bacterial Spot
* Early Blight
* Healthy

---

## 🧩 Extending Dataset Support

This project can support additional plant types and disease categories if you add new labeled image folders to the dataset and retrain the model.

To add a new plant or disease:

1. Create a new class folder using the format `Plant___Disease` under:
   - `dataset/train/`
   - `dataset/validation/`
2. Place labeled images in both folders.
3. Run:

```bash
python src/train.py
```

The training process will save `class_names.json` and `plant_disease_model.pth` so the web app can recognize the new classes.

---

## 🛠️ Tech Stack

* **Python 3.x**
* **Flask**
* **PyTorch**
* **HTML5**
* **CSS3**
* **JavaScript**

---

## 📁 Project Structure

```text
PLANT-DISEASE-DETECTION-SYSTEM/
├── app.py                         # Flask application entry point
├── src/
│   ├── model_utils.py             # Model loading & inference
│   ├── train.py                   # Model training script
│   └── disease_info.py            # Disease information database
│
├── templates/
│   └── index.html                 # Web interface template
│
├── static/
│   ├── css/
│   │   └── style.css              # Styling
│   ├── js/
│   │   └── main.js                # Frontend logic
│   └── uploads/                   # Uploaded images
│
├── dataset/
│   ├── train/                     # Training dataset
│   └── validation/                # Validation dataset
│
├── plant_disease_model.pth        # Pre-trained model weights
├── requirements.txt               # Python dependencies
└── README.md                      # Documentation
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/HimanshuKumarRout/plant-disease-detection-system.git
cd PLANT-DISEASE-DETECTION-SYSTEM
```

---

### 2️⃣ Create a Virtual Environment

```bash
python -m venv venv
```

#### Activate Environment

##### Windows

```bash
venv\Scripts\activate
```

##### Linux / macOS

```bash
source venv/bin/activate
```

---

### 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

---

## ▶️ Running the Application

### Start the Flask Server

```bash
python app.py
```

The application will run at:

```text
http://localhost:5000
```

---

## 🧠 Training the Model

To retrain the deep learning model:

```bash
python src/train.py
```

---

## 🖥️ How to Use

1. Open the web application in your browser
2. Upload a plant leaf image
3. Click **Analyze**
4. View:

   * Disease prediction
   * Confidence score
   * Disease information

---

## 🤖 Model Details

* **Framework:** PyTorch
* **Architecture:** Deep Learning CNN Model
* **Input Size:** 224×224 RGB Images
* **Weights File:** `plant_disease_model.pth`
* **Output:** Disease prediction with confidence scores

---

## 🔌 API Endpoints

| Method | Endpoint   | Description                   |
| ------ | ---------- | ----------------------------- |
| GET    | `/`        | Home Page                     |
| POST   | `/predict` | Upload image & get prediction |

---

## 🔮 Future Enhancements

* 📱 Mobile-responsive advanced UI
* 🌐 Cloud deployment support
* 📊 Disease analytics dashboard
* 🌿 More plant disease categories
* 🧠 Transfer learning optimization
* 📷 Live camera disease detection
* 🔔 Treatment recommendation system

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a branch (`feature/new-feature`)
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

## 👨‍💻 Author

**Himanshu Kumar Rout**

* GitHub: [https://github.com/HimanshuKumarRout](https://github.com/HimanshuKumarRout)
* Email: [himanshurout136@gmail.com](mailto:himanshurout136@gmail.com)

---

## ⭐ Support

If you like this project, please **star ⭐ the repository** and share it!

---

<p align="center">Built with 🌿 using Deep Learning & Flask</p>
