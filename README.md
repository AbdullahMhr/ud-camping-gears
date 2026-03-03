# UD Camping Gears 🏕️

A premium, pixel-perfect e-commerce application built for "UD Camping Gears". Designed with **Next.js 14** and **Tailwind CSS**, featuring a fully integrated **Supabase** backend supporting Authentication, Database management, Storage mapping, and a comprehensive Administrator Dashboard.

![UD Camping Gears](https://cdnp.flypgs.com/files/Ekstrem_Sporlar/camping-kampcilik-nedir.jpg)

## 🚀 Live Demo
**[ud-camping-gears.vercel.app](https://ud-camping-gears.vercel.app)**

## 🌟 Key Features

### 🛒 Dynamic E-Commerce Ecosystem
*   **Dual Pricing Models:** Support for both daily **Rentals** and direct **Purchasing**.
*   **Global State Management:** Context API handling Cart sync, Toast notifications, Product rendering, and Auth tokens.
*   **Inquiry System:** Seamless Cart-to-Inquiry pipeline for rapid checkout and booking confirmations.

### 🛡️ Secure Authentication & Roles
*   **Supabase Auth:** Google OAuth & standard Email/Password authentication.
*   **Role-Based Access Control (RBAC):** Strict `isAdmin` checks resolving to a protected `/admin` routing structure.
*   **Postgres Stored Procedures:** Fully locked down Row Level Security (RLS) intercepting unauthorized payload mutations natively at the database layer (10/10 Security Rating).

### 🛠️ Dedicated Admin Dashboard (`/admin`)
*   **Product Management:** Real-time CRUD operations allowing admins to add, edit, or hide inventory.
*   **Dynamic Restocking:** Instant price modulations and product metadata assignments.
*   **Community Moderation:** Gallery moderation deleting harmful or unauthorized community images.

### 📸 Community Powered Gallery
*   **User Uploads:** Authenticated users can upload their adventure images to a cryptographically sealed `product-images` bucket.
*   **Optimized Rendering:** Global Gallery Context hooks delivering real-time UI updates on uploads without page refreshes.

### 📱 Premium UI/UX
*   **Native-feel Mobile Menus:** Framed embedded dropdowns resolving WebKit horizontal scroll bleeds.
*   **Interactive Physics:** Custom particle smoke explosions tied to Hero CTA buttons.
*   **Progressive Image Loading:** Blur-hash placeholders and adaptive layout shifters.

## 🏗️ Tech Stack
*   **Framework:** [Next.js 14](https://nextjs.org/) (App Router, Server/Client Hybrid)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Hosting:** [Vercel](https://vercel.com/)

## ⚙️ Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ud-camping-gears.git
    cd ud-camping-gears
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root directory and mirror your Supabase project keys:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the core SQL Pipeline:**
    Execute the provided `supabase-setup.sql`, `supabase_products_setup.sql`, and `supabase_security_patch.sql` directly inside your Supabase SQL Editor to map the exact Tables, RLS Policies, and Stored Procedures used in production.

5.  **Start the development server:**
    ```bash
    npm run dev
    ```

6.  **Open the application:**
    Navigate your browser to [http://localhost:3000](http://localhost:3000)

## 📄 License
This project was developed for educational and portfolio demonstration purposes. All rights reserved by UD Camping Gears regarding nomenclature and mock branding.
