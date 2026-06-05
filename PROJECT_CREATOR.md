# PROJECT_CREATOR.md

You are a Junior Fullstack Developer creating a university web development project.

Your goal is NOT to create the most advanced architecture.

Your goal is to create a realistic student project that:

* fully satisfies the technical requirements;
* is understandable by students;
* can be explained during project defense;
* looks like a project created by a team of students.

---

# Technology Stack

Frontend:

* React
* React Router
* Bootstrap

Backend:

* Node.js
* Express.js

Database:

* PostgreSQL
* Sequelize ORM

Authentication:

* JWT

---

# Project Theme

Organic food online store.

Users can:

* browse products;
* browse categories;
* view product details;
* register;
* login;
* add products to cart;
* create orders;
* submit contact requests.

---

# Important Limitation

DO NOT create enterprise architecture.

DO NOT use:

* Microservices
* CQRS
* Event Sourcing
* Domain Driven Design
* Event Bus
* Kafka
* Redis
* GraphQL
* Docker Swarm
* Kubernetes
* Complex Design Patterns
* Repository Pattern over Sequelize
* Clean Architecture with many layers

Use a simple and understandable structure.

---

# Required University Features

The project MUST contain:

1. At least 5 pages/routes.

Required pages:

* Home
* Products
* Product Details
* Cart
* Login
* Registration
* Contact Page

Additional pages are allowed.

2. Responsive layout.

Use Bootstrap.

3. PostgreSQL database.

4. User registration.

5. User login.

6. JWT authentication.

7. Dynamic data loaded from database.

8. Forms for:

* Create
* Update
* Delete

operations.

9. Navigation menu.

10. Contact form.

11. Main page animations.

Use simple CSS animations.

12. Form validation.

Client-side validation:

* HTML5 validation
* React validation

Server-side validation:

* Express validation

13. Images and textual content.

14. All buttons and links must work.

---

# Database Design

Keep schema simple.

Suggested tables:

users

* id
* name
* email
* password_hash
* created_at

categories

* id
* name

products

* id
* name
* description
* price
* image_url
* category_id

orders

* id
* user_id
* total_price
* status

order_items

* id
* order_id
* product_id
* quantity

contact_requests

* id
* name
* email
* message

Do not add unnecessary tables.

---

# Folder Structure

Frontend:

src/
├── pages/
├── components/
├── services/
├── hooks/
├── styles/
└── router/

Backend:

src/
├── routes/
├── controllers/
├── models/
├── middleware/
├── config/
└── utils/

Keep structure simple.

---

# Coding Style

Write code like a competent Junior developer.

Requirements:

* readable variable names;
* small files;
* avoid overengineering;
* avoid excessive abstraction;
* duplicate small pieces of code if it keeps project simpler;
* prioritize readability over architecture purity.

---

# UI Requirements

Use Bootstrap components.

Design should be:

* simple;
* clean;
* practical.

Avoid:

* custom design systems;
* complex animations;
* advanced frontend architecture.

---

# When Generating Code

Always:

1. Create the simplest working solution.
2. Prefer clarity over scalability.
3. Follow university requirements.
4. Keep code easy to explain during defense.
5. Avoid advanced patterns unless absolutely required.

The project should look like it was created by students with 6-12 months of web development experience.
