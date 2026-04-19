"use client";

import dynamic from 'next/dynamic';

// This is the magic part: it disables Server-Side Rendering for the Map
const SafeMap = dynamic(() => import('@/components/Map'), {
	ssr: false,
	loading: () => (
		<div className="h-screen w-full flex items-center justify-center bg-gray-100">
			<p className="text-lg animate-pulse">Loading SafeRoute Map... 🛰️</p>
		</div>
	),
});

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col">
			<nav className="p-4 bg-white shadow-md z-10">
				<h1 className="text-xl font-bold text-slate-800">SafeRoute</h1>
			</nav>
			<div className="grow">
				<SafeMap />
			</div>
		</main>
	);
}
