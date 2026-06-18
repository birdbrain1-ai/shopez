# Project Design Phase
## Solution Architecture
* **Date**: 18 June 2026
* **Project Name**: Shopez

### Solution Architecture
Solution architecture bridges the gap between business requirements and technical implementation.

#### Core Objectives
1. Find the best technology stack to support secure and reliable e-commerce transactions.
2. Provide a clear structure of data flows, routing, and databases to stakeholders.
3. Manage fallback cases (like database disconnection) seamlessly.

#### Architecture Components Diagram Mapping
```
        [ Customer Browser ]   <--- React.js Front-End (Vite) --->   [ Admin Panel ]
                 |                                                         |
                 +-------------------+-------------------------------------+
                                     |  REST HTTP Requests / JWT
                                     v
                           [ Express.js API Server ]
                                     |
                +--------------------+--------------------+
                | (Connected)                             | (Connection Failed)
                v                                         v
       [ MongoDB Cloud Atlas ]                    [ Local JSON Fallback ]
  (Users, Products, Orders, Stats)             (products.json, orders.json)
```

#### Specifications
- **API Routing**: Express router processes requests (`/api/auth`, `/api/products`, `/api/orders`, `/api/admin`).
- **Database Fallback Handler**: A middle layer helper checking db status before query execution. If down, reads/writes using Node `fs` module.
