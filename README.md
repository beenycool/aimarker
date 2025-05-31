# Beenycool AI GCSE Marker

A unified web application for GCSE exam grading and feedback using AI.

## Features

- AI-powered exam grading and feedback
- Todo list management

## Architecture

This application uses a unified server architecture:

- **Frontend**: Next.js React application
- **Backend**: Express.js server
- **Authentication**: JWT-based auth system

Both frontend and backend run on the same server, simplifying deployment and management.

## Setup

### Prerequisites

- Node.js 18+ and npm

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
PORT=3000

# Node Environment
NODE_ENV=development
```

### Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Build the frontend:
   ```
   npm run build
   ```

3. Start the unified server:
   ```
   npm start
   ```

### Development

For development, you can run both frontend and backend in watch mode:

```
npm run unified-dev
```

## Deployment

### Render Deployment

This application is designed to be deployed on Render. Use the following settings:

1. **Build Command**: `npm run build`
2. **Start Command**: `npm start`

Set all the required environment variables in the Render dashboard.

## License

This project is proprietary and confidential.