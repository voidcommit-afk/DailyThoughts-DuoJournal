# DailyThoughts-DuoJournal

## Overview
Welcome to the public documentation for the **Daily Journal** ecosystem. This project is a sophisticated monorepo housing two distinct, premium journaling applications designed to cater to different emotional needs: **DailyThoughts** and **DuoJournal**.

This repository serves as the public face and issue tracker for our proprietary software. While the source code remains closed, we share our architectural approach and technology stack here to showcase the engineering behind the platform.

---

## Architecture & Products
The project is architected as a modern **monorepo** consisting of two core packages, differentiating largely by their infrastructure and intended audience:

### 1. DailyThoughts (Production App)
**"The Scalable Platform."**
This is the main public offering. It is a robust, scalable cloud application designed for mass adoption.
*   **Use Case**: Supports **both** solo journaling for individuals and flexible shared spaces for couples, friends and family.
*   **Nature**: A standardized SaaS product with user signup, automated provisioning, and cloud scaling.
*   **Infrastructure**: Fully powered by **Supabase** (Database, Auth, & Storage) for unified, scalable access.

### 2. DuoJournal (Private App)
**"The Bespoke Keepsake."**
This is a private, boutique web application. It is not a SaaS product but a digital home built specifically for intimate partners (couples).
*   **Use Case**: Exclusively for couples or partners who want a dedicated, permanent digital space.
*   **Nature**: A **bespoke, private app built on request**. It features hardcoded customizations, specific names, and unique logic tailored to the specific couple. It allows for "hardcoded" levels of personalization that a SaaS app cannot offer.
*   **Infrastructure**: Uses a specialized stack for flexibility—**Turso (LibSQL)** for a distributed database and **Cloudinary** for high-fidelity media management.

### 3. Core Layer
Both applications share a robust internal `@daily-journal/core` package containing reused UI components, hooks, and TypeScript abstractions, ensuring a consistent design system and logic across the ecosystem.

---

## Technology Stack
We leverage a cutting-edge stack to deliver a premium, app-like experience on the web.

### Shared Foundation
-   **Framework**: Next.js 16 (App Router)
-   **Language**: TypeScript
-   **Styling**: TailwindCSS & Framer Motion (Glassmorphism & Micro-interactions)

### Production App (DailyThoughts)
The scalable public platform.
-   **Database**: Supabase (PostgreSQL)
-   **Storage**: Supabase Storage
-   **Auth**: Supabase Auth
-   **Rate Limiting**: Upstash Redis

### Private App (DuoJournal)
The bespoke private instance.
-   **Database**: Turso (LibSQL)
-   **Storage**: Cloudinary (for advanced media handling)
-   **Auth**: Iron Session (custom stateless auth)

---

## License & Usage
**This software is Proprietary.**
The source code, designs, and assets tied to this project are closed-source and strictly proprietary. They are not available for public use, modification, or distribution. This README is provided for informational purposes only.

---

## Feedback & Support
We value community input and feedback. You can use this repository's **Issues** tab to:

-  **Report Bugs**: If you encounter any issues while using our public releases.
-  **Request Features**: Have an idea for DailyThoughts or DuoJournal? We'd love to hear it.

Please verify if an issue already exists before opening a new one.
