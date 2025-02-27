import { PUBLIC_MATRIARCH_API_URL } from '$env/static/public';
import { createApiClient } from '$lib/types/matriarch.zod';

//export const MATRIARCH_CLIENT = createClient<paths>({ baseUrl: PUBLIC_MATRIARCH_API_URL });
export const MATRIARCH_CLIENT = createApiClient(PUBLIC_MATRIARCH_API_URL);
