// BioShield Frontend Application Controller

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const dropZone = document.getElementById("drop-zone");
    const fileInput = document.getElementById("file-input");
    const previewContainer = document.getElementById("preview-container");
    const imagePreview = document.getElementById("image-preview");
    const removeBtn = document.getElementById("remove-btn");
    const analyzeBtn = document.getElementById("analyze-btn");
    const errorAlert = document.getElementById("error-alert");
    const errorText = document.getElementById("error-text");
    const resultsSection = document.getElementById("results-section");
    const emptyState = document.getElementById("empty-state");
    const analysisLoader = document.getElementById("analysis-loader");
    const loaderStatus = document.getElementById("loader-status");
    const resultContainer = document.getElementById("result-container");
    
    // Result details elements
    const resPlantName = document.getElementById("res-plant-name");
    const resDiseaseName = document.getElementById("res-disease-name");
    const resConfidenceValue = document.getElementById("res-confidence-value");
    const resConfidenceRing = document.getElementById("res-confidence-ring");
    const resImageUrl = document.getElementById("res-image-url");
    const resHealthStatus = document.getElementById("res-health-status");
    const resHealthText = document.getElementById("res-health-text");
    
    const symptomsList = document.getElementById("res-symptoms-list");
    const causesList = document.getElementById("res-causes-list");
    const preventionList = document.getElementById("res-prevention-list");
    const treatmentList = document.getElementById("res-treatment-list");
    
    const sampleButtons = document.querySelectorAll(".sample-btn");
    
    let activeFile = null;

    // --- Drag & Drop / Input Selection Handlers ---

    // Open file dialog when clicking drop zone (unless clicking remove button)
    dropZone.addEventListener("click", (e) => {
        if (e.target.closest("#remove-btn")) return;
        fileInput.click();
    });

    fileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    });

    // Drag-over styling
    ["dragenter", "dragover"].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.add("dragover");
        }, false);
    });

    ["dragleave", "drop"].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove("dragover");
        }, false);
    });

    // Handle dropped files
    dropZone.addEventListener("drop", (e) => {
        const dt = e.dataTransfer;
        if (dt.files.length > 0) {
            handleFileSelect(dt.files[0]);
        }
    });

    function handleFileSelect(file) {
        // Validate type
        if (!file.type.startsWith("image/")) {
            showError("Invalid file type", "Please upload an image file (PNG, JPG, or WEBP).");
            return;
        }

        activeFile = file;
        errorAlert.classList.add("hidden");

        // Display image preview
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            previewContainer.classList.remove("hidden");
            dropZone.querySelector(".upload-prompt").classList.add("hidden");
            analyzeBtn.classList.remove("hidden");
        };
        reader.readAsDataURL(file);
    }

    // Remove selected image
    removeBtn.addEventListener("click", () => {
        resetUploadZone();
        showEmptyState();
    });

    function resetUploadZone() {
        activeFile = null;
        fileInput.value = "";
        imagePreview.src = "";
        previewContainer.classList.add("hidden");
        dropZone.querySelector(".upload-prompt").classList.remove("hidden");
        analyzeBtn.classList.add("hidden");
        errorAlert.classList.add("hidden");
    }

    // --- Tab Switcher Logic ---

    const tabLinks = document.querySelectorAll(".tab-link");
    tabLinks.forEach(tab => {
        tab.addEventListener("click", () => {
            // Deactivate all tabs
            tabLinks.forEach(t => t.classList.remove("active"));
            document.querySelectorAll(".tab-view").forEach(view => view.classList.remove("active"));

            // Activate current tab
            tab.classList.add("active");
            const activeViewId = tab.getAttribute("data-tab");
            document.getElementById(activeViewId).classList.add("active");
        });
    });

    // --- API Prediction Handlers ---

    // Trigger analysis for uploaded files
    analyzeBtn.addEventListener("click", () => {
        if (!activeFile) return;
        
        const formData = new FormData();
        formData.append("file", activeFile);
        
        runInference("/predict", {
            method: "POST",
            body: formData
        });
    });

    // Trigger analysis for Sample Gallery items
    sampleButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const className = btn.getAttribute("data-class");
            resetUploadZone();
            
            // Highlight select sample inside dropzone
            // We show a placeholder preview representing the sample
            const thumbnailBg = btn.querySelector(".sample-thumbnail").style.background;
            imagePreview.src = ""; // Clear file preview
            
            runInference(`/predict_sample?class_name=${className}`, {
                method: "GET"
            });
        });
    });

    // Core inference ajax function
    function runInference(url, fetchConfig) {
        showLoader();
        
        // Dynamic status updates to emulate model workflow
        const statusPhrases = [
            "Initializing neural layers...",
            "Rescaling tensors to 224x224x3...",
            "Running convolutional feature extraction...",
            "Warming fully-connected nodes...",
            "Calculating softmax probabilities...",
            "Compiling treatment strategy..."
        ];
        
        let phraseIdx = 0;
        const statusInterval = setInterval(() => {
            if (phraseIdx < statusPhrases.length) {
                loaderStatus.textContent = statusPhrases[phraseIdx++];
            }
        }, 500);

        fetch(url, fetchConfig)
            .then(response => {
                if (!response.ok) {
                    // Try to parse json error, or throw generic
                    return response.json().then(err => { throw err; }).catch(() => {
                        throw new Error(`Server returned status code ${response.status}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                clearInterval(statusInterval);
                if (data.success) {
                    renderResult(data);
                } else {
                    showError("Diagnosis Failed", data.error || "An unknown error occurred.");
                }
            })
            .catch(error => {
                clearInterval(statusInterval);
                console.error("Inference Error:", error);
                const message = error.error || error.message || "Failed to communicate with Flask backend.";
                showError("Inference Error", message);
            });
    }

    // --- State UI Toggles ---

    function showLoader() {
        emptyState.classList.add("hidden");
        resultContainer.classList.add("hidden");
        analysisLoader.classList.remove("hidden");
        loaderStatus.textContent = "Loading deep learning matrices...";
    }

    function showEmptyState() {
        analysisLoader.classList.add("hidden");
        resultContainer.classList.add("hidden");
        emptyState.classList.remove("hidden");
    }

    function showError(title, message) {
        analysisLoader.classList.add("hidden");
        resultContainer.classList.add("hidden");
        emptyState.classList.remove("hidden");
        
        errorText.textContent = message;
        document.getElementById("error-title").textContent = title + ":";
        errorAlert.classList.remove("hidden");
    }

    function renderResult(data) {
        analysisLoader.classList.add("hidden");
        
        // Set basic metadata
        resPlantName.textContent = data.plant_name;
        resDiseaseName.textContent = data.disease_name;
        resConfidenceValue.textContent = `${data.confidence}%`;
        resImageUrl.src = data.image_url;
        
        // Update health status pill
        const isHealthy = data.disease_name.toLowerCase() === "healthy";
        if (isHealthy) {
            resHealthStatus.className = "scan-status-pill healthy";
            resHealthText.textContent = "Healthy Foliage";
        } else {
            resHealthStatus.className = "scan-status-pill diseased";
            resHealthText.textContent = "Pathogen Detected";
        }

        // Animate circular gauge
        // Circumference is 2 * Math.PI * r = 2 * 3.14159 * 34 = 213.6
        const circumference = 213.6;
        const offset = circumference - (data.confidence / 100) * circumference;
        resConfidenceRing.style.strokeDashoffset = offset;
        
        // Set colors of gauge and badges depending on health
        if (isHealthy) {
            resConfidenceRing.style.stroke = "var(--healthy-color)";
        } else {
            resConfidenceRing.style.stroke = "var(--primary)";
        }

        // Populate lists
        populateList(symptomsList, data.symptoms);
        populateList(causesList, data.causes);
        populateList(preventionList, data.prevention);
        populateList(treatmentList, data.treatment);

        // Switch to Symptoms tab by default
        tabLinks[0].click();

        // Reveal result panel
        resultContainer.classList.remove("hidden");
    }

    function populateList(listElement, itemsArray) {
        listElement.innerHTML = "";
        if (!itemsArray || itemsArray.length === 0) {
            const li = document.createElement("li");
            li.textContent = "No data available.";
            listElement.appendChild(li);
            return;
        }
        
        itemsArray.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            listElement.appendChild(li);
        });
    }
});
