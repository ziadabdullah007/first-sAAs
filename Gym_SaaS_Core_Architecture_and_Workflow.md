# Gym SaaS --- Core Architecture & Workflow

## 1. Project Overview

This project is a **multi-tenant Gym Management SaaS**.

The main idea is to provide one platform where multiple gyms can manage
their daily operations while keeping each gym's data isolated.

The system has two major applications:

-   **Frontend:** React + TypeScript + Vite
-   **Backend:** FastAPI + SQLAlchemy + PostgreSQL/Supabase

The backend exposes REST APIs, handles authentication/authorization and
business logic, and persists gym data in PostgreSQL. The frontend
consumes those APIs and provides dashboards and management screens.

------------------------------------------------------------------------

## 2. High-Level Architecture

``` text
                    ┌─────────────────────────┐
                    │       React Frontend    │
                    │ TypeScript + Vite       │
                    │                         │
                    │ Dashboard               │
                    │ Members                 │
                    │ Attendance              │
                    │ Plans                   │
                    │ Subscriptions           │
                    │ Payments                │
                    │ Staff                   │
                    │ Measurements            │
                    └────────────┬────────────┘
                                 │
                         HTTP REST / JSON
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │     FastAPI Backend     │
                    │                         │
                    │ API Routes              │
                    │ Authentication          │
                    │ Authorization           │
                    │ Business Services       │
                    │ Repositories             │
                    │ SQLAlchemy ORM           │
                    └────────────┬────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
          ┌──────────────────┐      ┌──────────────────┐
          │ Supabase Auth    │      │ PostgreSQL       │
          │                  │      │                  │
          │ Users / JWT      │      │ Gyms             │
          │ Token validation │      │ Members          │
          └──────────────────┘      │ Plans            │
                                    │ Subscriptions    │
                                    │ Payments         │
                                    │ Attendance       │
                                    │ Staff            │
                                    │ Measurements     │
                                    └──────────────────┘
```

------------------------------------------------------------------------

# 3. Core Business Idea

The system is built around a **Gym/Tenant**.

A simplified relationship is:

``` text
Platform
   │
   ├── Gym A
   │     ├── Staff
   │     ├── Members
   │     ├── Plans
   │     ├── Subscriptions
   │     ├── Payments
   │     ├── Attendance
   │     └── Measurements
   │
   ├── Gym B
   │     ├── Staff
   │     ├── Members
   │     ├── Plans
   │     ├── Subscriptions
   │     ├── Payments
   │     ├── Attendance
   │     └── Measurements
   │
   └── Gym C
         └── ...
```

The important SaaS concept is:

> A user belonging to Gym A should not be able to access Gym B's data.

This is called **multi-tenant data isolation**.

------------------------------------------------------------------------

# 4. User Roles

The project defines four main roles:

  Role            Main Responsibility
  --------------- -----------------------------------
  `super_admin`   Controls the entire SaaS platform
  `gym_admin`     Manages one gym
  `staff`         Performs operational gym tasks
  `owner`         High-level gym management

## Super Admin

The super admin operates at the platform level.

Typical responsibilities:

-   Manage gyms
-   Manage platform users
-   Manage SaaS subscriptions
-   View platform-level information

Frontend routes include:

``` text
/gyms
/users
/saas-subscriptions
/super-dashboard
```

## Gym Admin

The gym admin operates inside a specific gym.

Typical responsibilities:

-   Manage members
-   Manage plans
-   Manage subscriptions
-   Manage payments
-   Manage staff
-   Manage gym profile
-   View dashboard
-   Manage measurements and attendance

## Staff

Staff members perform operational tasks such as:

-   Member management
-   Attendance
-   Payments
-   Measurements
-   Subscriptions

Their access is intentionally more limited than a gym admin.

## Owner

The owner has high-level gym permissions and is used for gym-level
management operations.

------------------------------------------------------------------------

# 5. Backend Architecture

The backend is organized using layers.

``` text
HTTP Request
     │
     ▼
API Route
     │
     ▼
Authentication / Authorization
     │
     ▼
Service Layer
     │
     ▼
Repository Layer
     │
     ▼
SQLAlchemy Model
     │
     ▼
PostgreSQL
```

