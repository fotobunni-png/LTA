import { BusArrivalInfo, BusDeckType, BusServiceArrival, BusStop, CapacityLevel, MrtLine, ServiceType } from '../types/transit';
import { SERVICE_DEFINITIONS, VEHICLE_FLEET_PRESETS } from '../data/transitData';

export function getMrtLineColor(line: MrtLine): { bg: string; text: string; name: string } {
  switch (line) {
    case 'NS':
      return { bg: '#D42E12', text: '#FFFFFF', name: 'North-South' };
    case 'EW':
      return { bg: '#009640', text: '#FFFFFF', name: 'East-West' };
    case 'NE':
      return { bg: '#9900AA', text: '#FFFFFF', name: 'North East' };
    case 'CC':
      return { bg: '#FA9E0D', text: '#000000', name: 'Circle Line' };
    case 'DT':
      return { bg: '#005EC4', text: '#FFFFFF', name: 'Downtown' };
    case 'TE':
      return { bg: '#9D5B25', text: '#FFFFFF', name: 'Thomson-East Coast' };
    default:
      return { bg: '#1E293B', text: '#FFFFFF', name: 'MRT' };
  }
}

export function formatEtaString(minutes: number, seconds: number): string {
  if (minutes <= 0 && seconds <= 30) {
    return 'Arr';
  }
  if (minutes <= 0) {
    return '<1m';
  }
  return `${minutes}m`;
}

export function getCapacityDetails(capacity: CapacityLevel): {
  label: string;
  badgeClass: string;
  dotColor: string;
  borderColor: string;
  textColor: string;
} {
  switch (capacity) {
    case 'seats':
      return {
        label: 'Seats',
        badgeClass: 'border-[#16A34A]/30 text-[#16A34A] bg-[#16A34A]/5',
        dotColor: '#16A34A',
        borderColor: '#16A34A',
        textColor: 'text-[#16A34A]'
      };
    case 'standing':
      return {
        label: 'Standing',
        badgeClass: 'border-[#D97706]/40 text-[#D97706] bg-[#D97706]/5',
        dotColor: '#D97706',
        borderColor: '#D97706',
        textColor: 'text-[#D97706]'
      };
    case 'limited':
      return {
        label: 'Full',
        badgeClass: 'border-[#DC2626] text-white bg-[#DC2626]',
        dotColor: '#DC2626',
        borderColor: '#DC2626',
        textColor: 'text-[#DC2626]'
      };
  }
}

function getRandomFleet(index: number) {
  return VEHICLE_FLEET_PRESETS[index % VEHICLE_FLEET_PRESETS.length];
}

export function generateArrivalsForStop(stop: BusStop): BusServiceArrival[] {
  return stop.services.map((svcNo, sIndex) => {
    const def = SERVICE_DEFINITIONS[svcNo] || {
      serviceNo: svcNo,
      serviceType: 'trunk' as const,
      operator: 'SBS Transit' as const,
      origin: 'Loop Hub',
      destination: 'Town Terminal',
      routeType: 'terminal' as const,
      routeStops: []
    };

    // Stagger arrival times realistically based on service index
    const baseGap = 4 + (sIndex * 2) % 6;
    const eta1Min = Math.max(0, (sIndex * 3) % 7);
    const eta1Sec = eta1Min === 0 ? 25 : (sIndex * 19) % 60;

    const eta2Min = eta1Min + baseGap + 3;
    const eta2Sec = (eta1Sec + 35) % 60;

    const eta3Min = eta2Min + baseGap + 4;
    const eta3Sec = (eta2Sec + 20) % 60;

    const fleet1 = getRandomFleet(sIndex * 3);
    const fleet2 = getRandomFleet(sIndex * 3 + 1);
    const fleet3 = getRandomFleet(sIndex * 3 + 2);

    const capacities: CapacityLevel[] = ['seats', 'standing', 'limited'];
    const cap1 = sIndex % 4 === 1 ? 'limited' : (sIndex % 3 === 0 ? 'seats' : 'standing');
    const cap2 = (sIndex + 1) % 3 === 0 ? 'standing' : 'seats';
    const cap3 = 'seats';

    const arr1: BusArrivalInfo = {
      etaMinutes: eta1Min,
      etaSeconds: eta1Sec,
      capacity: cap1,
      isWheelchairAccessible: true,
      deckType: fleet1.deck,
      vehicleId: `BUS-${svcNo}-01`,
      vehiclePlate: fleet1.plate,
      vehicleModel: fleet1.model,
      scheduleVarianceSeconds: (sIndex % 2 === 0 ? 30 : -55),
      passengerLoadPct: cap1 === 'limited' ? 94 : (cap1 === 'standing' ? 68 : 34),
      currentStopIndex: 3,
      distanceKm: Math.max(0.1, Number((eta1Min * 0.45 + 0.2).toFixed(1)))
    };

    const arr2: BusArrivalInfo = {
      etaMinutes: eta2Min,
      etaSeconds: eta2Sec,
      capacity: cap2,
      isWheelchairAccessible: true,
      deckType: fleet2.deck,
      vehicleId: `BUS-${svcNo}-02`,
      vehiclePlate: fleet2.plate,
      vehicleModel: fleet2.model,
      scheduleVarianceSeconds: +15,
      passengerLoadPct: cap2 === 'standing' ? 62 : 30,
      currentStopIndex: 1,
      distanceKm: Number((eta2Min * 0.45).toFixed(1))
    };

    const arr3: BusArrivalInfo = {
      etaMinutes: eta3Min,
      etaSeconds: eta3Sec,
      capacity: cap3,
      isWheelchairAccessible: sIndex % 5 !== 0,
      deckType: fleet3.deck,
      vehicleId: `BUS-${svcNo}-03`,
      vehiclePlate: fleet3.plate,
      vehicleModel: fleet3.model,
      scheduleVarianceSeconds: -10,
      passengerLoadPct: 22,
      currentStopIndex: 0,
      distanceKm: Number((eta3Min * 0.45).toFixed(1))
    };

    return {
      serviceNo: def.serviceNo,
      serviceType: def.serviceType,
      operator: def.operator,
      origin: def.origin,
      destination: def.destination,
      routeType: def.routeType,
      nextArrival: arr1,
      subsequentArrival: arr2,
      thirdArrival: arr3,
      headwayMinutes: baseGap + 4,
      isFavorite: false
    };
  });
}

