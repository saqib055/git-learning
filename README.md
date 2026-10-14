# LearnLab — General Foundations

A responsive, accessible learning interface built with **vanilla HTML, CSS and JavaScript**. Topics: Git, Google search operators, and beginner programming concepts.

## Run

Because the app uses native JavaScript modules, serve the folder over HTTP rather than opening `index.html` directly using `file://`.

```bash
python -m http.server 8000
```

Open http://localhost:8000 in your browser.

## Tests

Requires Node.js 18+:

```bash
node --test logic.test.mjs
```

## Features

- Responsive card layout, mobile-friendly navigation, visible focus states and reduced-motion support
- Accessible WAI-ARIA tab pattern with left/right arrow, Home, End, Tab and Enter/Space support
- Knowledge checks for all three lessons with feedback and completion tracking
- Local storage progress persistence and reset action
- Google search query builder with useful operators and clipboard support
- JavaScript condition simulator using safe, validated numeric input (no `eval`)
- Pure, testable helper functions in `logic.mjs`
