const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
const env = require('./src/config/env');
const notFound = require('./src/middlewares/notFound.middleware');
const errorMiddleware = require('./src/middlewares/error.middleware');

const app = express();
app.use(helmet());
app.use(cors({ origin: (origin, cb) => (!origin || env.corsOrigins.includes(origin) ? cb(null, true) : cb(new Error('Not allowed by CORS'))), credentials: true }));
app.use(express.json());
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use('/api/health', require('./src/routes/health.routes'));
app.use('/api/equipment', require('./src/routes/equipment.routes'));
app.use('/api/requests', require('./src/routes/request.routes'));
app.use('/api/proposals', require('./src/routes/proposal.routes'));
app.use('/api/documents', require('./src/routes/document.routes'));
app.use('/api', require('./src/routes/contract.routes'));
app.use('/api', require('./src/routes/invoice.routes'));
app.use('/api', require('./src/routes/payment.routes'));
app.use(notFound);
app.use(errorMiddleware);

const start = async () => { await connectDB(); app.listen(env.port, () => console.log(`DEL-api running on port ${env.port}`)); };
start().catch((error) => { console.error(error.message); process.exit(1); });
