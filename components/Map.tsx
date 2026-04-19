/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useEffect, useState, useRef } from "react";
import Map, { NavigationControl, Marker, MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

export default function SafeMap() {
    const mapRef = useRef<MapRef>(null);
    

    const [viewState, setViewState] = useState({
        longitude: 77.2090,
        latitude: 28.6139,
        zoom: 12
    });
    const [userLocation, setUserLocation] = useState<{ lng: number, lat: number } | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { longitude, latitude } = position.coords;
                    setUserLocation({ lng: longitude, lat: latitude });
                    setIsLoading(false);
                },
                (error) => {
                    console.error("Location error:", error);
                    setUserLocation({ lng: 77.2090, lat: 28.6139 }); // Fallback
                    setIsLoading(false);
                },
                {
                    enableHighAccuracy: false, // Switching to false is faster/more reliable
                    timeout: 5000,             // 5 second limit ⏱️
                    maximumAge: 0
                }
            );
        } else {
            // No GPS support at all
            setTimeout(() => {
                setUserLocation({ lng: 77.2090, lat: 28.6139 });
                setIsLoading(false);
            }, 0);
        }
    }, []);

    if (isLoading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-100 text-black">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2mb-4"></div>
                <br />
                <p className="text-lg font-medium animate-pulse">Please Wait</p>
            </div>
        );
    }

    return (
        <div className="h-screen w-full">
            <Map
                initialViewState={{
                    longitude: userLocation!.lng,
                    latitude: userLocation!.lat,
                    zoom: 14
                }}
                mapStyle="https://tiles.basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
            >
                <NavigationControl position="top-right" />

                {userLocation && (
                    <Marker longitude={userLocation.lng} latitude={userLocation.lat}>
                        <div className="relative flex h-5 w-5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-5 w-5 bg-blue-600 border-2 border-white shadow-lg"></span>
                        </div>
                    </Marker>
                )}
            </Map>
        </div>
    );
}
