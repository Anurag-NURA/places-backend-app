export interface PlaceParams {
  placeId: string;
}

export interface PlacesByUserIdParams {
  userId: string;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface CreatePlaceBody {
  name: string;
  description: string;
  location: Location;
  creator: string;
}
