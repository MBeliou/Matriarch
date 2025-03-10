import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const content = `
    User-agent: *
    Disallow:
    `;
	return new Response(content);
};
