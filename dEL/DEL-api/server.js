const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const healthRoutes = require('./src/routes/health.routes');
const equipmentRoutes = require('./src/routes/equipment.routes');
const requestRoutes = require('./src/routes/request.routes');
const proposalRoutes = require('./src/routes/proposal.routes');
const { notFound, errorHandler } = require('./src/middlewares/error.middleware');

dotenv.config();
connectDB();

const app = express();
const origins = (process.env.CORS_ORIGIN || '').split(',').map((origin) => origin.trim()).filter(Boolean);
app.use(cors({ origin: origins.length ? origins : true }));
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/proposals', proposalRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`DEL API listening on port ${port}`));
