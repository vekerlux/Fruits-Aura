# Fruits Aura — Full App Overview

## What Is Fruits Aura?
Fruits Aura is a premium Nigerian fruit-drink e-commerce web app built for mobile-first use. It lets customers browse, choose, and order fresh, branded fruit drinks — with a strong focus on brand identity, a smooth shopping experience, and a powerful admin back-end for the business owner to manage everything.

The app is live at [fruits-aura.vercel.app](https://fruits-aura.vercel.app) (frontend on Vercel, backend on Render, database on MongoDB Atlas).

## 🎨 How It Looks & Feels

### Design Language
The app has a premium, modern aesthetic with:
- **Charcoal + Orange** as the signature brand colors — dark backgrounds with warm orange accents
- **Dark mode on by default** — every new user experience starts with the premium dark theme
- **Glassmorphism** effects on onboarding/feature cards
- **Framer Motion animations** — smooth slide-ins, hover lifts, tap effects, and page transitions
- **Nigerian Naira (₦)** currency throughout all pricing
- **Premium typography** — clean, bold, and readable on mobile

### Overall Vibe
When you open the app, it feels like a lifestyle brand, not just a shop. Think sleek app design with lush fruit imagery and warm orange calls-to-action. It's built to make you want to order.

## 📱 The User Experience — Page by Page

### 1. 🌊 Splash Screen
The first thing you see is the Fruits Aura branded splash screen with the logo. It fades away into the onboarding/home flow automatically.

### 2. 🎠 Home Page — The Carousel (Slide Cards)
The Home page is the heart of the app. At the top is a dynamic hero carousel with 3 branded slide cards:

| Slide | Content | Button Action |
| --- | --- | --- |
| Watermelon Mix | Showcase of the signature drink | "ORDER NOW" → opens WhatsApp cart |
| Loading Mix | Upcoming flavor campaign | "VOTE NOW" → WhatsApp poll link |
| Upcoming Event | Brand announcement/event | "MORE INFO" → Channel link |

Below the carousel the user sees a personalized greeting:<br>
*"Welcome [Name]! Refresh Your Aura…"*

The home page is clean, inviting, and action-oriented.

### 3. 🛒 Menu Page — Browsing Products
The Menu page is where all the magic happens for shopping:
- Products are fetched live from the backend (MongoDB Atlas via Node.js API)
- A search bar at the top allows keyword search
- Category filters let you browse by type (e.g., Citrus Blends, Berry Boost, Tropical Mix, Green Detox)
- Products can be sorted (by price, rating, etc.)
- Each product card shows:
  - Product image
  - Name and price in ₦
  - Star rating + review count
  - A Quick **Add to Cart** button — no need to go to the product detail page
- "Coming Soon" products are visible but blurred/greyed out with a badge, and users can vote for them to influence the next flavor produced

### 4. 🍹 Product Detail Page
Tap any product to open its full detail page:
- Large product image
- Full name + price (e.g., ₦1,900 per bottle or ₦7,500 for an Auraset)*
- Star rating with review count
- Ingredient chips (e.g., "Watermelon", "Lime", "Ginger")
- Nutrition facts grid (4-column: Calories, Sugar, Vitamin C, Hydration)
- Quantity selector (+ / - buttons)
- **Auraset Bundle Toggle:** Choose between a single bottle (₦1,900) or a bundle of 6 bottles at the discounted Auraset price (₦9,000)
- "Add to Cart" button with animated confirmation + toast notification

\**Note: The latest Auraset pricing reflects ₦9,000 for 6 bottles.*

### 5. 🛍️ Cart — Slide-In Modal
From any page, tapping the cart icon (header, with animated badge count) opens the `CartModal`, which slides in from the right:
- Lists all items with images, names, quantities, and prices in ₦
- Quantity controls to adjust each item
- Remove buttons per item
- Total calculation updates in real time
- "Proceed to Checkout" button
- The cart is persistent — it saves to `localStorage`, so it survives a page refresh.

### 6. 💳 Checkout Page
The Checkout page gives a full order summary before confirming:
- List of cart items with quantities
- Delivery address (editable)
- Payment method display
- Delivery fee (calculated based on the user's location — Abakaliki pricing logic applies)
- Total order cost in ₦
- "Place Order" button — animated loading state ("Placing Order…")
- On success: navigates to the Track page + sends an email confirmation to the user
- Payment is integrated with **Paystack** (Nigeria's leading payment gateway, supports card, bank transfer, USSD).

### 7. 📦 Order Tracking Page
After placing an order, users land on the Track page showing:
- Order status (Pending → Preparing → In Transit → Delivered)
- Order reference number
- Estimated delivery info

### 8. 👤 Profile Page
The Profile page is a personal hub for the user. It shows:
- User avatar (selectable from a premium curated set of avatars)
- Full name (editable — changes sync immediately to the backend)
- Badge showing their account type: ADMIN / CONSUMER / FREE PLAN
- Aura Plan subscription status/badge
- **Order via WhatsApp** card with a "SAVE ME" badge — one-tap link to order directly via WhatsApp chat
- **Referral Program** — each user gets a unique, human-readable referral code (e.g., `A4B2XC`) they can share to earn rewards
- **Order History** link — shows past orders with status badges and dates
- Dark Mode toggle — Moon/Sun icon with animated switch (persisted across sessions)
- Logout button

### 9. 📜 Order History Page
Shows all past orders for the logged-in user:
- Order items + dates (nicely formatted)
- Status badges (color-coded: Pending, Preparing, In Transit, Delivered)
- *Requires authentication* — guests are redirected to login

### 10. 🔐 Auth Pages — Login & Register

**Login Page:**
- Clean, branded form design
- Email + password inputs
- Demo credentials shown for easy testing
- Redirect to home after login

**Register Page:**
- Full name, email, password fields
- Role selection: Consumer vs. Distributor
  - **Consumers:** Approved automatically — can shop immediately
  - **Distributors:** Require admin approval before placing bulk orders
- After registration → auto-login → home

### 🗺️ Store Locations Page
Uses the LocationManagement feature:
- Displays Fruits Aura's physical store branches and pickup points on beautiful cards
- Each location card shows: branch photo, name, shop number badge, address (with map pin icon), phone number, and a Google Maps link
- Admin can add/edit/delete locations from the admin panel with a live card preview

## 🛠️ The Admin Panel — Business Control Center
*Accessible at `/admin` — only for users with the Admin role.*
*Login: `admin@fruitsaura.com` / `Admin123!`*

### Admin Dashboard
- **Revenue** — total ₦ from delivered orders
- **Quick Stats** — total orders, users, active products
- **Action Needed** — pending orders and distributor applications
- **Next Aura Mix Leaderboard** — vote rankings to decide which "Coming Soon" flavor gets produced next

### 📋 Order Management
The core of the admin's daily work:
- New orders arrive in "Pending Approval"
- Admin clicks the (✓) Approve icon → approval modal opens
- Admin can override delivery fee if needed (e.g., for special logistics)
- Click "Confirm & Approve" → order moves to kitchen queue
- Use the status dropdown to progress orders: Preparing → In Transit → Delivered

### 👥 User & Distributor Management
- **Users tab:** Full list of registered customers with join dates
- **Pending Distributors tab:** Applications from users who signed up as distributors
  - Admin reviews → clicks Approve → distributor is verified and can now place bulk orders

### 📦 Product Management
Admin can:
- Add new products (name, price, bundle price, category, image via Cloudinary upload)
- Edit existing products
- Delete products
- Toggle "Coming Soon" — makes a product appear as votable but not yet purchasable
- Toggle Active/Inactive — remove a product from the menu without deleting it
- **Bundle logic:** if the product name includes "Auraset", it's automatically treated as a bundle in the checkout flow

### 🔔 Notification Management
Admin can broadcast push/email notifications to all users:
- Create new notification alerts (promotions, events, restocks)
- View sent notifications
- Available at `/admin/notifications`
- Designed for announcing things like "New flavor drops!" or "Weekend promo!"

### 📍 Location Management
Admin manages physical store branches:
- Add a new location → fill in name, address, phone, shop number, Google Maps embed URL, and a branch photo
- See a live mobile card preview as you type
- Edit or delete any existing location

## 🏗️ How the App Works — Technical Summary

| Layer | Technology | Purpose |
| --- | --- | --- |
| Frontend | React + Vite | UI, routing, state |
| Styling | Custom CSS + Framer Motion | Design & animations |
| Backend | Node.js + Express | REST API |
| Database | MongoDB Atlas | Data storage |
| Auth | JWT tokens | Session management |
| Payments | Paystack | Nigerian card/transfer payments |
| Images | Cloudinary | Product & location photo uploads |
| Email | Nodemailer | Order confirmation emails |
| Hosting | Vercel (frontend) + Render (backend) | Live deployment |

### Auth Flow (simplified)
1. User fills login form
2. → `POST /api/auth/login`
3. → Backend validates → returns JWT
4. → Token stored in `localStorage`
5. → AuthContext updates user state
6. → User goes to Home

### Shopping Flow
1. Browse Menu → Open Product → Choose Qty/Bundle
2. → Add to Cart (toast + badge update)
3. → Open Cart Modal → Review items
4. → Proceed to Checkout → Enter address
5. → Pay via Paystack
6. → Order created in DB → Email sent → Track page

## 🎓 User Role System

| Role | How to Get It | What They Can Do |
| --- | --- | --- |
| **Consumer** | Register & select Consumer | Browse, order, track |
| **Distributor**| Register as Distributor + admin approval | Bulk orders with exclusive limits |
| **Admin** | Set by system | Full admin panel access |

## 💡 Key Business Features
- **Auraset Bundle:** 6 bottles for ₦9,000 — incentivizes bulk buying
- **Coming Soon + Voting:** builds anticipation and community engagement for new flavors
- **Referral Program:** each user has a code (e.g., `A4B2XC`) to share and earn rewards
- **WhatsApp ordering:** one-tap button for customers who prefer direct chat orders
- **Distributor network:** a built-in wholesale channel with admin approval flow
- **Partnership support:** the business has active partnership agreements (e.g., Glamour Dinners) documented in the business PDF
