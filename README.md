# Portfolio

A full-stack personal portfolio application with React frontend and Node.js backend.

## Project Structure

```
portfolio/
├── client/              # Frontend (React + Vite)
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── backend/            # Backend (Express.js)
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── package.json
└── package.json        # Root package.json for monorepo
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (for database)

## Installation

### Install all dependencies

```bash
npm install
```

This will install dependencies for both frontend and backend.

### Install specific folder

```bash
# Frontend only
cd client && npm install

# Backend only
cd backend && npm install
```

## Development

### Run both frontend and backend

```bash
npm run dev
```

This uses `concurrently` to run both servers simultaneously.

### Run frontend only

```bash
npm run dev:client
```

Frontend will be available at `http://localhost:5173`

### Run backend only

```bash
npm run dev:server
```

Backend will be available at `http://localhost:5000`

## Build

### Build both

```bash
npm run build
```

### Build frontend only

```bash
npm run build:client
```

### Build backend only

```bash
npm run build:server
```

## Deployment

- **Frontend**: Deploy the `client/dist` folder to Netlify or similar
- **Backend**: Deploy the `backend` folder to Heroku, Railway, or similar

## Environment Variables

### Client (.env.local)
- `VITE_API_URL` - Backend API URL (default: http://localhost:5000/api)

### Backend (.env)
- `FRONTEND_URL` - Frontend URL (default: http://localhost:5173)
- `DATABASE_URL` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)

## License

ISC
