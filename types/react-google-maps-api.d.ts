declare module "@react-google-maps/api" {
  import * as React from "react";

  export interface GoogleMapProps extends React.PropsWithChildren<any> {
    mapContainerStyle: React.CSSProperties;
    center: google.maps.LatLngLiteral;
    zoom: number;
  }
  export const GoogleMap: React.FC<GoogleMapProps>;

  export interface MarkerProps {
    position: google.maps.LatLngLiteral;
    label?: string;
    onClick?: (e: google.maps.MapMouseEvent) => void;
  }
  export const Marker: React.FC<MarkerProps>;

  export interface PolylineProps {
    path: google.maps.LatLngLiteral[];
    options?: google.maps.PolylineOptions;
  }
  export const Polyline: React.FC<PolylineProps>;

  export function useJsApiLoader(config: {
    googleMapsApiKey: string;
  }): { isLoaded: boolean; loadError?: Error };
}
