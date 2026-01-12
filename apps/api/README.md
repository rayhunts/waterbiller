# Water Billing Management API

A production-ready water billing management system built with **Bun + Elysia + Drizzle** using **Clean Architecture** (3-layer pattern).

## 🏗️ Architecture Overview

This API follows Clean Architecture principles with clear separation of concerns across three layers:

### **1. Core Layer** (Business Logic)
- **Entities**: Domain models with business rules
- **Services**: Business logic orchestration
- **Interfaces**: Repository contracts (Dependency Inversion)

### **2. Infrastructure Layer** (Implementation)
- **Database**: Drizzle ORM schemas and connection
- **Repositories**: Data access implementations

### **3. API Layer** (Presentation)
- **Routes**: HTTP endpoint definitions
- **Handlers**: Request/response processing
- **Middleware**: Authentication, error handling
- **Validators**: Request validation schemas

### **Shared Layer** (Cross-cutting concerns)
- **Utils**: Date, calculation, validation utilities
- **Types**: Common type definitions
- **Config**: Application configuration

## 📁 Project Structure

```
src/
├── core/                          # Business Logic Layer
│   ├── entities/                  # 5 domain entities
│   │   ├── customer.entity.ts
│   │   ├── meter.entity.ts
│   │   ├── meter-reading.entity.ts
│   │   ├── bill.entity.ts
│   │   └── payment.entity.ts
│   ├── services/                  # 5 business services
│   │   ├── customer.service.ts
│   │   ├── meter.service.ts
│   │   ├── reading.service.ts
│   │   ├── billing.service.ts
│   │   ├── payment.service.ts
│   │   └── index.ts
│   └── interfaces/
│       └── repositories.interface.ts
│
├── infrastructure/                # Implementation Layer
│   ├── database/
│   │   ├── connection.ts          # Database connection
│   │   └── schema/                # Drizzle schemas
│   │       ├── users.ts
│   │       ├── meters.ts
│   │       ├── readings.ts
│   │       ├── bills.ts
│   │       ├── payments.ts
│   │       └── index.ts
│   └── repositories/              # 5 repository implementations
│       ├── customer.repository.ts
│       ├── meter.repository.ts
│       ├── reading.repository.ts
│       ├── bill.repository.ts
│       └── payment.repository.ts
│
├── api/                           # Presentation Layer
│   ├── routes/                    # 6 route modules
│   │   ├── auth.routes.ts
│   │   ├── customers.routes.ts
│   │   ├── meters.routes.ts
│   │   ├── readings.routes.ts
│   │   ├── bills.routes.ts
│   │   └── payments.routes.ts
│   ├── handlers/                  # 6 handler modules
│   │   ├── auth.handler.ts
│   │   ├── customer.handler.ts
│   │   ├── meter.handler.ts
│   │   ├── reading.handler.ts
│   │   ├── bill.handler.ts
│   │   └── payment.handler.ts
│   ├── middleware/
│   │   └── auth.middleware.ts
│   └── validators/
│       └── schemas.ts
│
├── shared/                        # Shared Utilities
│   ├── utils/
│   │   ├── date.utils.ts
│   │   ├── calculation.utils.ts
│   │   └── validation.utils.ts
│   ├── types/
│   │   └── common.types.ts
│   └── config/
│       └── app.config.ts
│
└── index.ts                       # Application entry point
```

## 🚀 Getting Started

### Prerequisites
- **Bun** 1.3.4+
- **PostgreSQL** database

### Installation

```bash
# Install dependencies
bun install

# Copy environment variables
cp .env.example .env

# Configure your DATABASE_URL in .env
# Example: DATABASE_URL=postgresql://user:password@localhost:5432/waterbiller
```

### Database Setup

```bash
# Generate migration from schema
bun run db:generate

# Run migrations
bun run db:migrate

# Or push schema directly (development only)
bun run db:push

# Open Drizzle Studio (database GUI)
bun run db:studio
```

### Development

```bash
# Start development server with watch mode
bun run dev

# Server will start on http://localhost:3000
```

## 📊 Database Schema

### Tables

#### **users** (Customers)
- id (serial, primary key)
- account_number (varchar, unique)
- name (varchar)
- username (varchar, unique)
- email (varchar, unique)
- password (varchar, hashed)
- phone (varchar, nullable)
- address (text, nullable)
- status (varchar) - active/inactive
- created_at, updated_at (timestamp)

