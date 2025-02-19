import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createAgentSchema } from './schema';

export const load = (async () => {
	return {
		form: await superValidate(zod(createAgentSchema))
	};
}) satisfies PageServerLoad;
