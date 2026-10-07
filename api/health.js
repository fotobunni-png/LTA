/**
 * Health check endpoint for Singapore Commuter Transit Pulse APIs
 * Vercel Serverless Function / Express Handler
 */

export default async function handler(req, res) {
  // Support both Vercel serverless (req.query/res.json) and standard Node/Express
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  const now = new Date();
  const hasLtaKey = Boolean(process.env.LTA_ACCOUNT_KEY || process.env.AccountKey);

  const payload = {
    status: 'healthy',
    service: 'Singapore Commuter Transit Pulse API Gateway',
    timestamp: now.toISOString(),
    sgtTime: now.toLocaleTimeString('en-SG', { timeZone: 'Asia/Singapore', hour12: false }),
    uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 0),
    environment: process.env.VERCEL ? 'vercel-serverless' : process.env.NODE_ENV || 'development',
    ltaDataMall: {
      accountKeyConfigured: hasLtaKey,
      endpoint: 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival',
      refreshIntervalSeconds: 20
    },
    availableEndpoints: [
      {
        path: '/api/health',
        method: 'GET',
        description: 'System health, uptime, and configuration status'
      },
      {
        path: '/api/bus-arrival',
        method: 'GET',
        queryParams: {
          BusStopCode: 'Required 5-digit bus stop code, e.g. 04121, 09048',
          ServiceNo: 'Optional service number filter, e.g. 7, 65, 147'
        },
        description: 'Proxies LTA DataMall v3 BusArrival API with AccountKey authentication'
      }
    ]
  };

  return res.status ? res.status(200).json(payload) : res.end(JSON.stringify(payload));
}
