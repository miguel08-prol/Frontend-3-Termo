const dropZone = document.getElementById('dropZone');

['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.style.background = "#f0f8ff";
    }, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.style.background = "transparent";
    }, false);
});

dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files[0]);
});

function handleFiles(file) {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('imagePreview').src = e.target.result;
            document.getElementById('uploadPrompt').style.display = 'none';
            document.getElementById('imagePreviewContainer').style.display = 'block';
            document.getElementById('shareBtn').style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
}