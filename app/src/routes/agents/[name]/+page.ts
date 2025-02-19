import { MATRIARCH_CLIENT } from '$lib/clients';
import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
	const agent = await MATRIARCH_CLIENT.GET('/agents/{agent_name}', {
		params: {
			path: {
				agent_name: params.name
			}
		}
	});
	return { agent };
}) satisfies PageLoad;
