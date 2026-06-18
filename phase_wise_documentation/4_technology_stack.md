# Project Design Phase-II
## Technology Stack (Architecture & Stack)
* **Date**: 18 June 2026
* **Project Name**: Shopez

### Technical Architecture
Shopez uses a MERN (MongoDB, Express, React, Node.js) 3-tier architecture:
- **Presentation Layer**: React.js with CSS styling.
- **Application Layer**: Express.js server on Node.js environment.
- **Database Layer**: MongoDB (Cloud Atlas) with a JSON fallback.

### Table-1: Components & Technologies
| S.No | Component | Description | Technology |
|---|---|---|---|
| 1 | **User Interface** | Web application front-end | HTML5, CSS3, JavaScript, React.js (Vite) |
| 2 | **Application Logic** | RESTful API server handling authentication, products, orders, and stats | Node.js, Express.js |
| 3 | **Database** | Core persistent store for products, users, and orders | MongoDB (Mongoose) |
| 4 | **Fallback Storage** | Fallback database if MongoDB is unreachable | Local JSON files (`products.json`, `orders.json`) |
| 5 | **Authentication** | Token-based security and authorization | JSON Web Tokens (JWT), bcryptjs |
| 6 | **Deployment Server** | Hosting environment | Local Node.js server / Render Cloud Hosting |

### Table-2: Application Characteristics
| S.No | Characteristics | Description | Technology |
|---|---|---|---|
| 1 | **Open-Source Frameworks** | React, Express, and Mongoose form the backbone | React.js v18+, Express v4+ |
| 2 | **Security Implementations** | Password hashing, secure routes, login authorization controls | bcryptjs, JWT |
| 3 | **Scalable Architecture** | 3-tier separation enables independent frontend & backend scaling | REST Architecture |
| 4 | **Availability** | Local database fallback ensures system runs offline or on database loss | JSON file persistence |
| 5 | **Performance** | Clean API routing and static assets delivery from Vite dev server | Vite, Node Cluster |
