import { MATRIARCH_CLIENT } from '$lib/clients';
import type { LayoutLoad } from './$types';

export const load = (async () => {
	const agents = await MATRIARCH_CLIENT.get("/agents/");
	return {
		agents
	};
}) satisfies LayoutLoad;
