const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./config/env');
const notFound = require('./middlewares/notFound.middleware');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(helmet());
app.use(cors({
  origin: (origin, cb) => (!origin || env.corsOrigins.includes(origin) ? cb(null, true) : cb(new Error('Not allowed by CORS'))),
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

if (env.nodeEnv !== 'test') {
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
}

app.use('/api/health', require('./routes/health.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/settings', require('./routes/settings.routes'));
app.use('/api/audit-logs', require('./routes/audit.routes'));
app.use('/api/me', require('./routes/me.routes'));
const notificationRoutes = require('./routes/notification.routes');
app.use('/api/notifications', notificationRoutes);
app.use('/api/me/notifications', notificationRoutes.meRouter);
app.use('/api/equipment', require('./routes/equipment.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/owner-profiles', require('./routes/ownerProfile.routes'));
app.use('/api/company-profiles', require('./routes/companyProfile.routes'));
app.use('/api/technician-profiles', require('./routes/technicianProfile.routes'));
app.use('/api/requests', require('./routes/request.routes'));
app.use('/api/workflows', require('./routes/workflow.routes'));
app.use('/api/tenders', require('./routes/tender.routes'));
app.use('/api/tender-lots', require('./routes/tenderLot.routes'));
app.use('/api/equipment-schedules', require('./routes/equipmentSchedule.routes'));
app.use('/api/proposals', require('./routes/proposal.routes'));
app.use('/api/documents', require('./routes/document.routes'));
app.use('/api/reports', require('./routes/report.routes'));
app.use('/api/exports', require('./routes/export.routes'));
app.use('/api/maintenance', require('./routes/maintenance.routes'));
app.use('/api', require('./routes/mission.routes'));
app.use('/api', require('./routes/missionReport.routes'));
app.use('/api', require('./routes/contract.routes'));
app.use('/api', require('./routes/invoice.routes'));
app.use('/api', require('./routes/payment.routes'));

app.use(notFound);
app.use(errorMiddleware);

module.exports = app;
