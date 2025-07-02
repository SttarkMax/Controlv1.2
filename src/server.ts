
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import session from 'express-session';

import apiRouter from './routes';
import { LoggedInUser } from './types';

// Extend Express session to include our user object
declare module 'express-session' {
  interface SessionData {
    user?: LoggedInUser;
  }
}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors({
  origin: `http://localhost:${PORT}`, // Allow requests from where the app is served
  credentials: true,
}));

// Increase payload size limit for base64 logos
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
}));


// --- API Routes ---
app.use('/api', apiRouter);

// --- Static File Serving ---
// Serve the built React frontend
const frontendPath = path.join(__dirname, '..', '..', 'public');
app.use(express.static(frontendPath));

// For any other route, serve the index.html from the React app
// This allows React Router to handle the client-side routing
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// --- Error Handling Middleware ---
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Something went wrong on the server.' });
});

// --- Server Startup ---
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`✔️  Frontend served from: ${frontendPath}`);
});