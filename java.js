// snowfall.js - Plug-and-play external JS
(function() {
    // Create full-screen canvas
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none'; // doesn't block clicks
    canvas.style.zIndex = '9999';
    const ctx = canvas.getContext('2d');

    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Snowflake properties
    const snowflakes = [];
    const numFlakes = 200;
    for (let i = 0; i < numFlakes; i++) {
        snowflakes.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            radius: Math.random() * 3 + 1,
            speed: Math.random() * 1 + 0.5,
            wind: Math.random() * 1 - 0.5
        });
    }

    // Draw snowflakes
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.beginPath();
        for (let flake of snowflakes) {
            ctx.moveTo(flake.x, flake.y);
            ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        }
        ctx.fill();
        move();
        requestAnimationFrame(draw);
    }

    // Move snowflakes
    function move() {
        for (let flake of snowflakes) {
            flake.y += flake.speed;
            flake.x += flake.wind;

            if (flake.y > canvas.height) {
                flake.y = 0;
                flake.x = Math.random() * canvas.width;
            }
            if (flake.x > canvas.width) flake.x = 0;
            if (flake.x < 0) flake.x = canvas.width;
        }
    }

    draw();
})();
