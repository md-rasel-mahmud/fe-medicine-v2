# FE Medicine v2

A modern web application for easy management of medicines, stock, sales, purchases, suppliers, units, users, and more.

## Features

- **Dashboard:** Live analytics and overview (total medicines, sales, purchases, stock, suppliers, users)
- **Medicine Management:** Add, edit, delete medicines with unit and group support
- **Unit Management:** Add, edit, delete units
- **Supplier Management:** Store and update supplier information
- **Stock Management:** Stock entry, expiry, quantity tracking
- **Purchase Module:** Purchase entry with supplier and stock integration
- **Sales Module:** Customer sales, invoice, discount, cart
- **User Management:** User list, roles (ADMIN/STAFF), authentication
- **Responsive Design:** Works beautifully on both mobile and desktop

## Tech Stack

- **React 19** (with TypeScript)
- **Vite** (Fast build tool)
- **Redux Toolkit** (State management)
- **React Hook Form + Zod** (Form validation)
- **Tailwind CSS** (UI styling)
- **Radix UI, Lucide React, shadcn/ui** (UI components)
- **React Router v7** (Routing)
- **ESLint** (Code linting)
- **Sonner** (Toast notifications)

## Directory Structure (Summary)

- `src/pages/private/` — Dashboard, Medicine, Sales, Purchase, Stock, Supplier, Unit, User
- `src/components/` — Common and UI components
- `src/lib/redux/` — State and API services
- `src/components/constants/menu.ts` — Menu and role config

## Getting Started

```bash
yarn # or npm install
yarn dev # or npm run dev
```
