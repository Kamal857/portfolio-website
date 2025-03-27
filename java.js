// Dark/Light Mode Toggle
const toggleButton = document.getElementById("theme-toggle");

toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
});

// Set the initial theme based on localStorage
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
    document.body.classList.add(savedTheme);
}

// Typing Effect for "Web Developer"
const typingElement = document.querySelector(".web-developer");
const textToType = "Web Developer";
let index = 0;

function typeWriter() {
    if (index < textToType.length) {
        typingElement.innerHTML += textToType.charAt(index);
        index++;
        setTimeout(typeWriter, 100); // Speed of typing
    }
}

window.onload = () => {
    typeWriter(); // Start typing effect when the page loads
};

// Scroll Animation for Sections
const sections = document.querySelectorAll("section");

const observer = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animate");
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    },
    { threshold: 0.5 } // 50% of the section should be visible for animation to trigger
);

sections.forEach(section => {
    observer.observe(section);
});
