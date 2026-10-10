# Food Ordering System - React Frontend

React (Vite) version of the plain HTML/JS frontend. It talks to the Spring Boot backend.

## Pages (routes)
| Route | Page |
|---|---|
| `/` | Login / Register |
| `/menu` | Restaurant list with search and star ratings |
| `/restaurant/:id` | Menu, cart, rate with stars |
| `/orders` | My orders |
| `/admin` | Admin dashboard |

## Run locally
1. Start the backend (http://localhost:8080).
2. In this folder:
   ```
   npm install
   npm run dev
   ```
3. Open http://localhost:5173

> The backend CORS config (`SecurityConfig.java`) must allow `http://localhost:5173`.

Admin login: admin@food.com / admin123

## Deploy (Render backend + Vercel frontend)
1. Open `.env.production` and put your Render URL:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
   (no trailing slash)
2. Import the `frontend` folder into Vercel and use the default Vite build settings.
3. Add your Vercel URL (https://your-site.vercel.app) to the allowed origins in the
   backend `SecurityConfig.java`, push to GitHub, and let Render redeploy.

The repo includes `vercel.json` so that React Router paths like `/menu` keep working
when refreshed on Vercel.

## Project structure
```
src/
  main.jsx            entry point (BrowserRouter)
  App.jsx             routes
  api.js              fetch helper + API URL (VITE_API_URL)
  style.css           same styles as the HTML version
  components/         Navbar, ProtectedRoute, Stars/RatingLine
  pages/              Login, Menu, Restaurant, Orders, Admin
```
