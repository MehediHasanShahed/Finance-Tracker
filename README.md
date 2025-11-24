# 📊 Finance Tracker

A modern, full-featured personal finance management web application built with **Next.js**, **Prisma**, **Clerk**, **TailwindCSS**, and **Shadcn UI**.
Track your **transactions**, manage **accounts**, set **budgets**, monitor your **dashboard analytics**, and more — all in a smooth, responsive UI.

---

## 🚀 Features

### 🔐 Authentication & Security

* User authentication powered by **Clerk**
* Middleware-protected routes
* Rate-limiting and bot-protection via **Arcjet**

### 💰 Account & Transaction Management

* Create, update, and delete accounts
* Add expenses, income, and transfers
* Automatic balance serialization
* Form validation using **Zod**

### 📅 Budgeting Tools

* Create budgets and track progress
* Category-based analytics
* Integrated monthly spending overview

### 📊 Dashboard & Insights

* Transaction history
* Category distribution charts
* Current month overview
* Clean UI built with **Shadcn UI** components

### 🛠 Developer-Friendly Tech Stack

* **Next.js App Router**
* **Prisma ORM** with PostgreSQL
* **Inngest** for background tasks
* **React Hook Form**
* **TailwindCSS + Shadcn** for consistent UI
* Modular structure for scalability

---

## 📂 Project Structure

```
/actions        → Server actions for accounts, budget, transactions, email, and dashboard
/app
  /(main)       → Core pages (dashboard, accounts, transactions, budget)
  /api          → API routes (Inngest, seeding)
  /lib          → Schemas, utils, Arcjet config
/components     → UI components & reusables (drawers, forms, tables)
 /public        → Static assets
/prisma         → Database schema
```

---

## 🧰 Tech Stack

* **Frontend:** Next.js, React, TailwindCSS, Shadcn UI
* **Backend:** Next.js Server Actions, Inngest
* **Database:** PostgreSQL + Prisma
* **Auth:** Clerk
* **Validation:** Zod
* **Email:** Resend
* **Charts:** Recharts

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/finance-tracker.git
cd finance-tracker
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Environment variables

Create a `.env` file with:

```
NEXT_PUBLIC_CLERK_SIGN_IN_URL=sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=sign-up
DATABASE_URL=
DIRECT_URL=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
RESEND_API_KEY=
ARCJET_KEY=
GEMINI_API_KEY=
```

### 4️⃣ Set up Prisma

```bash
npx prisma migrate dev
```

### 5️⃣ Start development server

```bash
npm run dev
```

---

## 🧪 Run Inngest


```
inngest dev
```

---

---

## 📸 Screenshot
| Finance Tracker Interface |
|----------------------|
| Landing Page |
| <img width="1878" height="923" alt="Opera Snapshot_2025-11-25_012042_localhost" src="https://github.com/user-attachments/assets/a9f28e7e-370f-4327-854e-65d9cdf32b69" /> |
| Dashboard |
| <img width="1878" height="923" alt="Opera Snapshot_2025-11-25_012221_localhost" src="https://github.com/user-attachments/assets/80682cc1-4a62-4017-a3af-c82df7e2fc8b" /> |
| <img width="1878" height="923" alt="Opera Snapshot_2025-11-25_012233_localhost" src="https://github.com/user-attachments/assets/eb173c99-088d-4d29-bd6d-4d93b1e39807" /> |
| Create Transactions |
| <img width="1878" height="923" alt="Opera Snapshot_2025-11-25_012129_localhost" src="https://github.com/user-attachments/assets/78c67c34-0299-4b70-aa8f-22bdbb2b77d4" /> |
| Accounts |
| <img width="1878" height="923" alt="Opera Snapshot_2025-11-25_012207_localhost" src="https://github.com/user-attachments/assets/5d99367f-8bf8-4136-99b6-cf963725c0ee" /> |
| <img width="1878" height="923" alt="Opera Snapshot_2025-11-25_012153_localhost" src="https://github.com/user-attachments/assets/7774aabc-a64f-44e0-b541-82c02f0be17a" /> |






---

## 📧 Email Notifications

The app includes email logic using **Resend** to send confirmation or notification emails.

---

## 🎯 Roadmap

* Add recurring transactions
* AI-based spending insights
* Mobile app version (React Native)

---

## 👨‍💻 Author

**Mehedi Hasan Shahed**

* **Email:** [mehedihasanshahed3@gmail.com](mailto:mehedihasanshahed3@gmail.com)

* **LinkedIn:** [Mehedi Hasan Shahed](https://www.linkedin.com/in/mehedi-hasan-153404287/)

💼 Software Developer | Web Engineer

