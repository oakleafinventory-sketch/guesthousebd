import homeContent from '../../data/home.json';

export const prerender = true;

export function GET() {
	return new Response(JSON.stringify(homeContent), {
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
	});
}
