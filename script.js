let sceneEl = document.querySelector('#sceneE1');
let isMarkerVisible = false;
let scaleFactor = 1;

// Attach event listeners to each a-entity in the scene
const entities = sceneEl.querySelectorAll('a-entity');
entities.forEach(el => {
  el.addEventListener("trackpad", (event) => handleRotation(event, el));
  el.addEventListener("pinchmove", (event) => handleScale(event, el));
});

sceneEl.addEventListener("markerFound", (e) => {
  isMarkerVisible = true;
  alert("Marker found!");
});

sceneEl.addEventListener("markerLost", (e) => {
  isMarkerVisible = false;
});

function handleRotation(event, el) {
  if (isMarkerVisible) {
    // Apply rotation to the specific entity (el)
    el.object3D.rotation.y += event.detail.positionChange.x * rotationFactor;
    el.object3D.rotation.x += event.detail.positionChange.y * rotationFactor;
  }
}

function handleScale(event, el) {
  if (isMarkerVisible) {
    let initialScale = {
      x: el.object3D.scale.x,
      y: el.object3D.scale.y,
      z: el.object3D.scale.z,
    };

    scaleFactor *= 1 + event.detail.spreadChange / event.detail.startSpread;
    scaleFactor = Math.min(
      Math.max(scaleFactor, el.data.minScale),  // Use `el.data.minScale` and `el.data.maxScale` if they are set in your entity
      el.data.maxScale
    );

    // Apply scaling to the specific entity (el)
    el.object3D.scale.x = scaleFactor * initialScale.x;
    el.object3D.scale.y = scaleFactor * initialScale.y;
    el.object3D.scale.z = scaleFactor * initialScale.z;
  }
}
