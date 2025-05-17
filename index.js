require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const promClient = require('prom-client');
const apiRoutes = require('./routes/api');
const metricsRoutes = require('./routes/metrics');
const healthRoutes = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Prometheus metrics
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// Routes
app.use('/api', apiRoutes);
app.use('/metrics', metricsRoutes);
app.use('/health', healthRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Monitoring backend running on port ${PORT}`);
});