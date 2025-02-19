import {  schemas } from '$lib/types/matriarch.zod';
//export const createAgentSchema = pathsSchema.shape['/agents/'].shape.post.shape.requestBody.shape.content;
export const createAgentSchema = schemas.AgentConfig;
export type CreateAgentSchema = typeof createAgentSchema;
