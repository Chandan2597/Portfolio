# Chandan Koiri — Portfolio

## Folder Structure

```
portfolio/
├── index.html          ← Main HTML file
├── css/
│   └── style.css       ← All styles (dark/light theme, layout, animations)
├── js/
│   └── main.js         ← Particle canvas, theme toggle, scroll reveal, modals
├── images/
│   └── about-photo.jpg ← Add your profile photo here (any size, will be cropped round)
└── videos/
    ├── churn-demo.mp4
    ├── mediora-demo.mp4
    ├── bookrec-demo.mp4
    ├── textsum-demo.mp4
    ├── hotel-demo.mp4
    ├── zencommerce-demo.mp4
    ├── project7-demo.mp4
    └── project8-demo.mp4
```

## How to Use

### Adding Your Profile Photo
1. Place your photo in the `images/` folder as `about-photo.jpg`
2. In `index.html`, find the About section and:
   - Remove the `<div class="about-photo-placeholder">` block
   - Uncomment the `<img src="images/about-photo.jpg" ...>` line

### Adding Demo Videos
1. Record or export your project demo as an `.mp4` file
2. Place it in the `videos/` folder with the matching filename (e.g. `churn-demo.mp4`)
3. The placeholder card will automatically show the video + play button

### Adding a New Project
Copy any project card block in `index.html` and update:
- The `data-video` attribute to your new video filename
- The placeholder icon emoji
- The project tags, title, description
- The GitHub link

### Dark / Light Mode
The toggle button in the nav switches themes. Preference is saved in `localStorage`.

## Features
- ✨ Live particle canvas background (inspired by antigravity.google)
- 🌙/☀️ Dark / Light mode toggle
- 📖 "Read more" toggle in the About section
- 🎬 Demo video cards with modal player
- 🔄 Scroll-reveal animations
- 📱 Fully responsive (mobile-friendly)
- ⚡ No dependencies — pure HTML, CSS, JS
