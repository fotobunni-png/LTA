export type CapacityLevel = 'seats' | 'standing' | 'limited';

export type BusDeckType = 'SD' | 'DD' | 'BD'; // Single Deck, Double Deck, Bendy

export type ServiceType = 'trunk' | 'express' | 'feeder';

export type MrtLine = 'NS' | 'EW' | 'NE' | 'CC' | 'DT' | 'TE';

export interface MrtConnection {
  line: MrtLine;
  stationCode: string;
  stationName: string;
}

export interface BusArrivalInfo {
  etaMinutes: number; // 0 means 'Arr'
  etaSeconds: number;
  capacity: CapacityLevel;
  isWheelchairAccessible: boolean;
  deckType: BusDeckType;
  vehicleId: string;
  vehiclePlate: string;
  vehicleModel: string;
  scheduleVarianceSeconds: number; // e.g. -45 (delayed by 45s) or +30 (ahead)
  passengerLoadPct: number; // 0 - 100
  currentStopIndex: number; // which stop on route it is currently at
  distanceKm: number;
}

export interface BusServiceArrival {
  serviceNo: string;
  serviceType: ServiceType;
  operator: 'SBS Transit' | 'SMRT' | 'Tower Transit' | 'Go-Ahead';
  origin: string;
  destination: string;
  routeType: 'terminal' | 'loop';
  nextArrival: BusArrivalInfo;
  subsequentArrival: BusArrivalInfo;
  thirdArrival: BusArrivalInfo;
  headwayMinutes: number;
  isFavorite?: boolean;
}

export interface RouteStopNode {
  stopCode: string;
  stopName: string;
  roadName: string;
  mrtTransfers?: MrtConnection[];
  distanceKm: number;
  fareStage: number;
}

export interface BusStop {
  code: string;
  name: string;
  road: string;
  corridor: string;
  mrtTransfers?: MrtConnection[];
  services: string[];
  lat: number;
  lng: number;
  sheltered: boolean;
}

export interface TransitDisruption {
  id: string;
  severity: 'warning' | 'info' | 'critical';
  title: string;
  affectedServices: string[];
  affectedCorridor: string;
  timestamp: string;
  message: string;
}

export type ViewMode = 'commuter' | 'dispatcher';

export type FilterCategory = 'all' | 'trunk' | 'express' | 'feeder' | 'seats' | 'low-wait' | 'favorites';
