let sceneEl = document.querySelector('#sceneE1');
let isMarkerVisible = false;
let scaleFactor = 1;
let initialTouchData = {
  x: 0,
  y: 0
};
let initialPinchDistance = 0;

// Attach event listeners for markerFound and markerLost
const markers = sceneEl.querySelectorAll('a-marker');

markers.forEach(marker => {
  const entity = marker.querySelector('a-entity');

  // Marker visibility events
  marker.addEventListener('markerFound', () => {
    isMarkerVisible = true;
    alert('Marker found!');
  });

  marker.addEventListener('markerLost', () => {
    isMarkerVisible = false;
  });

  // Track touch events for rotation (one-finger movement)
  entity.addEventListener('touchstart', (event) => handleTouchStart(event, entity));
  entity.addEventListener('touchmove', (event) => handleTouchMove(event, entity));
  entity.addEventListener('touchend', (event) => handleTouchEnd(event, entity));

  // Track pinch gesture for scaling (two-finger movement)
  entity.addEventListener('touchstart', (event) => handlePinchStart(event, entity));
  entity.addEventListener('touchmove', (event) => handlePinchMove(event, entity));
});


// Handle rotation for one-finger movement
function handleTouchStart(event, el) {
  if (event.touches.length === 1 && isMarkerVisible) {
    // Store the initial touch positions for rotation
    initialTouchData.x = event.touches[0].pageX;
    initialTouchData.y = event.touches[0].pageY;
  }

  // Handle pinch start for scaling (two-finger event)
  if (event.touches.length === 2 && isMarkerVisible) {
    initialPinchDistance = getPinchDistance(event);
  }
}

function handleTouchMove(event, el) {
  if (isMarkerVisible) {
    if (event.touches.length === 1) {
      // Handle rotation (one-finger swipe)
      const dx = event.touches[0].pageX - initialTouchData.x;
      const dy = event.touches[0].pageY - initialTouchData.y;

      const rotationFactor = 0.01;
      el.object3D.rotation.y += dx * rotationFactor;
      el.object3D.rotation.x += dy * rotationFactor;

      // Update initial touch data for next move event
      initialTouchData.x = event.touches[0].pageX;
      initialTouchData.y = event.touches[0].pageY;
    } 
    else if (event.touches.length === 2) {
      // Handle pinch move (two-finger gesture for scaling)
      const currentPinchDistance = getPinchDistance(event);
      const scaleChange = currentPinchDistance - initialPinchDistance;

      scaleFactor *= 1 + scaleChange * 0.01; // Scaling factor (adjust multiplier as needed)

      // Clamp scale factor between min and max scale values
      scaleFactor = Math.min(Math.max(scaleFactor, el.dataset.minScale || 0.5), el.dataset.maxScale || 3);

      // Apply the scale to the entity
      let initialScale = el.object3D.scale;
      el.object3D.scale.set(
        initialScale.x * scaleFactor,
        initialScale.y * scaleFactor,
        initialScale.z * scaleFactor
      );

      // Update initial pinch distance for next move event
      initialPinchDistance = currentPinchDistance;
    }
  }
}

// Handle touch end (reset pinch/rotation states)
function handleTouchEnd(event, el) {
  if (isMarkerVisible) {
    // Reset touch data
    initialTouchData = {
      x: 0,
      y: 0
    };
    initialPinchDistance = 0;
  }
}

// Utility function to calculate the pinch distance between two fingers
function getPinchDistance(event) {
  const dx = event.touches[0].pageX - event.touches[1].pageX;
  const dy = event.touches[0].pageY - event.touches[1].pageY;
  return Math.sqrt(dx * dx + dy * dy); // Return Euclidean distance
}
