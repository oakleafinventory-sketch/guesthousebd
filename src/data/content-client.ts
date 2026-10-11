export interface HomeContent {
	media: {
		insideStay: { video: string; videoPoster: string; frameImage: string };
		accountJoinImage: string;
		closing: { video: string; videoPoster: string };
	};
	searchDestinations: { value: string; label?: string; labelKey?: string }[];
	areaDestinations: [string, string, string, string, string?][];
	stays: [string, string, number, string][];
	serviceFeatures: [string, string, string][];
	vehicles: {
		id: string;
		brand: string;
		model: string;
		image: string;
		seats: number;
		bags: number;
		rate: number;
		idealKey: string;
	}[];
	people: {
		a: { name: string; gender: string; age: number; rating: number; price: number; image: string }[];
		g: { name: string; gender: string; age: number; rating: number; price: number; image: string }[];
	};
	paymentMethods: [string, string, string][];
	socialProviders: [string, string][];
}

export async function loadHomeContent(): Promise<HomeContent> {
	const response = await fetch('/data/home.json');
	if (!response.ok) {
		throw new Error(`Failed to load homepage data: ${response.status} ${response.statusText}`);
	}

	return response.json() as Promise<HomeContent>;
}