This separation is one of the most important concepts in the project.

------------------------------------------------------------------------

# 6. API Routes

Location:

``` text
gym-saas-backend/app/api/v1/
```

Important route modules:

``` text
auth_routes.py
member_routes.py
gym_routes.py
staff_routes.py
plan_routes.py
subscription_routes.py
payment_routes.py
attendance_routes.py
body_measurement_routes.py
dashboard_routes.py
```

Each route represents an API entry point.

For example:

``` text
POST /auth/login
POST /auth/register

GET    /members
POST   /members
PUT    /members/{member_id}
DELETE /members/{member_id}

GET    /subscriptions
POST   /subscriptions
PUT    /subscriptions/{subscription_id}
DELETE /subscriptions/{subscription_id}
```

The route should mainly deal with:

1.  Receiving HTTP input
2.  Validating input
3.  Checking authentication/permissions
4.  Calling the service
5.  Returning the response

Business rules should preferably stay in the service layer rather than
inside the route.

------------------------------------------------------------------------

# 7. Schemas

Location:

``` text
gym-saas-backend/app/schemas/
```

Schemas use **Pydantic**.

Examples:

``` text
auth_schema.py
member_schema.py
gym_schema.py
staff_schema.py
plan_schema.py
subscription_schema.py
payment_schema.py
attendance_schema.py
body_measurement_schema.py
```

Schemas define the shape of API input and output.

Example conceptual request:

``` json
{
  "name": "Ahmed Ali",
  "phone": "01000000000",
  "email": "ahmed@example.com"
}
```

The Pydantic schema validates whether the request has the expected
structure.

------------------------------------------------------------------------

# 8. Services

Location:

``` text
gym-saas-backend/app/services/
```

Services contain the **business logic**.

Examples:

``` text
auth_service.py
member_service.py
gym_service.py
staff_service.py
plan_service.py
subscription_service.py
payment_service.py
attendance_service.py
body_measurement_service.py
dashboard_service.py
```

For example, creating a member conceptually looks like:

``` text
Route
  ↓
MemberService.create_member()
  ↓
prepare member data
  ↓
attach gym_id
  ↓
MemberRepository.create()
  ↓
Database
```

The service is therefore the place where the application decides **what
should happen**, rather than only how HTTP works.

------------------------------------------------------------------------

# 9. Repositories

Location:

``` text
gym-saas-backend/app/repositories/
```

Repositories are the data-access layer.

Examples:

``` text
member_repository.py
subscription_repository.py
payment_repository.py
attendance_repository.py
staff_repository.py
plan_repository.py
gym_repository.py
user_profile_repository.py
```

Their responsibility is primarily database operations such as:

``` text
get
get_by_id
get_all
create
update
delete
```

This creates a useful separation:

``` text
Service = business rules

Repository = database operations
```

------------------------------------------------------------------------

# 10. Models

Location:

``` text
gym-saas-backend/app/models/
```

The SQLAlchemy models represent database entities.

Main entities include:

``` text
Gym
UserProfile
Member
Staff
Plan
Subscription
Payment
Attendance
BodyMeasurement
GymSubscription
SaaSPlan
```

A simplified domain model is:

``` text
UserProfile
     │
     │ belongs to
     ▼
    Gym
     │
     ├───────────────┐
     ▼               ▼
  Members           Staff
     │
     ├───────────────┐
     ▼               ▼
Subscriptions      Payments
     │
     ▼
    Plan

Members
   │
   ├── Attendance
   └── Body Measurements
```

------------------------------------------------------------------------

# 11. Database Flow

When a request needs database data:

``` text
Frontend
   │
   │ HTTP
   ▼
FastAPI Route
   │
   ▼
Service
   │
   ▼
Repository
   │
   ▼
SQLAlchemy
   │
   ▼
PostgreSQL
```

The repository executes the database operation and returns the
model/data back through the same layers.

------------------------------------------------------------------------

# 12. Authentication Workflow

Authentication uses **Supabase Auth** and bearer tokens.

The basic workflow is:

``` text
User
 │
 │ email + password
 ▼
Frontend Login
 │
 │ POST /auth/login
 ▼
FastAPI
 │
 ▼
AuthService
 │
 ▼
Supabase Auth
 │
 │ authenticated user / token
 ▼
Frontend stores auth token
```

For later requests:

``` text
Frontend
   │
   │ Authorization: Bearer <token>
   ▼
FastAPI
   │
   ▼
get_current_user()
   │
   ▼
Supabase validates token
   │
   ▼
Find UserProfile
   │
   ▼
Get gym_id + role
   │
   ▼
Continue to protected endpoint
```

The backend dependency code uses the token to ask Supabase for the
authenticated user, then retrieves the application's `UserProfile`.

------------------------------------------------------------------------

# 13. Authorization Workflow

Authentication answers:

> Who are you?

Authorization answers:

> What are you allowed to do?

The project uses role-based authorization.

Conceptually:

``` text
Request
   │
   ▼
Bearer Token
   │
   ▼
Authenticated User
   │
   ├── role
   └── gym_id
        │
        ▼
Role Checker
        │
        ├── Allowed → Continue
        │
        └── Not allowed → 403
```

For example, member creation allows:

``` text
gym_admin
staff
owner
```

while some member operations are restricted to:

``` text
gym_admin
staff
```

------------------------------------------------------------------------

# 14. Multi-Tenant Isolation

This is one of the most important architectural concepts.

A gym-level user has a `gym_id`.

When the backend retrieves or modifies gym-owned data, the operation
should use that `gym_id` as a tenant boundary.

Example:

``` text
Current User

id:       user-123
role:     gym_admin
gym_id:   gym-A
```

Then:

``` text
GET /members
```

should effectively become:

``` text
Get members WHERE gym_id = gym-A
```

rather than:

``` text
Get every member
```

This prevents Gym A from seeing Gym B's members.

Conceptually:

``` text
Gym A User
   │
   └── gym_id = A
           │
           ▼
     Members filtered by A


Gym B User
   │
   └── gym_id = B
           │
           ▼
     Members filtered by B
```

This is critical for a SaaS application.

------------------------------------------------------------------------

# 15. Member Management Workflow

A typical member creation flow:

``` text
Gym Admin / Staff
       │
       ▼
Frontend Members Page
       │
       ▼
POST /members
       │
       ▼
Member Route
       │
       ▼
Role Check
       │
       ▼
MemberService.create_member()
       │
       ├── validate/process data
       ├── attach gym_id
       └── create member
              │
              ▼
       MemberRepository
              │
              ▼
          PostgreSQL
              │
              ▼
        Created Member
              │
              ▼
           JSON Response
              │
              ▼
          Frontend UI
```

------------------------------------------------------------------------

# 16. Subscription Workflow

A subscription connects a member with a membership plan.

Conceptually:

``` text
Member
  │
  ▼
Choose Plan
  │
  ▼
Create Subscription
  │
  ├── member_id
  ├── plan_id
  ├── dates
  └── status
       │
       ▼
PostgreSQL
```

The service currently initializes newly created subscriptions with:

``` text
status = "active"
```

Then subscriptions can be retrieved, updated, or deleted through the
subscription API.

------------------------------------------------------------------------

# 17. Payment Workflow

Payments represent financial transactions associated with
members/subscriptions.

Typical flow:

``` text
Member
   │
   ▼
Subscription
   │
   ▼
Payment
   │
   ├── amount
   ├── payment information
   └── timestamps
         │
         ▼
     PostgreSQL
```

The frontend exposes payment management through:

``` text
/ payments
```

and the backend provides:

``` text
payment_routes.py
payment_service.py
payment_repository.py
payment.py
payment_schema.py
```

------------------------------------------------------------------------

# 18. Attendance Workflow

Attendance records gym visits.

Conceptually:

``` text
Member arrives
     │
     ▼
Staff checks member
     │
     ▼
Attendance API
     │
     ▼
Attendance Service
     │
     ▼
Attendance Repository
     │
     ▼
PostgreSQL
```

This allows the gym to track member attendance history.

------------------------------------------------------------------------

# 19. Body Measurements Workflow

The system also stores member fitness measurements.

