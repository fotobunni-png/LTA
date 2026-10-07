import { BusStop, BusServiceArrival, RouteStopNode, TransitDisruption } from '../types/transit';

export const INITIAL_STOPS: BusStop[] = [
  {
    code: '09048',
    name: 'Lucky Plaza / Orchard Stn',
    road: 'Orchard Rd',
    corridor: 'Orchard Spine',
    mrtTransfers: [
      { line: 'NS', stationCode: 'NS22', stationName: 'Orchard' },
      { line: 'TE', stationCode: 'TE14', stationName: 'Orchard' }
    ],
    services: ['65', '147', '190', '502', '124', '174', '14e'],
    lat: 1.3044,
    lng: 103.8342,
    sheltered: true
  },
  {
    code: '08057',
    name: 'Dhoby Ghaut Stn Exit B',
    road: 'Orchard Rd',
    corridor: 'Orchard Spine',
    mrtTransfers: [
      { line: 'NS', stationCode: 'NS24', stationName: 'Dhoby Ghaut' },
      { line: 'NE', stationCode: 'NE6', stationName: 'Dhoby Ghaut' },
      { line: 'CC', stationCode: 'CC1', stationName: 'Dhoby Ghaut' }
    ],
    services: ['65', '190', '502', '124', '174'],
    lat: 1.2995,
    lng: 103.8458,
    sheltered: true
  },
  {
    code: '08111',
    name: 'Winsland Hse / Somerset',
    road: 'Somerset Rd',
    corridor: 'Orchard Spine',
    mrtTransfers: [
      { line: 'NS', stationCode: 'NS23', stationName: 'Somerset' }
    ],
    services: ['65', '124', '147', '190'],
    lat: 1.3009,
    lng: 103.8396,
    sheltered: true
  },
  {
    code: '04121',
    name: 'Raffles Hotel / Bras Basah',
    road: 'Bras Basah Rd',
    corridor: 'Downtown Civic Corridor',
    mrtTransfers: [
      { line: 'CC', stationCode: 'CC2', stationName: 'Bras Basah' },
      { line: 'EW', stationCode: 'EW13', stationName: 'City Hall' },
      { line: 'NS', stationCode: 'NS25', stationName: 'City Hall' }
    ],
    services: ['7', '65', '190', '502', '851'],
    lat: 1.2962,
    lng: 103.8541,
    sheltered: true
  },
  {
    code: '04179',
    name: 'Bugis Stn Exit A',
    road: 'Victoria St',
    corridor: 'Downtown Civic Corridor',
    mrtTransfers: [
      { line: 'EW', stationCode: 'EW12', stationName: 'Bugis' },
      { line: 'DT', stationCode: 'DT14', stationName: 'Bugis' }
    ],
    services: ['65', '147', '851', '190'],
    lat: 1.3003,
    lng: 103.8559,
    sheltered: true
  },
  {
    code: '05013',
    name: 'Chinatown Stn Exit E',
    road: 'Eu Tong Sen St',
    corridor: 'Chinatown Central',
    mrtTransfers: [
      { line: 'NE', stationCode: 'NE4', stationName: 'Chinatown' },
      { line: 'DT', stationCode: 'DT19', stationName: 'Chinatown' }
    ],
    services: ['147', '190', '851', '124'],
    lat: 1.2842,
    lng: 103.8441,
    sheltered: true
  },
  {
    code: '05189',
    name: 'Clarke Quay Stn Exit A',
    road: 'Eu Tong Sen St',
    corridor: 'Chinatown Central',
    mrtTransfers: [
      { line: 'NE', stationCode: 'NE5', stationName: 'Clarke Quay' }
    ],
    services: ['147', '190', '124'],
    lat: 1.2885,
    lng: 103.8465,
    sheltered: true
  },
  {
    code: '14141',
    name: 'VivoCity / HarbourFront',
    road: 'Telok Blangah Rd',
    corridor: 'HarbourFront Southern Arc',
    mrtTransfers: [
      { line: 'NE', stationCode: 'NE1', stationName: 'HarbourFront' },
      { line: 'CC', stationCode: 'CC29', stationName: 'HarbourFront' }
    ],
    services: ['65', '147', '124', '10e'],
    lat: 1.2644,
    lng: 103.8222,
    sheltered: true
  },
  {
    code: '17171',
    name: 'Clementi Stn Exit B',
    road: 'Commonwealth Ave W',
    corridor: 'Western Regional Link',
    mrtTransfers: [
      { line: 'EW', stationCode: 'EW23', stationName: 'Clementi' }
    ],
    services: ['147', '502', '14e'],
    lat: 1.3151,
    lng: 103.7652,
    sheltered: true
  },
  {
    code: '84009',
    name: 'Bedok Bus Interchange',
    road: 'Bedok North Ave 1',
    corridor: 'Eastern Transit Hub',
    mrtTransfers: [
      { line: 'EW', stationCode: 'EW5', stationName: 'Bedok' }
    ],
    services: ['65', '222', '10e', '14e'],
    lat: 1.3241,
    lng: 103.9301,
    sheltered: true
  }
];

