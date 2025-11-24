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

## 🧪 Seeding the Database

You can seed test accounts and transactions with:

```
npm run seed
```

---

## 📧 Email Notifications

The app includes email logic using **Resend** to send confirmation or notification emails.

---

## 🎯 Roadmap

* Add recurring transactions
* AI-based spending insights
* Mobile app version (React Native)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to open a PR.

