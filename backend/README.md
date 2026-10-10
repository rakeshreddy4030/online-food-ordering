# Food Ordering System - Backend

Java 17 + Spring Boot 3 + Spring Security (JWT) + Spring Data JPA + MySQL.
REST API only. The web pages are in a separate repo: `food-ordering-frontend`.

## Run
1. Install JDK 17+, Maven and MySQL. Make sure MySQL is running.
2. Copy `.env.example` to `.env` in this folder (next to `pom.xml`) and set your MySQL password and a secure JWT secret. These values override the defaults in `src/main/resources/application.properties`; alternatively, configure Spring settings with environment variables such as `SPRING_DATASOURCE_PASSWORD` and `APP_JWT_SECRET`.
3. Run: `mvn spring-boot:run`
4. API runs on http://localhost:8080

The database `food_ordering_v2_db` and all tables are created automatically.
Default admin: admin@food.com / admin123. Sample restaurants and food are added on first run.

## Docker
Build and run from this directory:

```sh
docker build -t food-ordering:latest .
docker run -d --name food-ordering -p 8080:8080 --env-file .env food-ordering:latest
```

Configure `.env` before starting the container. Set `DBURL` to a MySQL address reachable from inside the container; `localhost` refers to the container itself, not the host machine. The image does not include `.env` or credentials. The API is available at http://localhost:8080.

## Main endpoints
- POST /api/auth/register, POST /api/auth/login
- GET /api/restaurants, GET /api/restaurants/{id}/foods
- POST /api/restaurants/{id}/rate (customer), GET /api/restaurants/{id}/my-rating
- POST /api/orders, GET /api/orders/my
- Admin: /api/restaurants, /api/foods, /api/orders/admin/*

CORS allows the deployed frontend at https://online-food-ordering-flax.vercel.app and local development servers on http://localhost:* and http://127.0.0.1:*.