export const SERVICE_DEFINITIONS: Record<string, {
  serviceNo: string;
  serviceType: 'trunk' | 'express' | 'feeder';
  operator: 'SBS Transit' | 'SMRT' | 'Tower Transit' | 'Go-Ahead';
  origin: string;
  destination: string;
  routeType: 'terminal' | 'loop';
  routeStops: RouteStopNode[];
}> = {
  '7': {
    serviceNo: '7',
    serviceType: 'trunk',
    operator: 'SBS Transit',
    origin: 'Bedok Int',
    destination: 'Clementi Int',
    routeType: 'terminal',
    routeStops: [
      { stopCode: '84009', stopName: 'Bedok Int', roadName: 'Bedok North Ave 1', distanceKm: 0, fareStage: 1, mrtTransfers: [{ line: 'EW', stationCode: 'EW5', stationName: 'Bedok' }] },
      { stopCode: '04179', stopName: 'Bugis Stn Exit A', roadName: 'Victoria St', distanceKm: 12.3, fareStage: 14, mrtTransfers: [{ line: 'EW', stationCode: 'EW12', stationName: 'Bugis' }, { line: 'DT', stationCode: 'DT14', stationName: 'Bugis' }] },
      { stopCode: '04121', stopName: 'Raffles Hotel', roadName: 'Bras Basah Rd', distanceKm: 13.5, fareStage: 15, mrtTransfers: [{ line: 'CC', stationCode: 'CC2', stationName: 'Bras Basah' }] },
      { stopCode: '08057', stopName: 'Dhoby Ghaut Stn', roadName: 'Orchard Rd', distanceKm: 14.8, fareStage: 17, mrtTransfers: [{ line: 'NS', stationCode: 'NS24', stationName: 'Dhoby Ghaut' }] },
      { stopCode: '09048', stopName: 'Lucky Plaza / Orchard Stn', roadName: 'Orchard Rd', distanceKm: 16.2, fareStage: 19, mrtTransfers: [{ line: 'NS', stationCode: 'NS22', stationName: 'Orchard' }] },
      { stopCode: '17171', stopName: 'Clementi Stn Exit B', roadName: 'Commonwealth Ave W', distanceKm: 26.2, fareStage: 29, mrtTransfers: [{ line: 'EW', stationCode: 'EW23', stationName: 'Clementi' }] }
    ]
  },
  '65': {
    serviceNo: '65',
    serviceType: 'trunk',
    operator: 'SBS Transit',
    origin: 'Tampines Int',
    destination: 'HarbourFront Int',
    routeType: 'terminal',
    routeStops: [
      { stopCode: '76559', stopName: 'Tampines Int', roadName: 'Tampines Central 1', distanceKm: 0, fareStage: 1, mrtTransfers: [{ line: 'EW', stationCode: 'EW2', stationName: 'Tampines' }, { line: 'DT', stationCode: 'DT32', stationName: 'Tampines' }] },
      { stopCode: '84009', stopName: 'Bedok Int', roadName: 'Bedok North Ave 1', distanceKm: 6.2, fareStage: 7, mrtTransfers: [{ line: 'EW', stationCode: 'EW5', stationName: 'Bedok' }] },
      { stopCode: '04179', stopName: 'Bugis Stn Exit A', roadName: 'Victoria St', distanceKm: 14.8, fareStage: 16, mrtTransfers: [{ line: 'EW', stationCode: 'EW12', stationName: 'Bugis' }, { line: 'DT', stationCode: 'DT14', stationName: 'Bugis' }] },
      { stopCode: '04121', stopName: 'Raffles Hotel', roadName: 'Bras Basah Rd', distanceKm: 16.1, fareStage: 18, mrtTransfers: [{ line: 'CC', stationCode: 'CC2', stationName: 'Bras Basah' }] },
      { stopCode: '08057', stopName: 'Dhoby Ghaut Stn', roadName: 'Orchard Rd', distanceKm: 17.5, fareStage: 20, mrtTransfers: [{ line: 'NS', stationCode: 'NS24', stationName: 'Dhoby Ghaut' }] },
      { stopCode: '08111', stopName: 'Winsland Hse', roadName: 'Somerset Rd', distanceKm: 18.2, fareStage: 21, mrtTransfers: [{ line: 'NS', stationCode: 'NS23', stationName: 'Somerset' }] },
      { stopCode: '09048', stopName: 'Lucky Plaza / Orchard Stn', roadName: 'Orchard Rd', distanceKm: 19.3, fareStage: 22, mrtTransfers: [{ line: 'NS', stationCode: 'NS22', stationName: 'Orchard' }, { line: 'TE', stationCode: 'TE14', stationName: 'Orchard' }] },
      { stopCode: '14141', stopName: 'VivoCity / HarbourFront', roadName: 'Telok Blangah Rd', distanceKm: 24.6, fareStage: 28, mrtTransfers: [{ line: 'NE', stationCode: 'NE1', stationName: 'HarbourFront' }, { line: 'CC', stationCode: 'CC29', stationName: 'HarbourFront' }] }
    ]
  },
  '147': {
    serviceNo: '147',
    serviceType: 'trunk',
    operator: 'SBS Transit',
    origin: 'Hougang Central Int',
    destination: 'Clementi Int',
    routeType: 'terminal',
    routeStops: [
      { stopCode: '64009', stopName: 'Hougang Central Int', roadName: 'Hougang Central', distanceKm: 0, fareStage: 1, mrtTransfers: [{ line: 'NE', stationCode: 'NE14', stationName: 'Hougang' }] },
      { stopCode: '04179', stopName: 'Bugis Stn Exit A', roadName: 'Victoria St', distanceKm: 11.4, fareStage: 13, mrtTransfers: [{ line: 'EW', stationCode: 'EW12', stationName: 'Bugis' }] },
      { stopCode: '05189', stopName: 'Clarke Quay Stn', roadName: 'Eu Tong Sen St', distanceKm: 13.1, fareStage: 15, mrtTransfers: [{ line: 'NE', stationCode: 'NE5', stationName: 'Clarke Quay' }] },
      { stopCode: '05013', stopName: 'Chinatown Stn Exit E', roadName: 'Eu Tong Sen St', distanceKm: 14.0, fareStage: 16, mrtTransfers: [{ line: 'NE', stationCode: 'NE4', stationName: 'Chinatown' }] },
      { stopCode: '09048', stopName: 'Lucky Plaza / Orchard Stn', roadName: 'Orchard Rd', distanceKm: 16.5, fareStage: 19, mrtTransfers: [{ line: 'NS', stationCode: 'NS22', stationName: 'Orchard' }] },
      { stopCode: '14141', stopName: 'VivoCity / HarbourFront', roadName: 'Telok Blangah Rd', distanceKm: 20.8, fareStage: 24, mrtTransfers: [{ line: 'NE', stationCode: 'NE1', stationName: 'HarbourFront' }] },
      { stopCode: '17171', stopName: 'Clementi Stn Exit B', roadName: 'Commonwealth Ave W', distanceKm: 27.2, fareStage: 31, mrtTransfers: [{ line: 'EW', stationCode: 'EW23', stationName: 'Clementi' }] }
    ]
  },
  '190': {
    serviceNo: '190',
    serviceType: 'trunk',
    operator: 'SMRT',
    origin: 'Choa Chu Kang Int',
    destination: 'Kampong Bahru Ter',
    routeType: 'terminal',
    routeStops: [
      { stopCode: '44009', stopName: 'Choa Chu Kang Int', roadName: 'Choa Chu Kang Loop', distanceKm: 0, fareStage: 1, mrtTransfers: [{ line: 'NS', stationCode: 'NS4', stationName: 'Choa Chu Kang' }] },
      { stopCode: '09048', stopName: 'Lucky Plaza / Orchard Stn', roadName: 'Orchard Rd', distanceKm: 17.1, fareStage: 19, mrtTransfers: [{ line: 'NS', stationCode: 'NS22', stationName: 'Orchard' }] },
      { stopCode: '08111', stopName: 'Winsland Hse', roadName: 'Somerset Rd', distanceKm: 18.0, fareStage: 20, mrtTransfers: [{ line: 'NS', stationCode: 'NS23', stationName: 'Somerset' }] },
      { stopCode: '08057', stopName: 'Dhoby Ghaut Stn', roadName: 'Orchard Rd', distanceKm: 18.9, fareStage: 21, mrtTransfers: [{ line: 'NS', stationCode: 'NS24', stationName: 'Dhoby Ghaut' }] },
      { stopCode: '05189', stopName: 'Clarke Quay Stn', roadName: 'Eu Tong Sen St', distanceKm: 20.5, fareStage: 23, mrtTransfers: [{ line: 'NE', stationCode: 'NE5', stationName: 'Clarke Quay' }] },
      { stopCode: '05013', stopName: 'Chinatown Stn Exit E', roadName: 'Eu Tong Sen St', distanceKm: 21.3, fareStage: 24, mrtTransfers: [{ line: 'NE', stationCode: 'NE4', stationName: 'Chinatown' }] }
    ]
  },
  '502': {
    serviceNo: '502',
    serviceType: 'express',
    operator: 'SBS Transit',
    origin: 'Soon Lee Bus Depot',
    destination: 'Bayfront Ave (Loop)',
    routeType: 'loop',
    routeStops: [
      { stopCode: '22009', stopName: 'Pioneer Mall', roadName: 'Jurong West St 61', distanceKm: 0, fareStage: 1 },
      { stopCode: '17171', stopName: 'Clementi Stn Exit B', roadName: 'Commonwealth Ave W', distanceKm: 10.2, fareStage: 12, mrtTransfers: [{ line: 'EW', stationCode: 'EW23', stationName: 'Clementi' }] },
      { stopCode: '09048', stopName: 'Lucky Plaza / Orchard Stn', roadName: 'Orchard Rd', distanceKm: 21.0, fareStage: 24, mrtTransfers: [{ line: 'NS', stationCode: 'NS22', stationName: 'Orchard' }] },
      { stopCode: '08057', stopName: 'Dhoby Ghaut Stn', roadName: 'Orchard Rd', distanceKm: 22.8, fareStage: 26, mrtTransfers: [{ line: 'NS', stationCode: 'NS24', stationName: 'Dhoby Ghaut' }] },
      { stopCode: '04121', stopName: 'Raffles Hotel', roadName: 'Bras Basah Rd', distanceKm: 24.1, fareStage: 27, mrtTransfers: [{ line: 'CC', stationCode: 'CC2', stationName: 'Bras Basah' }] }
    ]
  },
  '10e': {
    serviceNo: '10e',
    serviceType: 'express',
    operator: 'SBS Transit',
    origin: 'Bedok South Ave 1',
    destination: 'Shenton Way / HarbourFront',
    routeType: 'terminal',
    routeStops: [
      { stopCode: '84009', stopName: 'Bedok Int', roadName: 'Bedok North Ave 1', distanceKm: 0, fareStage: 1, mrtTransfers: [{ line: 'EW', stationCode: 'EW5', stationName: 'Bedok' }] },
      { stopCode: '14141', stopName: 'VivoCity / HarbourFront', roadName: 'Telok Blangah Rd', distanceKm: 18.5, fareStage: 20, mrtTransfers: [{ line: 'NE', stationCode: 'NE1', stationName: 'HarbourFront' }] }
    ]
  },
  '222': {
    serviceNo: '222',
    serviceType: 'feeder',
    operator: 'SBS Transit',
    origin: 'Bedok Int',
    destination: 'Chai Chee Dr (Loop)',
    routeType: 'loop',
    routeStops: [
      { stopCode: '84009', stopName: 'Bedok Int', roadName: 'Bedok North Ave 1', distanceKm: 0, fareStage: 1, mrtTransfers: [{ line: 'EW', stationCode: 'EW5', stationName: 'Bedok' }] },
      { stopCode: '84239', stopName: 'Chai Chee Ind Pk', roadName: 'Chai Chee Dr', distanceKm: 2.1, fareStage: 3 },
      { stopCode: '84009', stopName: 'Bedok Int', roadName: 'Bedok North Ave 1', distanceKm: 4.8, fareStage: 6, mrtTransfers: [{ line: 'EW', stationCode: 'EW5', stationName: 'Bedok' }] }
    ]
  },
  '851': {
    serviceNo: '851',
    serviceType: 'trunk',
    operator: 'SMRT',
    origin: 'Yishun Int',
    destination: 'Bukit Merah Int',
    routeType: 'terminal',
    routeStops: [
      { stopCode: '59009', stopName: 'Yishun Int', roadName: 'Yishun Ave 2', distanceKm: 0, fareStage: 1, mrtTransfers: [{ line: 'NS', stationCode: 'NS13', stationName: 'Yishun' }] },
      { stopCode: '04179', stopName: 'Bugis Stn Exit A', roadName: 'Victoria St', distanceKm: 16.3, fareStage: 18, mrtTransfers: [{ line: 'EW', stationCode: 'EW12', stationName: 'Bugis' }] },
      { stopCode: '04121', stopName: 'Raffles Hotel', roadName: 'Bras Basah Rd', distanceKm: 17.5, fareStage: 19, mrtTransfers: [{ line: 'CC', stationCode: 'CC2', stationName: 'Bras Basah' }] },
      { stopCode: '05013', stopName: 'Chinatown Stn Exit E', roadName: 'Eu Tong Sen St', distanceKm: 19.8, fareStage: 22, mrtTransfers: [{ line: 'NE', stationCode: 'NE4', stationName: 'Chinatown' }] }
    ]
  },
  '124': {
    serviceNo: '124',
    serviceType: 'trunk',
    operator: 'SBS Transit',
    origin: "St. Michael's Ter",
    destination: 'Telok Blangah Rise (Loop)',
    routeType: 'loop',
    routeStops: [
      { stopCode: '52499', stopName: "St. Michael's Ter", roadName: 'Whampoa Rd', distanceKm: 0, fareStage: 1 },
      { stopCode: '08057', stopName: 'Dhoby Ghaut Stn', roadName: 'Orchard Rd', distanceKm: 5.4, fareStage: 6, mrtTransfers: [{ line: 'NS', stationCode: 'NS24', stationName: 'Dhoby Ghaut' }] },
      { stopCode: '08111', stopName: 'Winsland Hse', roadName: 'Somerset Rd', distanceKm: 6.2, fareStage: 7, mrtTransfers: [{ line: 'NS', stationCode: 'NS23', stationName: 'Somerset' }] },
      { stopCode: '09048', stopName: 'Lucky Plaza / Orchard Stn', roadName: 'Orchard Rd', distanceKm: 7.3, fareStage: 9, mrtTransfers: [{ line: 'NS', stationCode: 'NS22', stationName: 'Orchard' }] },
      { stopCode: '05189', stopName: 'Clarke Quay Stn', roadName: 'Eu Tong Sen St', distanceKm: 9.9, fareStage: 12, mrtTransfers: [{ line: 'NE', stationCode: 'NE5', stationName: 'Clarke Quay' }] },
      { stopCode: '05013', stopName: 'Chinatown Stn Exit E', roadName: 'Eu Tong Sen St', distanceKm: 10.7, fareStage: 13, mrtTransfers: [{ line: 'NE', stationCode: 'NE4', stationName: 'Chinatown' }] },
      { stopCode: '14141', stopName: 'VivoCity / HarbourFront', roadName: 'Telok Blangah Rd', distanceKm: 14.8, fareStage: 17, mrtTransfers: [{ line: 'NE', stationCode: 'NE1', stationName: 'HarbourFront' }] }
    ]
  },
  '174': {
    serviceNo: '174',
    serviceType: 'trunk',
    operator: 'SBS Transit',
    origin: 'Boon Lay Int',
    destination: 'New Bridge Rd Ter',
    routeType: 'terminal',
    routeStops: [
      { stopCode: '22009', stopName: 'Boon Lay Int', roadName: 'Jurong West Central 3', distanceKm: 0, fareStage: 1, mrtTransfers: [{ line: 'EW', stationCode: 'EW27', stationName: 'Boon Lay' }] },
      { stopCode: '09048', stopName: 'Lucky Plaza / Orchard Stn', roadName: 'Orchard Rd', distanceKm: 21.6, fareStage: 24, mrtTransfers: [{ line: 'NS', stationCode: 'NS22', stationName: 'Orchard' }] },
      { stopCode: '08057', stopName: 'Dhoby Ghaut Stn', roadName: 'Orchard Rd', distanceKm: 23.4, fareStage: 26, mrtTransfers: [{ line: 'NS', stationCode: 'NS24', stationName: 'Dhoby Ghaut' }] }
    ]
  },
  '14e': {
    serviceNo: '14e',
    serviceType: 'express',
    operator: 'SBS Transit',
    origin: 'Bedok Rd',
    destination: 'Orchard Rd / Clementi',
    routeType: 'terminal',
    routeStops: [
      { stopCode: '84009', stopName: 'Bedok Int', roadName: 'Bedok North Ave 1', distanceKm: 0, fareStage: 1, mrtTransfers: [{ line: 'EW', stationCode: 'EW5', stationName: 'Bedok' }] },
      { stopCode: '09048', stopName: 'Lucky Plaza / Orchard Stn', roadName: 'Orchard Rd', distanceKm: 15.2, fareStage: 18, mrtTransfers: [{ line: 'NS', stationCode: 'NS22', stationName: 'Orchard' }] },
      { stopCode: '17171', stopName: 'Clementi Stn Exit B', roadName: 'Commonwealth Ave W', distanceKm: 24.5, fareStage: 27, mrtTransfers: [{ line: 'EW', stationCode: 'EW23', stationName: 'Clementi' }] }
    ]
  }
};

