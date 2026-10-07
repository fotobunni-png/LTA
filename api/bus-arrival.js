/**
 * LTA DataMall v3 Bus Arrival API Proxy
 * Vercel Serverless Function & Express Route Handler
 * Endpoint: GET /api/bus-arrival?BusStopCode=04121[&ServiceNo=7]
 */

export default async function handler(req, res) {
  // CORS & caching headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, AccountKey');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  // Parse query params (handles both Vercel req.query and vanilla Node req.url)
  let busStopCode = '';
  let serviceNo = '';

  if (req.query) {
    busStopCode = req.query.BusStopCode || req.query.busStopCode || '';
    serviceNo = req.query.ServiceNo || req.query.serviceNo || '';
  } else if (req.url) {
    const urlObj = new URL(req.url, 'http://localhost');
    busStopCode = urlObj.searchParams.get('BusStopCode') || urlObj.searchParams.get('busStopCode') || '';
    serviceNo = urlObj.searchParams.get('ServiceNo') || urlObj.searchParams.get('serviceNo') || '';
  }

  // BusStopCode is required
  if (!busStopCode) {
    res.statusCode = 400;
    return res.end(JSON.stringify({
      error: "BusStopCode is required. Example: /api/bus-arrival?BusStopCode=04121[&ServiceNo=7]"
    }));
  }

  const accountKey = process.env.LTA_ACCOUNT_KEY || process.env.AccountKey || process.env.VITE_LTA_ACCOUNT_KEY;

  // If LTA_ACCOUNT_KEY is configured in Vercel or environment, fetch from official LTA DataMall
  if (accountKey) {
    try {
      let targetUrl = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${encodeURIComponent(busStopCode)}`;
      if (serviceNo) {
        targetUrl += `&ServiceNo=${encodeURIComponent(serviceNo)}`;
      }

      const ltaResponse = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'AccountKey': accountKey,
          'accept': 'application/json'
        }
      });

      if (!ltaResponse.ok) {
        const errorText = await ltaResponse.text();
        // Return informative error and fallback if invalid credentials
        res.statusCode = ltaResponse.status;
        return res.end(JSON.stringify({
          error: `LTA DataMall responded with HTTP ${ltaResponse.status}`,
          details: errorText,
          isLtaConfigured: true,
          liveFeed: false,
          fallbackData: generateMockLtaResponse(busStopCode, serviceNo)
        }));
      }

      const ltaData = await ltaResponse.json();

      // Cache for 15s to match LTA's 20-second update frequency
      res.setHeader('Cache-Control', 'public, s-maxage=20, max-age=15');
      res.statusCode = 200;
      return res.end(JSON.stringify({
        ...ltaData,
        _meta: {
          liveFeed: true,
          source: 'LTA DataMall v3 Live API',
          fetchedAt: new Date().toISOString(),
          refreshIntervalSeconds: 20
        }
      }));

    } catch (err) {
      res.statusCode = 502;
      return res.end(JSON.stringify({
        error: 'Failed to connect to LTA DataMall v3 service',
        details: err instanceof Error ? err.message : String(err),
        fallbackData: generateMockLtaResponse(busStopCode, serviceNo)
      }));
    }
  }

  // If AccountKey is not yet set in Vercel environment variables, return simulated LTA schema response
  res.setHeader('Cache-Control', 'public, s-maxage=20, max-age=15');
  res.statusCode = 200;
  const mockData = generateMockLtaResponse(busStopCode, serviceNo);
  return res.end(JSON.stringify({
    ...mockData,
    _meta: {
      liveFeed: false,
      source: 'Simulation (Awaiting LTA_ACCOUNT_KEY in Vercel environment)',
      notice: 'Please set LTA_ACCOUNT_KEY in Vercel project environment variables to receive live production LTA DataMall telemetry.',
      fetchedAt: new Date().toISOString(),
      refreshIntervalSeconds: 20
    }
  }));
}

/**
 * Generates an authentic LTA DataMall v3 compliant mock response
 */
function generateMockLtaResponse(busStopCode, serviceNoFilter) {
  const allServices = ['7', '65', '147', '190', '502', '124', '174', '851'];
  const targetServices = serviceNoFilter ? [serviceNoFilter] : (busStopCode === '04121' ? ['7', '65', '190', '502', '851'] : allServices.slice(0, 5));

  const now = Date.now();

  const services = targetServices.map((svc, idx) => {
    const min1 = Math.max(0, (idx * 2) % 6);
    const min2 = min1 + 6 + (idx % 3);
    const min3 = min2 + 8 + (idx % 4);

    const eta1 = new Date(now + min1 * 60000 + 20000).toISOString();
    const eta2 = new Date(now + min2 * 60000 + 40000).toISOString();
    const eta3 = new Date(now + min3 * 60000 + 10000).toISOString();

    return {
      ServiceNo: svc,
      Operator: svc === '190' || svc === '851' ? 'SMRT' : 'SBST',
      NextBus: {
        OriginCode: '16009',
        DestinationCode: '17009',
        EstimatedArrival: eta1,
        Latitude: '1.29654',
        Longitude: '103.8521',
        VisitNumber: '1',
        Load: idx % 4 === 1 ? 'LSD' : (idx % 3 === 0 ? 'SEA' : 'SDA'),
        Feature: 'WAB',
        Type: idx % 2 === 0 ? 'DD' : 'SD'
      },
      NextBus2: {
        OriginCode: '16009',
        DestinationCode: '17009',
        EstimatedArrival: eta2,
        Latitude: '1.29100',
        Longitude: '103.8400',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD'
      },
      NextBus3: {
        OriginCode: '16009',
        DestinationCode: '17009',
        EstimatedArrival: eta3,
        Latitude: '1.28500',
        Longitude: '103.8300',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: idx % 5 === 0 ? '' : 'WAB',
        Type: 'SD'
      }
    };
  });

  return {
    'odata.metadata': 'https://datamall2.mytransport.sg/ltaodataservice/$metadata#BusArrivalv3',
    BusStopCode: busStopCode,
    Services: services
  };
}
