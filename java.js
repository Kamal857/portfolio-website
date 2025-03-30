// Dark/Light Mode Toggle with Local Storage
const toggleButton = document.getElementById("theme-toggle");
const body = document.body;

function setTheme(theme) {
    body.classList.toggle("dark-mode", theme === "dark");
    localStorage.setItem("theme", theme);
    toggleButton.textContent = theme === "dark" ? "☀️" : "🌙";
}

// Load saved theme from localStorage
const savedTheme = localStorage.getItem("theme") || "light";
setTheme(savedTheme);

toggleButton.addEventListener("click", () => {
    setTheme(body.classList.contains("dark-mode") ? "light" : "dark");
});

// Typing Effect for "Web Developer"
const typingElement = document.querySelector(".web-developer");
const textToType = "Web Developer";
let index = 0;

function typeWriter() {
    if (index < textToType.length) {
        typingElement.textContent += textToType.charAt(index);
        index++;
        setTimeout(typeWriter, 100);
    }
}

document.addEventListener("DOMContentLoaded", typeWriter);

// Scroll Animation for Sections
const observer = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animate");
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.5 }
);

document.querySelectorAll("section").forEach(section => observer.observe(section));
document.addEventListener("DOMContentLoaded", () => {
    gsap.from(".fade-in", {opacity: 0, y: 50, duration: 1, stagger: 0.3});
});

// Background Animation on Mouse Move
const bgElement = document.createElement("div");
bgElement.classList.add("background-animation");
document.body.appendChild(bgElement);

document.addEventListener("mousemove", (event) => {
    const { clientX: x, clientY: y } = event;
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    const moveX = (x / width - 0.5) * 100;
    const moveY = (y / height - 0.5) * 100;
    
    bgElement.style.transform = `translate(${moveX}px, ${moveY}px)`;
});
// Create a canvas for the moving stars
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.zIndex = "-1";

let stars = [];
const numStars = 100;

// Resize canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createStars();
}

// Generate stars
function createStars() {
    stars = [];
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5
        });
    }
}

// Animate stars
function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";

    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        star.x += star.speedX;
        star.y += star.speedY;

        // Wrap around edges
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;
    });

    requestAnimationFrame(animateStars);
}

// Initialize the animation
resizeCanvas();
animateStars();
window.addEventListener("resize", resizeCanvas);

