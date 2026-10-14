import servicesData from '../../data/services.json';

export const prerender = true;

export function GET() {
	return new Response(JSON.stringify(servicesData), {
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
}
