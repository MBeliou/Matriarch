import { MATRIARCH_CLIENT } from '$lib/clients';
import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
	const agent = await MATRIARCH_CLIENT.get('/agents/:agent_name', {
		params: {
			agent_name: params.name
		}
	});
	return { agent };
}) satisfies PageLoad;
