# Specification

## Summary
**Goal:** Build an online dry-grocery kirana storefront plus an Admin ERP and mobile POS Billing Mode that share a single inventory system, with authentication, order workflows, imports/exports, analytics, and deterministic “AI-style” insights.

**Planned changes:**
- Implement a single Motoko-actor backend with stable-friendly persistence for: products (categories/variants/units), suppliers, inventory (min stock, expiry, damaged), customers, staff roles/permissions, carts, online orders (status history), POS sales, returns, refunds, notifications/events, and analytics/insights.
- Build a mobile-first customer storefront: catalog browse/search/filter, product details, cart, checkout with stock validation, order history, and order status tracking (including status timeline).
- Add authentication for customers and staff: register with phone/email + OTP verification, login via OTP or password, password reset via OTP; enforce role-based access (cashier, delivery boy, manager/admin).
- Create Admin ERP: product management, supplier-wise stock, min-stock alerts, expiry/damaged stock handling, inventory list views with search/filters, and order management (accept/reject, status updates with history, delivery assignment, returns/refunds).
- Add Admin “Billing Mode” POS for Android browsers: fast product search, quantity entry, discounts, payment method (Cash/UPI), complete sale with inventory deduction and sales recording.
- Implement shared inventory synchronization across online + POS via polling/refresh patterns (no WebSockets), blocking checkout/sale when stock is insufficient.
- Add Excel (.xlsx) import/export for products and inventory with validation and created/updated/skipped summaries; aim for idempotent updates by product identifier.
- Add notification event logging and views: order status changes, new order alerts, low stock alerts, and configurable high-value order alerts.
- Build admin dashboards and reports: online+offline sales totals, cash vs UPI, profit (cost vs selling), top-selling items, stock/expiry warnings.
- Add deterministic “AI-style” insights pages: demand forecasting (e.g., moving averages), reorder suggestions, rule-based pricing suggestions, anomaly/fraud flags, and dead stock alerts.
- Implement light/dark mode across customer/admin/billing and apply a consistent kirana-market visual theme (avoid blue/purple), with large touch-friendly controls.

**User-visible outcome:** Customers can register/login, shop dry-grocery items, place orders, and track full order status history; staff can log in with roles to manage catalog/inventory/orders, run mobile POS billing, import/export stock via Excel, view alerts/notifications, and see combined analytics plus deterministic insights—all using shared inventory.