/**
 * Tick arrivals down by 1 second
 */
export function tickArrivals(services: BusServiceArrival[]): {
  updatedServices: BusServiceArrival[];
  justArrivedList: string[];
} {
  const justArrivedList: string[] = [];

  const updatedServices = services.map(svc => {
    let { nextArrival, subsequentArrival, thirdArrival } = svc;

    // Tick next arrival
    let totalSec1 = nextArrival.etaMinutes * 60 + nextArrival.etaSeconds - 1;
    let totalSec2 = subsequentArrival.etaMinutes * 60 + subsequentArrival.etaSeconds - 1;
    let totalSec3 = thirdArrival.etaMinutes * 60 + thirdArrival.etaSeconds - 1;

    // Check if next bus has arrived or completed boarding
    if (totalSec1 <= -30) {
      // Shift arrivals! Next bus departed, 2nd becomes next, 3rd becomes 2nd
      justArrivedList.push(svc.serviceNo);
      nextArrival = {
        ...subsequentArrival,
        distanceKm: 0.1
      };
      subsequentArrival = {
        ...thirdArrival
      };
      // Generate new 3rd arrival in 15-20 mins
      const newFleet = getRandomFleet(Math.floor(Math.random() * 10));
      thirdArrival = {
        etaMinutes: 16,
        etaSeconds: 40,
        capacity: 'seats',
        isWheelchairAccessible: true,
        deckType: newFleet.deck,
        vehicleId: `BUS-${svc.serviceNo}-${Math.floor(Math.random() * 80 + 10)}`,
        vehiclePlate: newFleet.plate,
        vehicleModel: newFleet.model,
        scheduleVarianceSeconds: 0,
        passengerLoadPct: 20,
        currentStopIndex: 0,
        distanceKm: 7.2
      };
    } else {
      const min1 = Math.floor(Math.max(0, totalSec1) / 60);
      const sec1 = Math.max(0, totalSec1) % 60;
      nextArrival = {
        ...nextArrival,
        etaMinutes: min1,
        etaSeconds: sec1,
        distanceKm: Number(Math.max(0.1, min1 * 0.4 + sec1 * 0.006).toFixed(1))
      };

      const min2 = Math.floor(Math.max(0, totalSec2) / 60);
      const sec2 = Math.max(0, totalSec2) % 60;
      subsequentArrival = {
        ...subsequentArrival,
        etaMinutes: min2,
        etaSeconds: sec2
      };

      const min3 = Math.floor(Math.max(0, totalSec3) / 60);
      const sec3 = Math.max(0, totalSec3) % 60;
      thirdArrival = {
        ...thirdArrival,
        etaMinutes: min3,
        etaSeconds: sec3
      };
    }

    return {
      ...svc,
      nextArrival,
      subsequentArrival,
      thirdArrival
    };
  });

  return { updatedServices, justArrivedList };
}

export interface LtaBusUnitRaw {
  OriginCode?: string;
  DestinationCode?: string;
  EstimatedArrival?: string;
  Latitude?: string;
  Longitude?: string;
  VisitNumber?: string;
  Load?: string;
  Feature?: string;
  Type?: string;
}

