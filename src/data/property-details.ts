export interface PropertyPhoto {
	image: string;
	alt: string;
}

export interface PropertyAmenity {
	icon: string;
	name: string;
	detail: string;
}

export interface PropertyHighlight {
	title: string;
	detail: string;
	score: string;
}

export interface PropertyDetails {
	propertyType: string;
	guestCapacity?: number;
	bedrooms?: number;
	bathrooms?: number;
	descriptionTitle: string;
	description: string;
	descriptionExtra: string;
	photos: PropertyPhoto[];
	amenities: PropertyAmenity[];
	highlights: PropertyHighlight[];
	host: { name: string; initials: string; role: string; description: string };
	location: { area: string; city: string; country: string; image: string; description: string; addressNote: string };
}

export interface PropertyListing {
	slug: string;
	city: string;
	area: string;
	name: string;
	cardName: string;
	cardImage: string;
	pricePerNight: number;
	originalPricePerNight: number;
	defaultNights: number;
	defaultGuests: number;
	maxGuests: number;
	rating: string;
	reviewCount: number;
	path?: string;
	details?: PropertyDetails;
}

export const properties: PropertyListing[] = [
	{
		slug: 'mohammadapura-room', city: 'Dhaka', area: 'Mohammadapura Thana', name: 'Room in Mohammadapura Thana', cardName: 'Room in Mohammadapura Thana', cardImage: 'photo-1582719478250-c89cae4dc85b',
		pricePerNight: 13.25, originalPricePerNight: 13.25, defaultNights: 4, defaultGuests: 1, maxGuests: 2, rating: '4.89', reviewCount: 18,
	},
	{
		slug: 'gulshan-room', city: 'Dhaka', area: 'Gulshan Thana', name: 'Room in Gulshan Thana', cardName: 'Room in Gulshan Thana', cardImage: 'photo-1618773928121-c32242e63f39',
		pricePerNight: 15.5, originalPricePerNight: 15.5, defaultNights: 4, defaultGuests: 1, maxGuests: 2, rating: '4.79', reviewCount: 14,
	},
	{
		slug: 'citylights', city: 'Dhaka', area: 'Bashundhara', name: 'Citylights · Bashundhara Park Lane Luxe Collection', cardName: 'Citylights · Bashundhara', cardImage: 'photo-1600607687939-ce8a6c25118c',
		pricePerNight: 43.75, originalPricePerNight: 55, defaultNights: 4, defaultGuests: 1, maxGuests: 6, rating: '4.86', reviewCount: 28, path: '/guestHouses/dhaka/citylights/',
		details: {
			propertyType: 'Entire rental unit', guestCapacity: 6, bedrooms: 3, bathrooms: 3,
			descriptionTitle: 'Room for the whole trip.',
			description: 'Settle into a spacious city apartment in Bashundhara. Three private bedrooms, generous shared living space and a calm place to land between days out in Dhaka.',
			descriptionExtra: 'Make breakfast together, take a quiet moment on the balcony, or return to a comfortable home base after exploring the neighborhood. The apartment is arranged for easy group stays, with space to spend time together and room to retreat.',
			photos: [
				{ image: 'photo-1600607687939-ce8a6c25118c', alt: 'Sunlit open-plan living room with contemporary furnishings' },
				{ image: 'photo-1600210492486-724fe5c67fb0', alt: 'Warm, spacious living area' },
				{ image: 'photo-1600607687920-4e2a09cf159d', alt: 'Modern dining space' },
				{ image: 'photo-1600566753086-00f18fb6b3ea', alt: 'Comfortable bedroom with soft natural light' },
				{ image: 'photo-1616486338812-3dadae4b4ace', alt: 'Quiet bedroom with modern details' },
			],
			amenities: [
				{ icon: '⌁', name: 'Fast Wi-Fi', detail: 'Reliable connection throughout the apartment' },
				{ icon: '◌', name: 'Air conditioning', detail: 'Cooling in the living room and bedrooms' },
				{ icon: '⌂', name: 'Full kitchen', detail: 'Cookware, dishes and everyday essentials' },
				{ icon: '▤', name: 'Dedicated workspace', detail: 'A comfortable spot to focus' },
				{ icon: '▧', name: 'Washer', detail: 'In-unit laundry for longer stays' },
				{ icon: '⌖', name: 'Free parking', detail: 'One space in the building' },
				{ icon: '♨', name: 'Hot water', detail: 'Available in all three bathrooms' },
				{ icon: '▱', name: 'Elevator', detail: 'Step-free access to the apartment floor' },
				{ icon: '◷', name: 'Self check-in', detail: 'Flexible arrival with a secure entry code' },
				{ icon: '♧', name: 'Balcony', detail: 'City views over Bashundhara' },
				{ icon: '▣', name: 'Smart TV', detail: 'Streaming-ready in the lounge' },
				{ icon: '✳', name: 'Essentials', detail: 'Fresh linens, towels and toiletries' },
			],
			highlights: [
				{ title: 'Guest favorite', detail: 'One of the most loved homes in the area', score: '4.86' },
				{ title: 'Comfortable stay', detail: 'Room for groups to settle in', score: '4.9' },
				{ title: 'Easy arrival', detail: 'Straightforward check-in experience', score: '4.8' },
			],
			host: { name: 'the Citylights team', initials: 'CL', role: 'Local host', description: 'Host details and arrival instructions are shared with confirmed guests.' },
			location: { area: 'Bashundhara', city: 'Dhaka', country: 'Bangladesh', image: '/assets/area/Dhaka.jpg', description: 'A residential pocket with cafes, shops and everyday conveniences close by. Plan a city day, then come back to the quieter side of Dhaka.', addressNote: 'Exact address shared after booking' },
		},
	},
	{
		slug: 'dhaka-room', city: 'Dhaka', area: 'Dhaka', name: 'Room in Dhaka', cardName: 'Room in Dhaka', cardImage: 'photo-1512917774080-9991f1c4c750',
		pricePerNight: 17, originalPricePerNight: 17, defaultNights: 4, defaultGuests: 1, maxGuests: 2, rating: '5.0', reviewCount: 9,
	},
	{
		slug: 'dhaka-condo', city: 'Dhaka', area: 'Dhaka', name: 'Condo in Dhaka', cardName: 'Condo in Dhaka', cardImage: 'photo-1566073771259-6a8506099945',
		pricePerNight: 23.25, originalPricePerNight: 23.25, defaultNights: 4, defaultGuests: 1, maxGuests: 4, rating: '4.93', reviewCount: 21,
	},
	{
		slug: 'mirpur-room', city: 'Dhaka', area: 'মিরপুর থানা', name: 'Room in মিরপুর থানা', cardName: 'Room in মিরপুর থানা', cardImage: 'photo-1520250497591-112f2f40a3f4',
		pricePerNight: 15.5, originalPricePerNight: 15.5, defaultNights: 4, defaultGuests: 1, maxGuests: 2, rating: '4.9', reviewCount: 11,
	},
];

