export interface Coordinate {
    latitude: number;
    longitude: number;
}

export interface FarmElement {
    area: number;
    coordinates: Array<Coordinate>;
    kaek: string;
}
