import type { RequestHandler } from './$types';
import { MATRIARCH_CLIENT } from '$lib/clients';


export const GET: RequestHandler = async ({ params, url }) => {
	const { response: connections } = await MATRIARCH_CLIENT.get('/agents/:agent_name/actions', {
		params: {
			agent_name: params.name
		}
	});

	const content = `
    <SYSTEM>
        These are the available actions and connections for the ${params.name} agent.
        Calls are expected to follow this query schema: "connection action parameters".
        Parameters are optional and should be given as a list of strings.

        This agent can also be queried through POST request at ${url.host}/agents/${params.name}/action.
        The request body should stick to the following format:
        {
            "connection": string,
            "action": string,
            "params": string[]
        }
    </SYSTEM>

    ${JSON.stringify(connections, null, 2)}
    `;
	return new Response(content);
};
