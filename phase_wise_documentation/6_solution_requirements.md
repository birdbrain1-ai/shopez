# Project Design Phase-II
## Solution Requirements (Functional & Non-functional)
* **Date**: 18 June 2026
* **Project Name**: Shopez

### Functional Requirements
| FR No. | Functional Requirement (Epic) | Sub Requirement (Story / Sub-Task) |
|---|---|---|
| **FR-1** | User Authentication | • Customer registration and secure login.<br>• Role-based login routes for Admin vs Customer. |
| **FR-2** | Product Catalog | • Render lists of items with prices and stock levels.<br>• Fallback catalog loading from JSON files if database is disconnected. |
| **FR-3** | Shopping Cart | • Add/Remove items from cart.<br>• Dynamic price calculation including taxes and shipping. |
| **FR-4** | Checkout System | • Credit card processing mockup with animated visual graphic.<br>• Order placement and inventory stock deduction on purchase. |
| **FR-5** | Admin Control Panel | • Insights tab displaying total sales, user list, and inventory status.<br>• Visibility fix: black text for easy contrast reading. |

### Non-functional Requirements
| FR No. | Non-Functional Requirement | Description |
|---|---|---|
| **NFR-1** | Usability | Clean, responsive light-themed layout styled with Vanilla CSS. UI is intuitive. |
| **NFR-2** | Security | Hashed user passwords in database. Credentials are not hardcoded or shown on screen. |
| **NFR-3** | Reliability | Application degrades gracefully by loading from local JSON database files when MongoDB fails. |
| **NFR-4** | Performance | Sub-second API response times for cart and catalog endpoints. |
| **NFR-5** | Availability | Up-time maximized on cloud deployment (Render/Vercel) with reliable fallback methods. |
| **NFR-6** | Scalability | Separation of client (Vite/React) and server (Node/Express) allows independent horizontal scaling. |
