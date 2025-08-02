export interface ParkingSpot {
    id: number;
    code: string;
    type: string;
    property: string;
    level: string;
    tm: number;
    price: number;
    value: number;
    valueWithVat: number;
    status: string;
    owner: string;
    holder: string;
    registeredBy: string;
}

export const parkingSpots: ParkingSpot[] = [];
