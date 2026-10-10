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

## Deploy (Render backend + Netlify frontend)
1. Open `.env.production` and put your Render URL:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
   (no trailing slash)
2. Build:
   ```
   npm run build
   ```
3. Drag and drop the **`dist`** folder to https://app.netlify.com (Sites -> drag and drop).
4. Add your Netlify URL (https://your-site.netlify.app) to the allowed origins in the
   backend `SecurityConfig.java`, push to GitHub, and let Render redeploy.

The file `public/_redirects` is already included so that refreshing a page like `/menu`
works on Netlify.

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
