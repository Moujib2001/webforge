require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');

const authRoutes      = require('./routes/auth');
const servicesRoutes  = require('./routes/services');
const ordersRoutes    = require('./routes/orders');
const messagesRoutes  = require('./routes/messages');
const adminRoutes     = require('./routes/admin');
const portfolioRoutes = require('./routes/portfolio');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/auth',      authRoutes);
app.use('/api/services',  servicesRoutes);
app.use('/api/orders',    ordersRoutes);
app.use('/api/messages',  messagesRoutes);
app.use('/api/admin',     adminRoutes);
app.use('/api/portfolio', portfolioRoutes);

app.get('/api/health', (_req, res) =>
  res.json({ success: true, message: 'WebForge API is running', data: null })
);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    data: null,
  });
});

const PORT = process.env.PORT || 5000;

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected.');
    return sequelize.sync({ alter: true });
  })
  .then(() => app.listen(PORT, () => console.log(`WebForge API → http://localhost:${PORT}`)))
  .catch((err) => { console.error('DB connection failed:', err); process.exit(1); });
