import propertyData from './properties.json';

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

export const properties: PropertyListing[] = propertyData;

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
