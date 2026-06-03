# Architecture Diagram

```mermaid
flowchart LR
  User[User / Browser] --> React[React Frontend<br/>localhost:3000]

  React -->|HTTP requests| API[Express API<br/>localhost:5000]

  API --> Routes[Routes<br/>src/routes]
  Routes --> Validators[Validators<br/>src/validators]
  Routes --> Controllers[Controllers<br/>src/controllers]

  Controllers --> Models[Models<br/>src/models]
  Models -->|Parameterized SQL| DB[(PostgreSQL<br/>task_portal.tasks)]

  API --> ErrorHandler[Error Handler<br/>src/middleware]
  DB --> Models
  Models --> Controllers
  Controllers --> React
```

## Request Flow

```text
React UI
  -> Express route
  -> Request validation
  -> Controller
  -> Model
  -> PostgreSQL
  -> JSON response
  -> React UI update
```

## Main Folders

```text
client/      React frontend
src/         Node.js + Express backend
database/    PostgreSQL schema
postman/     API collection
```

## Backend Layers

```text
routes       API endpoints
validators   Request validation
controllers  Request and response logic
models       Database queries
middleware   Error handling and async handling
config       Database connection
```
