// Valentine Bounce - Interaktivt Animationsskript
// Hanterar klick- och pekskärmshändelser för studsanimation

document.addEventListener('DOMContentLoaded', function() {
    const content = document.querySelector(".content");

    // Lägg till händelselyssnare för klick- och pekinteraktioner
    content.addEventListener("click", bounce);
    content.addEventListener("touchstart", handleTouch, { passive: true });

    // Hantera pekskärmshändelser för mobila enheter
    function handleTouch(event) {
        event.preventDefault();
        bounce();
    }

    // Huvudfunktion för studsanimation
    function bounce() {
        content.classList.add("bounce");

        // Ta bort bounce-klassen när animationen är klar
        setTimeout(() => {
            content.classList.remove("bounce");
        }, 6000);
    }
});