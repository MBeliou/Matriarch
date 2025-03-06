import { MATRIARCH_CLIENT } from '$lib/clients';
import type { z } from 'zod';
import type { PageLoad } from './$types';
import type { schemas } from '$lib/types/matriarch.zod';

export const load = (async ({ params }) => {
	// Make sure the agent is actually running
	try {
		await MATRIARCH_CLIENT.post('/agents/:agent_name/start', undefined, {
			params: {
				agent_name: params.name
			}
		});
	} catch (error) {
		// Agent is most likely already running
		console.error(error)
	}
	const agent = await MATRIARCH_CLIENT.get('/agents/:agent_name', {
		params: {
			agent_name: params.name
		}
	});

	let agentActions: z.infer<typeof schemas.AgentActionsResponse.shape.response> | null = null;
	try {
		const query = await MATRIARCH_CLIENT.get('/agents/:agent_name/actions', {
			params: {
				agent_name: params.name
			}
		});
		agentActions = query.response;
	} catch (error) {
		console.error(`Agent ${params.name} isn't running - ${error}`);
	}

	return { agent, actions: agentActions };
}) satisfies PageLoad;
