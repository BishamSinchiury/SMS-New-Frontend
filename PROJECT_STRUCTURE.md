# ProSleek Frontend - Project Structure

This document outlines the professional folder structure for the ProSleek application, designed for scalability and maintainability.

## 📁 Folder Structure

```
src/
├── assets/                 # Static assets (images, icons, fonts)
│   └── react.svg
│
├── components/             # Reusable components
│   ├── common/            # Common UI components (Button, Input, Card, etc.)
│   └── layout/            # Layout components (Header, Footer, Sidebar, etc.)
│
├── pages/                 # Page components
│   ├── public/           # Public pages (accessible without auth)
│   │   └── Home.jsx
│   │   └── Home.module.css
│   └── private/          # Private pages (require authentication)
│       └── (Dashboard, Profile, Settings, etc.)
│
├── routes/                # Routing configuration
│   ├── index.jsx         # Main routes configuration
│   ├── PublicRoute.jsx   # Public route wrapper
│   └── PrivateRoute.jsx  # Private route wrapper with auth check
│
├── styles/                # Global styles and theme
│   ├── theme.css         # Theme variables and design tokens
│   └── global.css        # Global base styles and resets
│
├── hooks/                 # Custom React hooks
│   └── (useAuth, useForm, useFetch, etc.)
│
├── services/              # API services and external integrations
│   └── (api.js, authService.js, etc.)
│
├── utils/                 # Utility functions and helpers
│   └── (formatters, validators, constants, etc.)
│
├── constants/             # Application constants
│   └── (routes.js, apiEndpoints.js, etc.)
│
├── App.jsx               # Main App component with Router
└── main.jsx              # Application entry point
```

## 🗂️ Folder Descriptions

### `/assets`
Static files like images, icons, fonts, and other media assets.

### `/components`
Reusable UI components organized by type:
- **common/**: Generic, reusable components (Button, Input, Modal, Card, etc.)
- **layout/**: Layout-specific components (Header, Footer, Sidebar, Navigation, etc.)

### `/pages`
Page-level components organized by access level:
- **public/**: Pages accessible without authentication (Home, Login, Signup, About, Contact)
- **private/**: Pages requiring authentication (Dashboard, Profile, Settings, Admin)

### `/routes`
Routing configuration and route protection:
- **index.jsx**: Central routing configuration with all app routes
- **PublicRoute.jsx**: Wrapper for public routes with optional restrictions
- **PrivateRoute.jsx**: Wrapper for protected routes with authentication checks

### `/styles`
Global styling and theme configuration:
- **theme.css**: CSS variables for colors, spacing, typography, transitions, etc.
- **global.css**: Base styles, resets, and global element styling

### `/hooks`
Custom React hooks for reusable logic:
- Authentication hooks (useAuth)
- Form handling (useForm)
- Data fetching (useFetch, useApi)
- Local storage (useLocalStorage)
- etc.

### `/services`
API integration and external service communication:
- API client configuration
- Authentication service
- Data fetching services
- Third-party integrations

### `/utils`
Utility functions and helpers:
- Date/time formatters
- String manipulations
- Validators
- Constants
- Helper functions

### `/constants`
Application-wide constants:
- Route paths
- API endpoints
- Configuration values
- Enum-like constants

## 🛣️ Routing Structure

### Public Routes
Routes accessible without authentication:
- `/` - Home page
- `/login` - Login page (restricted for authenticated users)
- `/signup` - Sign up page (restricted for authenticated users)
- `/about` - About page
- `/contact` - Contact page

### Private Routes
Routes requiring authentication:
- `/dashboard` - User dashboard
- `/profile` - User profile
- `/settings` - User settings
- `/admin/*` - Admin panel (requires admin role)

### Error Routes
- `/unauthorized` - Unauthorized access page
- `*` - 404 Not Found page

## 🎨 Theme System

The ProSleek theme uses CSS variables defined in `styles/theme.css`:

### Key Features
- **Soft Gradients**: Primary, secondary, and accent gradients
- **Smooth Transitions**: Consistent timing functions
- **Rounded Edges**: Multiple border radius options
- **Professional Colors**: Carefully curated color palette
- **Typography**: Inter and Outfit font families
- **Spacing System**: Consistent spacing scale
- **Shadow System**: Multiple elevation levels

### Using Theme Variables
```css
.myComponent {
  background: var(--primary-gradient);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  transition: all var(--transition-base);
  box-shadow: var(--shadow-md);
}
```

## 🔐 Authentication Flow

1. **Public Routes**: Accessible to all users
2. **Restricted Public Routes**: Login/Signup pages redirect authenticated users
3. **Private Routes**: Require authentication, redirect to login if not authenticated
4. **Role-Based Routes**: Check user roles for admin/special access

## 📝 Best Practices

1. **Component Organization**: Keep components small and focused
2. **CSS Modules**: Use CSS modules for component-specific styles
3. **Absolute Imports**: Use `@/` alias for cleaner imports
4. **Consistent Naming**: Use PascalCase for components, camelCase for utilities
5. **File Collocation**: Keep related files together (component + styles)
6. **Separation of Concerns**: Separate business logic from presentation

## 🚀 Development Workflow

1. Create components in appropriate folders
2. Use CSS modules for styling with theme variables
3. Add routes in `routes/index.jsx`
4. Implement services for API calls
5. Create custom hooks for reusable logic
6. Keep utilities and constants organized

## 📦 Deployment Ready

This structure is optimized for:
- **Code Splitting**: Route-based code splitting with React Router
- **Tree Shaking**: Modular imports for optimal bundle size
- **Scalability**: Easy to add new features and pages
- **Maintainability**: Clear organization and separation of concerns
- **Team Collaboration**: Intuitive structure for multiple developers
