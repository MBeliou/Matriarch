import { schemas } from '$lib/types/matriarch.zod';
//export const createAgentSchema = pathsSchema.shape['/agents/'].shape.post.shape.requestBody.shape.content;
export const createAgentSchema = schemas.AgentCreate;
export type CreateAgentSchema = typeof createAgentSchema;
