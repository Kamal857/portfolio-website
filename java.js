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
