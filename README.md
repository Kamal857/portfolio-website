<div align="center">

# 🚀 Kamal Bohara — Portfolio

**A modern, fast, single-page portfolio built with React + Vite**

[![Live Site](https://img.shields.io/badge/🌐_Live_Site-kamalbohara857.com.np-38bdf8?style=for-the-badge)](https://kamalbohara857.com.np)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![GitHub Pages](https://img.shields.io/badge/Deployed-GitHub_Pages-222?style=for-the-badge&logo=github)](https://github.com/Kamal857/portfolio-website)

</div>

---

## 📌 About

This is my personal portfolio website — a showcase of my skills, education, projects, and research as a Computer Engineering student from Nepal. The site was originally built with plain HTML/CSS and has been fully migrated to **React (SPA)** for instant page transitions, better maintainability, and modern developer experience.

---

## ✨ Features

- ⚡ **Blazing fast** — Vite-powered build with instant HMR during development
- 🔀 **Single Page Application** — No full-page reloads, instant navigation via `react-router-dom`
- 🌊 **Glassmorphism Navbar** — Scroll-aware header with animated underline links and hamburger menu
- ⌨️ **Typewriter animation** — Hero section cycles through roles with a blinking cursor effect
- 📱 **Fully responsive** — Mobile sidebar with overlay, optimized for all screen sizes
- 🎨 **Sky-blue theme** — Custom color palette across buttons, borders, gradients, and highlights
- 📬 **Working contact form** — Powered by [Formspree](https://formspree.io), with React state-managed loading/success/error feedback
- 🚀 **Automated deployment** — GitHub Actions builds and deploys to `gh-pages` on every push to `master`
- 🌐 **Custom domain** — Served at `kamalbohara857.com.np` via CNAME

---

## 🗂️ Project Structure

```
📦 portfolio-website
├── public/                    # Static public assets
├── src/
│   ├── assets/                # Images (logo, portraits)
│   │   ├── logo.png
│   │   ├── pg.jpg
│   │   └── kamal.jpg
│   ├── components/
│   │   ├── Navbar.jsx         # Responsive navbar + mobile sidebar
│   │   └── Footer.jsx         # Social links + copyright
│   ├── pages/
│   │   ├── Home.jsx           # Landing page with typewriter hero
│   │   ├── About.jsx          # About me section
│   │   ├── Contact.jsx        # Contact form (Formspree)
│   │   ├── Research.jsx       # Research blogs
│   │   └── Projects.jsx       # Projects showcase
│   ├── App.jsx                # Routes configuration
│   ├── main.jsx               # Entry point with HashRouter
│   └── index.css              # Global styles (full custom CSS)
├── .github/
│   └── workflows/
│       └── deploy.yml         # CI/CD → GitHub Pages deployment
├── index.html                 # Vite root template
├── vite.config.js
└── package.json
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 8 |
| Routing | React Router DOM v7 |
| Styling | Vanilla CSS (custom design system) |
| Icons | Remix Icon + Font Awesome |
| Fonts | Google Fonts — Outfit |
| Contact Form | Formspree |
| Deployment | GitHub Actions → GitHub Pages |
| Domain | Custom CNAME (`kamalbohara857.com.np`) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js `18+`
- npm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Kamal857/portfolio-website.git
cd portfolio-website

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The output will be in the `dist/` folder, ready for deployment.

### Preview Production Build Locally

```bash
npm run preview
```

---

## 📦 Deployment

The site is automatically deployed to GitHub Pages via **GitHub Actions** on every push to `master`.

The workflow (`.github/workflows/deploy.yml`) does the following:
1. Installs dependencies (`npm ci`)
2. Builds the React app (`npm run build`)
3. Writes the `CNAME` file for the custom domain
4. Pushes the `dist/` folder to the `gh-pages` branch

> To deploy manually after merging, just push to `master` — the action handles the rest.

---

## 📄 Pages

| Route | Page | Description |
|---|---|---|
| `/` | Home | Hero section, education, skills, about & contact preview |
| `/about` | About | Full bio and contact info |
| `/research` | Research | Research blogs and articles |
| `/projects` | Projects | Showcase of projects |
| `/contact` | Contact | Formspree-powered contact form |

---

## 📬 Contact

| Platform | Link |
|---|---|
| ✉️ Email | [boharakamal857@gmail.com](mailto:boharakamal857@gmail.com) |
| 💼 LinkedIn | [kamal-bohara-a00629331](https://linkedin.com/in/kamal-bohara-a00629331) |
| 🐙 GitHub | [@Kamal857](https://github.com/Kamal857) |
| 📘 Facebook | [kamal.bohara.573128](https://www.facebook.com/kamal.bohara.573128) |

---

<div align="center">

© 2025 **Kamal Bohara**. All rights reserved.

*Built with ❤️ in Nepal*

</div>