export function getPropertyBySlug(slug: string): PropertyListing | undefined {
	return properties.find((property) => property.slug === slug);
}

export function getPropertyPath(property: PropertyListing): string {
	return property.path ?? `/guestHouses/${property.city.toLowerCase().replace(/\s+/g, '-')}/${property.slug}/`;
}

export function getPropertyDetails(property: PropertyListing): PropertyDetails {
	if (property.details) return property.details;
	const propertyType = property.name.startsWith('Room in')
		? 'Private room'
		: property.name.startsWith('Apartment in') ? 'Apartment' : property.name.startsWith('Condo in') ? 'Condo' : 'Guesthouse';

	return {
		propertyType,
		descriptionTitle: `A stay in ${property.area}`,
		description: `Detailed information for this ${propertyType.toLowerCase()} in ${property.area} has not been added yet. Contact the host to confirm the details for your stay.`,
		descriptionExtra: 'Ask the host to confirm sleeping arrangements, amenities, and arrival information before you travel.',
		photos: [{ image: property.cardImage, alt: property.cardName }],
		amenities: [],
		highlights: [{ title: 'Guest rating', detail: `Based on ${property.reviewCount} guest reviews`, score: property.rating }],
		host: { name: 'Local host', initials: 'GH', role: 'Host', description: 'Host and arrival details have not been added for this listing yet.' },
		location: {
			area: property.area,
			city: property.city,
			country: 'Bangladesh',
			image: `https://images.unsplash.com/${property.cardImage}?auto=format&fit=crop&w=1200&q=85`,
			description: `Neighborhood details for ${property.area} have not been added yet.`,
			addressNote: 'Confirm the exact address with the host.',
		},
	};
}
