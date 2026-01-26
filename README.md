# Habitly - Build Better Habits 🚀

A premium, minimalistic habit-tracking application built with modern web technologies. Track your daily habits, visualize progress with beautiful heatmaps, and achieve your goals with an intuitive, beautiful interface.


## ✨ Live Demo

**[👉 Try Habitly Now](https://habitly-74p.pages.dev/)**

---

## 🎯 Features

| Feature | Description |
|---------|-------------|
| 📅 **Calendar Heatmap** | Visualize your habit completion with GitHub-style heatmaps |
| 🔥 **Streak Tracking** | Track current and longest streaks to stay motivated |
| 🎨 **Custom Colors** | Personalize each habit with your favorite colors |
| 📊 **Progress Analytics** | See completion rates and daily goals at a glance |
| 🌙 **Dark Mode** | Beautiful dark theme optimized for all conditions |
| 🔒 **Secure Auth** | OAuth authentication with Google, GitHub, and more |
| � **Markdown Support** | Rich descriptions with full markdown support |
| ⚡ **Real-time Updates** | Instant UI updates with optimistic mutations |
| � **Responsive Design** | Works beautifully on desktop, tablet, and mobile |

---

## 🛠️ Tech Stack

- **Framework:** [Nuxt 4](https://nuxt.com) with Vue 3
- **Database:** [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication:** [Clerk](https://clerk.com/)
- **UI Components:** [Nuxt UI](https://ui.nuxt.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** [Pinia](https://pinia.vuejs.org/)
- **Deployment:** [Cloudflare Pages](https://pages.cloudflare.com/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Cloudflare account (for D1 database)
- Clerk account (for authentication)

### Installation

```bash
# Clone the repository
git clone https://github.com/vasudevsharma-coder/habitly.git

# Navigate to project directory
cd habitly

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
NUXT_CLERK_SECRET_KEY=sk_test_your_key_here
NUXT_SESSION_PASSWORD=your-secure-session-password-minimum-32-characters
```

---

## 📦 Project Structure

```
habitly/
├── app/
│   ├── components/     # Vue components
│   ├── composables/    # Reusable composition functions
│   ├── layouts/        # Page layouts
│   ├── pages/          # Application routes
│   └── assets/         # Static assets
├── server/
│   ├── api/            # API endpoints
│   ├── database/       # Database schema & migrations
│   └── utils/          # Server utilities
├── public/             # Public static files
└── nuxt.config.ts      # Nuxt configuration
```

---

## 🚢 Deployment

This project is deployed on Cloudflare Pages with D1 database.

```bash
# Build for production
npm run build

# Deploy to Cloudflare
npx wrangler pages deploy dist
```

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---

## 👨‍💻 Author

**Vasu Sharma**

- GitHub: [@vasudevsharma-coder](https://github.com/vasudevsharma-coder)

---

<p align="center">
  Made with ❤️ and ☕
</p>
