/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useEffect, useState, useRef, useMemo } from "react";
import Map, { NavigationControl, Marker, MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTheme } from "next-themes";

interface SafeMapProps {
    isSatellite?: boolean;
}

export default function SafeMap({ isSatellite = false }: SafeMapProps) {
    const mapRef = useRef<MapRef>(null);
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    
    const [userLocation, setUserLocation] = useState<{ lng: number, lat: number } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // High-Clarity Google Satellite Hybrid
    const satelliteStyle = useMemo(() => ({
        version: 8,
        sources: {
            "google-hybrid": {
                "type": "raster",
                "tiles": ["https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"],
                "tileSize": 256,
                "attribution": "&copy; Google Maps"
            }
        },
        layers: [{ "id": "google-hybrid", "type": "raster", "source": "google-hybrid" }]
    }), []);

    const lightStyle = useMemo(() => ({
        version: 8,
        sources: {
            "carto-light": {
                "type": "raster",
                "tiles": ["https://a.basemaps.cartocdn.com/rastertiles/voyager_all/{z}/{x}/{y}.png"],
                "tileSize": 256,
                "attribution": "&copy; CARTO"
            }
        },
        layers: [{ "id": "carto-light", "type": "raster", "source": "carto-light" }]
    }), []);

    const darkStyle = useMemo(() => ({
        version: 8,
        sources: {
            "carto-dark": {
                "type": "raster",
                "tiles": ["https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"],
                "tileSize": 256,
                "attribution": "&copy; CARTO"
            }
        },
        layers: [{ "id": "carto-dark", "type": "raster", "source": "carto-dark" }]
    }), []);

    useEffect(() => {
        setMounted(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({ lng: position.coords.longitude, lat: position.coords.latitude });
                    setIsLoading(false);
                },
                () => {
                    setUserLocation({ lng: 77.2090, lat: 28.6139 });
                    setIsLoading(false);
                },
                { timeout: 5000 }
            );
        } else {
            setUserLocation({ lng: 77.2090, lat: 28.6139 });
            setIsLoading(false);
        }
    }, []);

    if (!mounted || isLoading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-100 dark:bg-slate-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                <p className="dark:text-white">Initializing Map...</p>
            </div>
        );
    }

    const currentMapStyle = isSatellite ? satelliteStyle : (resolvedTheme === "dark" ? darkStyle : lightStyle);
    // Key forces a fresh map instance when switching major styles to prevent tile stacking/AJAX errors
    const mapKey = `map-${isSatellite ? 'sat' : resolvedTheme}`;

    return (
        <div className="h-screen w-full relative">
            <Map
                key={mapKey}
                ref={mapRef}
                initialViewState={{
                    longitude: userLocation!.lng,
                    latitude: userLocation!.lat,
                    zoom: 14,
                    pitch: isSatellite ? 45 : 0
                }}
                mapStyle={currentMapStyle as any}
                // Suppress background AJAX errors that don't affect functionality
                onError={(e) => {
                    if (e.error?.message?.includes('Failed to fetch')) return;
                    console.debug('Map Error:', e.error);
                }}
            >
                <NavigationControl position="top-right" />
                {userLocation && (
                    <Marker longitude={userLocation.lng} latitude={userLocation.lat}>
                        <div className="relative flex h-5 w-5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-5 w-5 bg-blue-600 border-2 border-white dark:border-slate-800 shadow-lg"></span>
                        </div>
                    </Marker>
                )}
            </Map>
        </div>
    );
}