Example conceptual workflow:

``` text
Member
   │
   ▼
Take measurements
   │
   ▼
POST measurement
   │
   ▼
BodyMeasurementService
   │
   ▼
BodyMeasurementRepository
   │
   ▼
Database
```

This enables tracking progress over time.

------------------------------------------------------------------------

# 20. Dashboard Workflow

The dashboard aggregates business information.

``` text
Frontend Dashboard
       │
       ▼
GET /dashboard
       │
       ▼
Dashboard Route
       │
       ▼
Dashboard Service
       │
       ├── members
       ├── subscriptions
       ├── payments
       ├── attendance
       └── other metrics
              │
              ▼
          PostgreSQL
              │
              ▼
       Aggregated result
              │
              ▼
         React Dashboard
```

The frontend uses charts and dashboard components to visualize the
returned metrics.

------------------------------------------------------------------------

# 21. Frontend Architecture

The frontend is located in:

``` text
frontend/src/
```

Main areas:

``` text
api/
components/
pages/
data/
types/
```

## API Layer

``` text
frontend/src/api/
```

Contains API modules such as:

``` text
auth.ts
dashboard.ts
gyms.ts
members.ts
measurements.ts
payments.ts
plans.ts
staff.ts
subscriptions.ts
```

The idea is to keep HTTP communication separate from UI components.

------------------------------------------------------------------------

# 22. Axios Client

The project contains a centralized Axios client:

``` text
frontend/src/api/axiosClient.ts
```

The client reads the authentication token from:

``` text
localStorage
```

and adds:

``` http
Authorization: Bearer <token>
```

to outgoing API requests.

Conceptually:

``` text
React Component
      │
      ▼
API module
      │
      ▼
Axios client
      │
      ├── base URL
      └── Authorization header
      │
      ▼
FastAPI
```

------------------------------------------------------------------------

# 23. Frontend Routing

The main frontend routing is defined in:

``` text
frontend/src/App.tsx
```

Important pages include:

``` text
/login

/dashboard
/members
/members/:id
/attendance
/subscriptions
/plans
/payments
/measurements
/staff
/gym-profile

/gyms
/users
/saas-subscriptions
/super-dashboard
/settings
```

Routes are protected according to the user's role.

For example:

``` text
gym_admin
    ├── dashboard
    ├── members
    ├── plans
    ├── payments
    ├── subscriptions
    ├── staff
    └── measurements

super_admin
    ├── gyms
    ├── users
    └── saas-subscriptions
```

------------------------------------------------------------------------

# 24. Complete Request Lifecycle

A normal business request follows this pattern:

``` text
┌──────────────┐
│    User      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ React Page   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ API Module   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Axios Client │
│ + JWT        │
└──────┬───────┘
       │ HTTP
       ▼
┌──────────────┐
│ FastAPI      │
│ Route        │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Auth / Role  │
│ Validation   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Service      │
│ Business     │
│ Logic        │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Repository   │
│ Data Access  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ SQLAlchemy   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ PostgreSQL   │
└──────┬───────┘
       │
       │ response
       ▼
     Back up
       │
       ▼
┌──────────────┐
│ React State  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Updated UI   │
└──────────────┘
```

------------------------------------------------------------------------

# 25. Example: Adding a Member

Suppose a gym admin clicks **Add Member**.

### Step 1 --- Frontend

The user fills:

``` text
Name
Email
Phone
Membership information
```

### Step 2 --- API Request

Frontend sends:

``` http
POST /members
Authorization: Bearer <JWT>
Content-Type: application/json
```

### Step 3 --- Authentication

FastAPI verifies the JWT through Supabase.

### Step 4 --- Authorization

The backend checks whether the user's role can create members.

### Step 5 --- Tenant Context

The backend obtains:

``` text
current_user.gym_id
```

### Step 6 --- Service

`MemberService.create_member()` processes the member data and associates
it with the current gym.

### Step 7 --- Repository

`MemberRepository.create()` persists the member.

### Step 8 --- Database

PostgreSQL stores the record.

### Step 9 --- Response

The backend returns the created member.

### Step 10 --- UI

React updates the members screen.

