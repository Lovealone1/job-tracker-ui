# Job Tracker - Premium Frontend

A state-of-the-art, glassmorphic dashboard designed for peak career productivity. This high-performance web application provides an immersive experience for tracking job applications, managing interview cycles, and generating world-class LaTeX resumes.

---

## Project Highlights

### **Premium Design System**
- **Glassmorphism**: A stunning dark-themed interface built with custom vanilla CSS, featuring blur backdrops, subtle gradients, and glow effects.
- **Dynamic Animations**: Smooth transitions and micro-animations for an interactive and high-end feel.
- **Responsive Layout**: Optimized for both high-resolution workstations and mobile productivity.

### **Advanced Functionality**
- **Intelligent Dashboard**: Real-time KPI visualization using immersive progress bars and status cards.
- **Smart Selectors**: High-performance searchable dropdowns for countries (with emoji flags), timezones, and languages.
- **Resume Management**: Frontend integration with a LaTeX rendering engine, featuring instant document previews (PDF/PNG).
- **Profile Synchronization**: Real-time optimistic updates for user metadata and encrypted API vault settings.

---

## Technical Stack
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: TailwindCSS & Custom Vanilla CSS Utilities
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest) (React Query)
- **Icons**: Lucide React
- **Theming**: Next-themes for robust dark mode support

---

## Deployment

Seamlessly configured for deployment on **Vercel**:
- **Image Optimization**: Custom `remotePatterns` configuration for secure Supabase Storage integration.
- **Build Pipeline**: Zero-error production build verified with `pnpm build`.

---

## Getting Started

### Prerequisites
- Node.js 22+
- Pnpm 9+

### Local Development

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```

2. **Environment Setup**:
   Create a `.env.local` file with your backend API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. **Run Application**:
   ```bash
   pnpm dev
   ```

---

## GitHub About Description
> "Premium glassmorphic dashboard for job application tracking. Built with Next.js 15, TailwindCSS, and TanStack Query. Features high-end UI animations, real-time analytics, and automated resume engine integration."

---

## License
UNLICENSED
