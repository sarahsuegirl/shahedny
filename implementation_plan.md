# Nzmly Clone Implementation Plan

**Goal Description**
Building a platform like Nzmly.com, which is a comprehensive platform for creators and service providers to sell digital products, host courses, and offer schedulable services. Features include personalized storefronts, calendar integrations, and global + local payment processing.

## Proposed Architecture & Tech Stack

1. **Frontend**: **React (via Vite)** to create a fast and highly interactive user interface for the storefronts and dashboard.
2. **Backend**: **Node.js with Express.js**. A dedicated, scalable REST API to handle payment webhooks, secure file access, and heavy business logic.
3. **Database**: **Firebase Firestore (NoSQL)**. An excellent choice! It is highly scalable, allows for very fast iteration, and supports real-time updates.
4. **Authentication**: **Firebase Authentication**. A secure and easy-to-use authentication system that works seamlessly with Firestore.
5. **Storage**: **Hostinger (Server Disk Storage)**. Instead of external cloud storage, we will use your Hostinger hosting plan's storage native to the Node.js server. We will use packages like `multer` to securely upload and keep files on your own server.
6. **Payments / Money Handling**: 
   - **Paymob**: To target the Egyptian and Arab world (supports local methods like Vodafone Cash, Meeza, Fawry).
   - **Stripe / PayPal**: To target the rest of the world securely.

## Proposed Database Schema (Firestore Collections)

Because Firestore is a NoSQL document database, our data will be stored as JSON-like documents split into collections.

### 1. `users` & `storefronts` Collections
- `users`: `{ id, email, role: 'ADMIN' | 'SELLER' | 'BUYER', stripe_account_id, paymob_account_id, created_at }`
- `storefronts`: `{ user_id, slug (e.g., nzmly.com/user), title, description, theme_color, is_active }`

### 2. `products` & `availability` Collections
- `products`: `{ store_id, title, description, price, currency, type: 'DIGITAL' | 'COURSE' | 'SERVICE', file_storage_path }`
- `availability`: `{ product_id, available_days: ['Monday', 'Wednesday'], start_time, end_time }`

### 3. `orders` & `bookings` Collections
- `orders`: `{ product_id, store_id, buyer_email, amount, currency, platform_fee, status: 'PENDING' | 'SUCCESS', gateway: 'STRIPE' | 'PAYMOB' }`
- `bookings`: `{ order_id, product_id, meeting_time, meeting_link_url, status: 'SCHEDULED' | 'COMPLETED' }`

## Money Handling Flow

The platform acts as the middleman (marketplace). The flow ensures secure transactions:

1. **Checkout**: A buyer visits a seller's link. The backend determines the payment options (Paymob for local, Stripe for global).
2. **Escrow/Hold**: The buyer pays, and funds are routed to your Platform's Master Account.
3. **Fulfillment**: 
   - *If Digital Product*: The Node.js backend serves the file securely directly from your Hostinger server after verifying the buyer's successful payment.
   - *If Service*: The system creates a Calendar invite with a Google Meet/Zoom link.
4. **Ledger & Payouts**: The system records the transaction and deducts your platform fee (e.g., 5-10%). A monthly or weekly Node.js cron job processes payouts to the sellers' bank accounts or wallets via Stripe Connect and Paymob APIs.

## Development Phases

### Phase 1: Foundation (JSON DB & Node.js)
- [x] Set up persistent JSON storage (db.json) to replace Firebase requirement for Hostinger.
- [x] Set up Node.js (Express) backend structure.
- [x] Build React frontend basics (Routing, Auth Context).

### Phase 2: Core Platform (Storefronts & Products)
- [x] Sellers can create their storefront slug and upload profile details.
- [x] Digital Product creation (upload files to Hostinger server storage via Node.js `multer`).
- [x] Public-facing storefront UI.

### Phase 3: Financial Engine
- [ ] Integrate Paymob API for live local checkout.
- [ ] Integrate Stripe API for live global checkout.
- [ ] Webhook handling on the Node.js backend to securely verify payments.

### Phase 4: Schedulings & Polish
- [x] Booking system logic (calendar availability matrix to prevent double-booking).
- [ ] Secure product delivery post-payment.