export const INITIAL_DISRUPTIONS: TransitDisruption[] = [
  {
    id: 'd-1',
    severity: 'warning',
    title: 'Adverse Equatorial Weather & Surface Ponding',
    affectedServices: ['65', '147', '190'],
    affectedCorridor: 'Orchard Rd & Paterson Hill corridor',
    timestamp: '12 min ago',
    message: 'Heavy localized thunderstorm along Orchard Road. Services 65 and 190 are experiencing slight dwell extension of +3 to 5 mins. Bus spacing algorithms engaged.'
  },
  {
    id: 'd-2',
    severity: 'info',
    title: 'LTA Night Roadwork Diversion Notice',
    affectedServices: ['502', '10e'],
    affectedCorridor: 'Marina Coastal Expressway (MCE)',
    timestamp: '35 min ago',
    message: 'Scheduled lane closure from 23:30 to 05:00. Express services 502 and 10e will proceed on normal express fare structure with minor alternative routing.'
  }
];

export const VEHICLE_FLEET_PRESETS = [
  { plate: 'SBS3221U', model: 'Volvo B9TL Wright Eclipse Gemini 2', deck: 'DD' as const, operator: 'SBS Transit' as const },
  { plate: 'SG5920C', model: 'MAN A95 Lion\'s City DD (Euro 6)', deck: 'DD' as const, operator: 'SBS Transit' as const },
  { plate: 'SMB1388S', model: 'MAN A22 Lion\'s City Single Deck', deck: 'SD' as const, operator: 'SMRT' as const },
  { plate: 'SG1001G', model: 'Mercedes-Benz Citaro Facelift', deck: 'SD' as const, operator: 'SBS Transit' as const },
  { plate: 'SG4002D', model: 'Volvo B5LH Parallel Hybrid DD', deck: 'DD' as const, operator: 'Tower Transit' as const },
  { plate: 'SG5821K', model: 'ADL Enviro500 3-Door High-Capacity', deck: 'DD' as const, operator: 'Go-Ahead' as const },
  { plate: 'SMB8034K', model: 'MAN Lion\'s City Articulated (Bendy)', deck: 'BD' as const, operator: 'SMRT' as const }
];
