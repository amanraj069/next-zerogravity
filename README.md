# ZeroGravity - Minimalist Authentication App

A simple, minimalist black and white Next.js application with authentication functionality.

## Features

- **Clean Authentication**: Simple login and signup pages
- **Minimalist Design**: Black and white color scheme with clean typography
- **Backend Integration**: Connects to the ZeroGravity backend API
- **Protected Routes**: Dashboard page with authentication protection
- **Responsive**: Works on desktop and mobile devices

## Pages

- `/` - Landing page with navigation to auth pages
- `/login` - User login page
- `/signup` - User registration page
- `/dashboard` - Protected dashboard (requires authentication)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Make sure the backend is running:**
   - The backend should be running on `http://localhost:9000`
   - Ensure the ZeroGravity backend is started before using the app

4. **Open your browser:**
   - Navigate to `http://localhost:3000`
   - You should see the minimalist landing page

## API Integration

The app connects to the following backend endpoints:

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login  
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - User logout

## Design Philosophy

This application follows a minimalist design approach:

- **Black & White**: Clean, distraction-free color palette
- **Typography**: Simple, readable fonts
- **Layout**: Generous whitespace and clean lines
- **Interactions**: Subtle hover effects and transitions
- **Zero Decoration**: Focus on functionality over decoration

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Cookie-based sessions with JWT
- **Backend**: Express.js (separate zerogravity-backend)

## Build

To build for production:

```bash
npm run build
npm start
```
