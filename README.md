# 🚗 Vehicle Rental System

- Live URL - https://vehicle-rental-system-lac.vercel.app

---

## 🎯 Project Overview

A backend API for a vehicle rental management system that handles:

- **Vehicles** - Manage vehicle inventory with availability tracking
- **Customers** - Manage customer accounts and profiles
- **Bookings** - Handle vehicle rentals, returns and cost calculation
- **Authentication** - Secure role-based access control (Admin and Customer roles)

---

## 🛠️ Technology Stack

- **Node.js** + **TypeScript**
- **Express.js** (web framework)
- **PostgreSQL** (database)
- **bcrypt** (password hashing)
- **jsonwebtoken** (JWT authentication)

---

## ⚙️ Setup & Usage Instructions

You can test the API directly from Postman using the live server.

### Prerequisites

Make sure you have Postman installed on your system:

### Authentication

| Method | Endpoint              | Access | Description                 |
| ------ | --------------------- | ------ | --------------------------- |
| POST   | `/api/v1/auth/signup` | Public | Register new user account   |
| POST   | `/api/v1/auth/signin` | Public | Login and receive JWT token |

---

### Vehicles

| Method | Endpoint                      | Access     | Description                                                                             |
| ------ | ----------------------------- | ---------- | --------------------------------------------------------------------------------------- |
| POST   | `/api/v1/vehicles`            | Admin only | Add new vehicle with name, type, registration, daily rent price and availability status |
| GET    | `/api/v1/vehicles`            | Public     | View all vehicles in the system                                                         |
| GET    | `/api/v1/vehicles/:vehicleId` | Public     | View specific vehicle details                                                           |
| PUT    | `/api/v1/vehicles/:vehicleId` | Admin only | Update vehicle details, daily rent price or availability status                         |
| DELETE | `/api/v1/vehicles/:vehicleId` | Admin only | Delete vehicle (only if no active bookings exist)                                       |

---

### Users

| Method | Endpoint                | Access       | Description                                                                   |
| ------ | ----------------------- | ------------ | ----------------------------------------------------------------------------- |
| GET    | `/api/v1/users`         | Admin only   | View all users in the system                                                  |
| PUT    | `/api/v1/users/:userId` | Admin or Own | Admin: Update any user's role or details<br>Customer: Update own profile only |
| DELETE | `/api/v1/users/:userId` | Admin only   | Delete user (only if no active bookings exist)                                |

---

### Bookings

| Method | Endpoint                      | Access            | Description                                                                                                                                                         |
| ------ | ----------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/api/v1/bookings`            | Customer or Admin | Create booking with start/end dates<br>• Validates vehicle availability<br>• Calculates total price (daily rate × duration)<br>• Updates vehicle status to "booked" |
| GET    | `/api/v1/bookings`            | Role-based        | Admin: View all bookings<br>Customer: View own bookings only                                                                                                        |
| PUT    | `/api/v1/bookings/:bookingId` | Role-based        | Customer: Cancel booking (before start date only)<br>Admin: Mark as "returned" (updates vehicle to "available")<br>System: Auto-mark as "returned" when period ends |
