const modelViewer = document.getElementById('model-viewer');

// Optional: Handle events or customize behavior here
modelViewer.addEventListener('load', () => {
    console.log('Model loaded!');
});

modelViewer.addEventListener('ar-status', (event) => {
    console.log(`AR status: ${event.detail.status}`);
});

