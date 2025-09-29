// Valentine Bounce - Interactive Animation Script
// Handles click and touch events for bounce animation

document.addEventListener('DOMContentLoaded', function() {
    const content = document.querySelector(".content");

    // Add event listeners for click and touch interactions
    content.addEventListener("click", bounce);
    content.addEventListener("touchstart", handleTouch, { passive: true });

    // Handle touch events for mobile devices
    function handleTouch(event) {
        event.preventDefault();
        bounce();
    }

    // Main bounce animation function
    function bounce() {
        content.classList.add("bounce");

        // Remove bounce class after animation completes
        setTimeout(() => {
            content.classList.remove("bounce");
        }, 6000);
    }
});