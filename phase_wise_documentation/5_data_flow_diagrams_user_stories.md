# Project Design Phase-II
## Data Flow Diagram & User Stories
* **Date**: 18 June 2026
* **Project Name**: Shopez

### Data Flow Diagrams (DFD)
#### Level 0 DFD (Context Diagram)
- **Entities**: Customer, Administrator.
- **Inputs**: Credentials, Cart selection, Payment details (Customer); Inventory updates (Admin).
- **Outputs**: Order confirmation, product views (Customer); Stats reports, order logs (Admin).

#### Level 1 DFD (Process Level)
1. **User Authentication Process**: Inputs credentials -> Queries MongoDB -> Returns JWT.
2. **Product Catalog Process**: Fetches product listings -> Loads from MongoDB (or reads fallback JSON) -> Displays to UI.
3. **Cart & Checkout Process**: Processes products -> Computes totals -> Simulates credit card verification -> Decrements stock -> Saves order.
4. **Admin Panel Process**: Calculates metrics (Sales, Orders, Stock levels) -> Renders insights.

### User Stories
| User Type | Functional Requirement (Epic) | User Story Number | User Story / Task | Acceptance Criteria | Priority | Release |
|---|---|---|---|---|---|---|
| Customer | Registration | USN-1 | As a user, I can register by entering email and password | Redirects to login, password is encrypted | High | Sprint-1 |
| Customer | Checkout | USN-2 | As a user, I can pay with an animated credit card UI | Credit card dynamically reflects name and card numbers | High | Sprint-2 |
| Customer | Shopping | USN-3 | As a user, I want to add products to my cart | Cart counters increment immediately | High | Sprint-1 |
| Administrator | Dashboard | USN-4 | As an admin, I can view overall revenue in black text | Sales charts and statistics are easily readable | High | Sprint-1 |
| Administrator | Inventory | USN-5 | As an admin, I can manage products (Add/Edit/Delete) | Catalog is updated in MongoDB/JSON immediately | Medium | Sprint-2 |
