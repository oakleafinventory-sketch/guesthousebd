import propertyData from '../../data/properties.json';

export const prerender = true;

export function GET() {
	return new Response(JSON.stringify(propertyData), {
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
	});
}
