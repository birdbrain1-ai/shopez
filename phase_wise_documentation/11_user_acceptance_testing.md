# User Acceptance Testing (UAT) Template
* **Date**: 18 June 2026
* **Project Name**: Shopez

### Project Overview
* **Project Name**: Shopez
* **Project Description**: MERN Stack E-commerce web storefront with payment interface and administration panel.
* **Project Version**: v1.1.0
* **Testing Period**: 15 June 2026 to 18 June 2026

### Testing Scope
- User Registration & Login flow (Customer & Admin access rights).
- Dynamic Shopping Cart items management.
- Visual Payment checkout validation (animated card graphic representation).
- Graceful degradation checking (JSON database fallback).
- Admin dashboard insights visibility check (text contrast).

### Testing Environment
* **URL/Location**: Localhost (`http://localhost:5173`) / Production Deploy (`https://shopez.render.com`)

### Test Cases
| Test Case ID | Test Scenario | Test Steps | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|---|
| **TC-001** | Secure Customer Login | 1. Navigate to /login<br>2. Fill credentials<br>3. Click login | Redirected to products catalog page. JWT token stored. | As expected. Redirected to homepage. | **Pass** |
| **TC-002** | Product List Fallback | 1. Disconnect MongoDB<br>2. Visit homepage | Catalog should load dynamically using `products.json` file. | Loaded from local json fallback. | **Pass** |
| **TC-003** | Checkout Card Graphic | 1. Add item to cart<br>2. Fill card number input | Graphic credit card UI flips or updates text dynamically. | Card number updates on graphic UI. | **Pass** |
| **TC-004** | Admin dashboard stats contrast | 1. Login as Admin<br>2. View sales metrics | Total Sales and Revenue text shown clearly in black. | Text contrast meets accessibility rules. | **Pass** |

### Bug Tracking
| Bug ID | Bug Description | Steps to Reproduce | Severity | Status | Additional Feedback |
|---|---|---|---|---|---|
| **BG-001** | Insights text color matches panel. | Log in as admin, go to dashboard. | Medium | Closed | Changed font CSS color to black. |
| **BG-002** | Exposed credentials on Login | Visit /login, credentials autofilled. | High | Closed | Removed demo credentials buttons. |

### Sign-off
* **Tester Name**: QA Team Lead
* **Date**: 18 June 2026
* **Signature**: *Verified & Signed*
