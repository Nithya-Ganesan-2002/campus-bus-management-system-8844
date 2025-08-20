# Astro + Tailwind Minimal Starter

This project uses Astro 5 with TailwindCSS and PostCSS. A minimal, animated and responsive theme is configured with the following tokens:
- primary: `#1e40af`
- secondary: `#0ea5e9`
- accent: `#f59e42`

Global styles live in `src/styles/global.css` and are included in `src/layouts/Layout.astro`.

## 🚀 Project Structure

```
/
├── postcss.config.js
├── tailwind.config.js
├── public/
├── src/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   └── styles/global.css
└── package.json
```

## 🧞 Commands

Run from the project root:

| Command         | Action                                    |
| --------------- | ----------------------------------------- |
| `npm install`   | Install dependencies                      |
| `npm run dev`   | Start dev server (Astro + Tailwind)       |
| `npm run build` | Build production                          |
| `npm run preview` | Preview the production build            |

Tailwind scans files from `src/**/*` via `tailwind.config.js`.

## ✨ Theming

- Use `bg-primary`, `text-secondary`, `bg-accent` etc.
- Utility classes for buttons: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-accent`
- Components: `.card`, `.section`, and animations `.anim-fade-in`, `.anim-scale-in`

Dark mode is toggled using the existing `ThemeToggle` component, which switches CSS variables consumed by the base layer.
