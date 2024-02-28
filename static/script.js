document.addEventListener('scroll', function() {
    let scrollSpeed = window.scrollY;
    let slideIns = document.querySelectorAll('.slide-in-right, .slide-in-left');
    slideIns.forEach(function(slideIn) {
        let animationDuration = Math.min(1, scrollSpeed / 1000); // Adjust the divisor for speed
        slideIn.style.animationDuration = animationDuration + 's';
    });
});
