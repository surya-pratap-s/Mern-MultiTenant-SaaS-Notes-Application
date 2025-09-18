import 'dotenv/config'; // automatically loads .env
import express from 'express';
import cors from 'cors';
import connectDB from './config/mongodb.js';

// Import routers
import authRoutes from './routes/auth.js';
import invitationRoutes from './routes/invitationRoutes.js';
import tenantsRoutes from './routes/tenants.js';
import notesRoutes from './routes/notes.js';

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/tenants', tenantsRoutes);
app.use('/api/notes', notesRoutes);

const PORT = process.env.PORT || 5000;
// Start server
app.listen(PORT, () => console.log(`Server running on ${PORT}`));