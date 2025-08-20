# QA Preview Notes — Astro Frontend

Build status:
- Command: `npm run build`
- Result: Success (static build completed)
- Pages generated: Home (/), Student (/student), Admin (/admin), Routes (/routes), Reports (/reports)

Preview:
- Command: `npm run preview -- --host 0.0.0.0 --port 3000`
- Result: Running on port 3001 (3000 in use)
- Local: http://localhost:3001/
- Network: http://172.17.0.2:3001/

What to validate manually in browser:
1) Navigation
- Home -> Student, Admin, Routes, Reports via Header/Sidebar links
- Ensure 200 load and content visible on each route

2) Student Portal
- Route list renders mock data
- Route detail displays schedule & occupancy
- Seat map component renders interactivity
- Pass registration modal opens/closes; transitions are smooth

3) Admin Portal
- Bus table displays mock listings
- Bus/Driver Assign/Schedule forms open (if modal) and submit (mock)
- Route Manager actions render

4) Reports
- Bar, Line, Pie charts render via Chart.js client islands
- Interactions (tooltip/hover) behave

5) UI Polish
- Modal overlay fade-in/out, scale transitions
- Sidebar slide/transition and active link styles
- Card hover and small motion/opacity transitions
- Theme toggle appears and updates scheme (if present)

6) Responsiveness
- Viewports: 375, 768, 1024, 1440
- Sidebar collapses; grids stack properly; charts remain legible

Notes:
- If charts do not render, check console for client-island JavaScript errors.
- If a port conflict prevents preview, re-run `npm run preview -- --port 3002`.

Status:
- As of this run, build completed successfully and preview server started at port 3001.
- Headless navigation not possible in current environment; manual browser checks recommended using the URLs above or IDE proxy.

