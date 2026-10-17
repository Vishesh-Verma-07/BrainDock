You are an expert Senior Frontend Engineer and UI/UX Designer specializing in Next.js, TypeScript, Tailwind CSS, and modern React architecture.

Your task is to build the complete frontend for this project.

IMPORTANT:
Before writing any code, read the file:

backend/README.md

Treat it as the source of truth for:

- Features
- API endpoints
- Authentication flow
- Request/response schemas
- Backend architecture
- Business logic
- User flow
- Any constraints

Understand the backend completely first, then design the frontend around it.

Do NOT assume APIs if they already exist inside the backend README.

---

Tech Stack
--------------------------------------------------

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- React Query (TanStack Query) for server state
- Axios for API calls
- React Hook Form where forms are required
- Zod for validation
- shadcn/ui components may be used whenever appropriate
- Lucide React for icons

---

Coding Standards
--------------------------------------------------

- Use semantic HTML elements.
- Use normal HTML tags like:
  - div
  - section
  - article
  - nav
  - aside
  - main
  - header
  - footer

Do NOT create unnecessary wrapper components for basic HTML.

Avoid over-engineering.

Follow clean code principles.

Use TypeScript everywhere.

Use absolute imports.

Keep components reusable.

Avoid duplicate code.

Proper loading states.

Proper error states.

Proper empty states.

Responsive from mobile to desktop.

Accessibility should be considered.

---

Project Structure
--------------------------------------------------

Create a professional scalable folder structure similar to production applications.

Example:

app/
(marketing)/
(dashboard)/
api/
globals.css
layout.tsx
page.tsx

components/
ui/
common/
layout/
landing/
dashboard/
forms/

hooks/

lib/
axios.ts
queryClient.ts
utils.ts

services/
auth.ts
content.ts
tags.ts
user.ts

types/

constants/

store/

providers/

styles/

---

UI Theme
--------------------------------------------------

The application is called:

Second Brain

Design language:

- Modern
- Minimal
- Professional
- Productivity focused
- Clean spacing
- Large typography
- Beautiful cards
- Smooth animations
- Soft shadows
- Rounded corners
- Excellent white space
- Premium SaaS aesthetic

Think of inspiration from:

- Notion
- Linear
- Raycast
- Vercel
- Supabase
- Clerk
- Arc Browser

Avoid flashy gradients everywhere.

Prefer subtle elegance.

---

Pages Required
--------------------------------------------------

1. Landing Page (/)

This should look like a premium SaaS product.

Include:

Hero section

Navigation

CTA buttons

Features section

How it works

Benefits

Screenshots/Mock dashboard preview

FAQ

Footer

The copy should explain what the backend actually provides after reading the README.

Do NOT invent features.

---

2. Authentication

Create pages according to backend authentication.

Examples (only if backend supports them):

Login

Signup

Forgot Password

OAuth

OTP

Session handling

Token storage should follow backend requirements.

---

3. Dashboard

This is the core application.

Design it professionally.

Suggested layout:

Sidebar

Top navbar

Search

Profile menu

Workspace

Content area

Responsive sidebar

---

Dashboard should support every backend feature described inside README.

Examples may include:

Adding content

Viewing content

Deleting content

Updating content

Filtering

Searching

Tags

Collections

Sharing

User settings

Anything present in backend README

Implement all supported operations.

---

Dashboard UI
--------------------------------------------------

Dashboard should feel similar to:

Notion

Linear

GitHub

Minimal yet powerful.

Use:

Cards

Dialogs

Dropdowns

Context menus

Sheets

Toasts

Tabs

Badges

Breadcrumbs

Command palette (optional)

Search bar

Pagination if required

Infinite scrolling if useful

---

API Layer
--------------------------------------------------

Create a dedicated API layer.

Example:

services/

auth.ts

content.ts

user.ts

Each service should map directly to backend APIs.

Do NOT call axios directly inside components.

---

State Management
--------------------------------------------------

Use:

React Query

Local state where appropriate

Context only when necessary

Avoid unnecessary global state.

---

Forms
--------------------------------------------------

Use:

React Hook Form

Zod

Proper validation

Helpful error messages

Loading buttons

Disabled states

---

Styling
--------------------------------------------------

Use Tailwind CSS.

Maintain a consistent spacing system.

Responsive typography.

Consistent button variants.

Proper color palette.

Dark mode support (preferred).

---

Components
--------------------------------------------------

Build reusable components.

Examples:

Navbar

Sidebar

PageHeader

SectionHeader

ContentCard

EmptyState

ErrorState

LoadingSkeleton

SearchBar

Tag

Modal

Dialog

Alert

Toast

Button

Input

Textarea

Select

Dropdown

Avatar

UserMenu

---

Animations
--------------------------------------------------

Use subtle animations.

Examples:

Hover effects

Fade in

Card transitions

Button transitions

Loading skeletons

Avoid excessive animations.

---

Responsiveness
--------------------------------------------------

Must work well on:

Mobile

Tablet

Laptop

Desktop

---

Performance
--------------------------------------------------

Use:

Server Components where appropriate

Client Components only when necessary

Lazy loading

Dynamic imports where useful

Optimized images

Code splitting

---

Code Quality
--------------------------------------------------

Use proper naming conventions.

No unused files.

No unnecessary abstractions.

No deeply nested folders.

No repetitive code.

Keep components focused.

---

Expected Output
--------------------------------------------------

Generate a production-ready frontend that can immediately connect with the backend described in backend/README.md.

The implementation should include:

- Complete folder structure
- Routing
- Layouts
- Pages
- Components
- API integration
- Authentication flow
- Dashboard
- Reusable UI components
- Tailwind styling
- Responsive design
- Clean architecture
- Type-safe code
- Proper loading/error handling

Do not skip any feature documented in backend/README.md.

Always use the backend README as the single source of truth when implementing functionality.
