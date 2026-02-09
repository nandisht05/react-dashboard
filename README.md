# Professional React Dashboard

A modern, professional dashboard application built with Next.js 15, featuring authentication, role-based access control, and a clean white & orange theme.

## 🚀 Features

- **Authentication System**: Secure login/signup with NextAuth.js v5
- **Role-Based Access**: Admin and User roles with different permissions
- **Professional UI**: Clean, bordered design with white & orange theme
- **SQLite Database**: Local database using better-sqlite3 and Drizzle ORM
- **Responsive Design**: Mobile-friendly interface
- **Modern Stack**: Next.js 15, TypeScript, Tailwind CSS

## 📦 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: NextAuth.js v5 (Auth.js)
- **Database**: SQLite with better-sqlite3
- **ORM**: Drizzle ORM
- **UI Components**: Custom components with shadcn/ui patterns

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/nandisht05/react-dashboard.git
cd react-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
AUTH_SECRET="your-secret-key-here"
```

4. Initialize the database:
```bash
npx drizzle-kit push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📝 Default Credentials

The first user to sign up automatically becomes an admin with full access.

## 🎨 Theme

The application uses a professional white & orange color scheme:
- Primary: Orange (#FF6B35 and variants)
- Background: White
- Borders: Subtle gray borders for clean separation

## 📂 Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── dashboard/         # User dashboard
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   └── welcome/           # Welcome page
├── components/            # Reusable components
│   ├── layout/           # Layout components (Navbar)
│   └── ui/               # UI components (Button, Card, Input)
├── lib/                   # Utilities and configurations
│   ├── actions.ts        # Server actions
│   ├── data.ts           # Database queries
│   ├── db.ts             # Database connection
│   └── schema.ts         # Database schema
├── auth.ts               # NextAuth configuration
├── auth.config.ts        # Auth callbacks
└── middleware.ts         # Next.js middleware

```

## 🔒 Security Features

- Password hashing with bcryptjs
- Secure session management
- Protected routes with middleware
- Role-based access control

## 📄 License

MIT

## 👤 Author

Created by Nandish T

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Note**: This project uses SQLite for local development. For production deployment, consider using a cloud database service.
