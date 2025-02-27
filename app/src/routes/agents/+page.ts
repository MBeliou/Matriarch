import { MATRIARCH_CLIENT } from '$lib/clients';
import type { PageLoad } from './$types';

export const load = (async () => {
	const agents = await MATRIARCH_CLIENT.get("/agents/");

	return {
		agents
	};
}) satisfies PageLoad;