------------------------------------------------------------------------

# 26. Docker Workflow

The repository contains:

``` text
docker-compose.yml
```

with two main services:

``` text
backend
frontend
```

Workflow:

``` text
docker compose up --build
           │
           ├───────────────┐
           ▼               ▼
       Backend          Frontend
       :8000              :80
           │
           ▼
      PostgreSQL /
       Supabase
```

The frontend waits for the backend health check before starting through
Docker Compose dependency configuration.

------------------------------------------------------------------------

# 27. Development Workflow

A developer normally works like this:

``` text
1. Start PostgreSQL/Supabase
        ↓
2. Configure .env
        ↓
3. Start FastAPI
        ↓
4. Start React
        ↓
5. Open frontend
        ↓
6. Login
        ↓
7. Perform business operation
        ↓
8. React calls API
        ↓
9. FastAPI validates user
        ↓
10. Service executes business logic
        ↓
11. Repository accesses DB
        ↓
12. Response returns to React
```

------------------------------------------------------------------------

# 28. Where to Modify the Project

When adding a new feature, follow the existing architecture.

For example, adding a new `Trainer` feature:

``` text
Backend

models/trainer.py
        ↓
schemas/trainer_schema.py
        ↓
repositories/trainer_repository.py
        ↓
services/trainer_service.py
        ↓
api/v1/trainer_routes.py
        ↓
main.py
```

Then frontend:

``` text
api/trainers.ts
        ↓
pages/TrainersPage.tsx
        ↓
components if needed
        ↓
App.tsx route
```

This keeps the project organized and scalable.

------------------------------------------------------------------------

# 29. Important Engineering Concepts in This Project

This project is useful for understanding several real-world backend
concepts:

### 1. REST APIs

Frontend and backend communicate using HTTP endpoints.

### 2. Layered Architecture

The backend separates:

``` text
Routes
Services
Repositories
Models
Schemas
```

### 3. Authentication

Supabase handles user authentication and JWT validation.

### 4. Authorization

Roles control what users are allowed to do.

### 5. Multi-Tenancy

`gym_id` separates data between gyms.

### 6. ORM

SQLAlchemy maps Python objects to database tables.

### 7. Data Validation

Pydantic validates API input/output.

### 8. Dependency Injection

FastAPI `Depends()` injects:

``` text
database sessions
current users
role checks
```

### 9. Containerization

Docker packages frontend/backend for reproducible environments.

### 10. CI/CD

GitHub Actions can automatically run:

``` text
lint
tests
type checking
builds
Docker builds
```

------------------------------------------------------------------------

# 30. Important Project Caveats

The repository structure describes a production-oriented architecture,
but the implementation should still be reviewed before treating it as
production-ready.

In particular:

-   Some frontend behavior is currently represented through local
    application state/fixtures.
-   The Axios client shown in the frontend source imports Axios, while
    the current `package.json` should be checked to ensure the
    dependency is installed.
-   Backend authorization should be reviewed endpoint-by-endpoint to
    ensure every gym-owned query enforces `gym_id`.
-   Authentication and authorization should be tested with users from
    different gyms.
-   Secrets must remain in environment variables and must never be
    committed.
-   Database migrations should be used consistently when the schema
    changes.
-   Error responses should avoid leaking internal exceptions in
    production.

These are important because a SaaS application must protect tenant data
even when users manipulate URLs or API requests directly.

------------------------------------------------------------------------

# 31. Mental Model for the Whole Project

If you remember only one thing, remember this:

``` text
                    GYM SaaS
                       │
            ┌──────────┴──────────┐
            │                     │
         FRONTEND              BACKEND
            │                     │
         React                 FastAPI
            │                     │
         API calls          Routes / Auth
            │                     │
            │                  Services
            │                     │
            │                Repositories
            │                     │
            │                 SQLAlchemy
            │                     │
            └──────────────┬──────┘
                           │
                       PostgreSQL
                           │
                    Gym/Tenant Data
```

And for every backend feature:

``` text
Route
  ↓
Auth / Role
  ↓
Service
  ↓
Repository
  ↓
Model / Database
```

That is the **core workflow** of the project.
