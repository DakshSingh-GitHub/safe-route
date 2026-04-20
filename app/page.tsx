"use client";

import dynamic from 'next/dynamic';
import { ThemeToggle } from '@/components/ThemeToggle';
import React from "react";

// This is the magic part: it disables Server-Side Rendering for the Map
const SafeMap = dynamic(() => import('@/components/Map'), {
	ssr: false,
	loading: () => (
		<div className="h-screen w-full flex items-center justify-center bg-gray-100 dark:bg-slate-900 transition-colors">
			<p className="text-lg animate-pulse text-slate-800 dark:text-slate-100">Loading SafeRoute Map... 🛰️</p>
		</div>
	),
});

export default function Home() {
	const [isSatellite, setIsSatellite] = React.useState(false);

	return (
		<main className="flex min-h-screen flex-col bg-white dark:bg-slate-950 transition-colors">
			<nav className="p-4 bg-white dark:bg-slate-900 shadow-md z-10 flex items-center justify-between border-b border-gray-100 dark:border-slate-800 transition-colors">
				<h1 className="text-xl font-bold text-slate-800 dark:text-white">SafeRoute</h1>
				<div className="flex items-center gap-2">
					<button
						onClick={() => setIsSatellite(!isSatellite)}
						className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
							isSatellite 
								? "bg-blue-600 text-white" 
								: "bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700"
						}`}
						title={isSatellite ? "Switch to Map View" : "Switch to Satellite View"}
					>
						<span className="hidden sm:inline">{isSatellite ? "Map" : "Satellite"}</span>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 10s3-3 3-8"/><path d="M22 10s-3-3-3-8"/><path d="M5 2c0 5.5 4.5 10 10 10s10-4.5 10-10"/><path d="m2 10 8.8 8.8"/><path d="M10 2a10 10 0 0 1-10 10"/><path d="m13.2 18.8 8.8-8.8"/><path d="M14 2a10 10 0 0 0 10 10"/><circle cx="12" cy="12" r="2"/></svg>
					</button>
					<ThemeToggle />
				</div>
			</nav>
			<div className="grow">
				<SafeMap isSatellite={isSatellite} />
			</div>
		</main>
	);
}