export interface LtaServiceRaw {
  ServiceNo: string;
  Operator: string;
  NextBus?: LtaBusUnitRaw;
  NextBus2?: LtaBusUnitRaw;
  NextBus3?: LtaBusUnitRaw;
}

export interface LtaApiResponseRaw {
  BusStopCode: string;
  Services?: LtaServiceRaw[];
  _meta?: {
    liveFeed?: boolean;
    source?: string;
    refreshIntervalSeconds?: number;
  };
}

export function parseLtaBusArrivalResponse(
  raw: LtaApiResponseRaw,
  fallbackStop?: BusStop
): BusServiceArrival[] {
  if (!raw || !Array.isArray(raw.Services) || raw.Services.length === 0) {
    return fallbackStop ? generateArrivalsForStop(fallbackStop) : [];
  }

  const nowMs = Date.now();

  const convertUnit = (unit?: LtaBusUnitRaw, fallbackIndex: number = 0, svcNo: string = ''): BusArrivalInfo => {
    const fleet = getRandomFleet(fallbackIndex);
    if (!unit || !unit.EstimatedArrival) {
      return {
        etaMinutes: 15 + fallbackIndex * 5,
        etaSeconds: 0,
        capacity: 'seats',
        isWheelchairAccessible: true,
        deckType: fleet.deck,
        vehicleId: `BUS-${svcNo}-${fallbackIndex + 1}`,
        vehiclePlate: fleet.plate,
        vehicleModel: fleet.model,
        scheduleVarianceSeconds: 0,
        passengerLoadPct: 30,
        currentStopIndex: 0,
        distanceKm: Number(((15 + fallbackIndex * 5) * 0.45).toFixed(1))
      };
    }

    const diffMs = new Date(unit.EstimatedArrival).getTime() - nowMs;
    const diffSec = Math.floor(diffMs / 1000);
    const etaMin = Math.max(0, Math.floor(diffSec / 60));
    const etaSec = Math.max(0, diffSec % 60);

    let capacity: CapacityLevel = 'seats';
    if (unit.Load === 'LSD') capacity = 'limited';
    else if (unit.Load === 'SDA') capacity = 'standing';
    else if (unit.Load === 'SEA') capacity = 'seats';

    const deckType: BusDeckType = (unit.Type === 'DD' || unit.Type === 'BD' || unit.Type === 'SD')
      ? (unit.Type as BusDeckType)
      : fleet.deck;

    const isWab = unit.Feature === 'WAB';

    return {
      etaMinutes: etaMin,
      etaSeconds: etaSec,
      capacity,
      isWheelchairAccessible: isWab,
      deckType,
      vehicleId: `BUS-${svcNo}-${fallbackIndex + 1}`,
      vehiclePlate: fleet.plate,
      vehicleModel: fleet.model,
      scheduleVarianceSeconds: (fallbackIndex === 0 ? -25 : +15),
      passengerLoadPct: capacity === 'limited' ? 92 : (capacity === 'standing' ? 65 : 28),
      currentStopIndex: Math.max(0, 3 - fallbackIndex),
      distanceKm: Number(Math.max(0.1, etaMin * 0.45 + etaSec * 0.0075).toFixed(1))
    };
  };

  return raw.Services.map((item) => {
    const isExpress = item.ServiceNo.endsWith('e');
    const isFeeder = item.ServiceNo.length === 3 && item.ServiceNo.startsWith('2');
    const computedType: ServiceType = isExpress ? 'express' : (isFeeder ? 'feeder' : 'trunk');

    const def = SERVICE_DEFINITIONS[item.ServiceNo] || {
      serviceNo: item.ServiceNo,
      serviceType: computedType,
      operator: (item.Operator === 'SMRT' ? 'SMRT' : 'SBS Transit'),
      origin: 'Loop Hub',
      destination: 'Terminal',
      routeType: 'terminal' as const,
      routeStops: []
    };

    return {
      serviceNo: item.ServiceNo,
      serviceType: def.serviceType,
      operator: (item.Operator === 'SMRT' ? 'SMRT' : item.Operator === 'GAS' ? 'Go-Ahead' : item.Operator === 'TTS' ? 'Tower Transit' : 'SBS Transit'),
      origin: def.origin,
      destination: def.destination,
      routeType: def.routeType,
      nextArrival: convertUnit(item.NextBus, 0, item.ServiceNo),
      subsequentArrival: convertUnit(item.NextBus2, 1, item.ServiceNo),
      thirdArrival: convertUnit(item.NextBus3, 2, item.ServiceNo),
      headwayMinutes: 8,
      isFavorite: false
    };
  });
}