#### **meters**
- id (uuid, primary key)
- meter_number (varchar, unique)
- customer_id (integer, foreign key)
- location (varchar)
- installation_date (timestamp)
- status (varchar)
- created_at, updated_at (timestamp)

#### **meter_readings**
- id (uuid, primary key)
- meter_id (uuid, foreign key)
- customer_id (integer, foreign key)
- reading_date (timestamp)
- previous_reading (integer)
- current_reading (integer)
- consumption (integer)
- image_url (varchar, nullable)
- notes (text, nullable)
- created_at (timestamp)

#### **bills**
- id (uuid, primary key)
- customer_id (integer, foreign key)
- meter_reading_id (uuid, foreign key)
- billing_period (varchar)
- previous_reading (integer)
- current_reading (integer)
- consumption (integer)
- rate_per_unit (decimal)
- base_charge (decimal)
- total_amount (decimal)
- due_date (timestamp)
- status (varchar)
- created_at, updated_at (timestamp)

#### **payments**
- id (uuid, primary key)
- bill_id (uuid, foreign key)
- customer_id (integer, foreign key)
- amount (decimal)
- payment_date (timestamp)
- payment_method (varchar)
- transaction_reference (varchar)
- status (varchar)
- created_at (timestamp)

## 💰 Billing Logic

### Tiered Pricing System

```
Tier 1: 0-10 units   = $2 per unit
Tier 2: 11-50 units  = $3 per unit
Tier 3: 50+ units    = $4 per unit
Base Charge: $5 (applied to all bills)
```

**Example: 65 units consumed**
- First 10 units: 10 × $2 = $20
- Next 40 units: 40 × $3 = $120
- Remaining 15 units: 15 × $4 = $60
- Subtotal: $200
- Base charge: $5
- **Total: $205**

## 🔌 API Endpoints

### Authentication
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user info

### Customers
- `GET /customers` - List all (with optional search)
- `GET /customers/:id` - Get by ID
- `POST /customers` - Create new
- `PUT /customers/:id` - Update
- `DELETE /customers/:id` - Deactivate
- `GET /customers/:id/bills` - Get bills
- `GET /customers/:id/payments` - Get payments

### Meters
- `GET /meters` - List all
- `GET /meters/:id` - Get by ID
- `POST /meters` - Register new
- `PUT /meters/:id` - Update
- `POST /meters/:id/assign` - Assign to customer
- `GET /meters/:id/readings` - Get readings

### Readings
- `GET /readings` - List all
- `GET /readings/:id` - Get by ID
- `POST /readings` - Record single
- `POST /readings/bulk` - Bulk import
- `GET /readings/customer/:id` - Get customer readings

### Bills
- `GET /bills` - List all (with filters)
- `GET /bills/:id` - Get by ID
- `POST /bills/generate` - Generate from reading
- `POST /bills/:id/cancel` - Cancel bill
- `GET /bills/overdue/list` - Get overdue
- `GET /bills/stats/dashboard` - Get statistics
- `GET /bills/customer/:id` - Get customer bills

### Payments
- `GET /payments` - List all
- `GET /payments/:id` - Get by ID
- `POST /payments` - Record payment
- `GET /payments/customer/:id` - Get customer payments

## 🔐 Authentication

All endpoints except `/auth/login` require JWT authentication.

**Login:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

**Authenticated Request:**
```bash
curl -X GET http://localhost:3000/customers \
  -H "Authorization: Bearer <token>"
```

## 🛠️ Technology Stack

- **Runtime**: Bun 1.3.4+
- **Framework**: Elysia.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT (@elysiajs/jwt)
- **Validation**: TypeBox
- **API Docs**: OpenAPI/Swagger

## 🎯 Key Features

✅ Clean Architecture (3-layer pattern)
✅ JWT authentication
✅ Automatic consumption calculation
✅ Tiered billing system
✅ Overdue bill detection
✅ Bulk reading imports
✅ Dashboard statistics
✅ Type-safe with TypeScript
✅ Repository pattern
✅ Service layer
✅ Dependency injection

## 📄 API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:3000/swagger

## 📝 License

MIT
