import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";




const AgentResponse = z.object({ id: z.union([z.number(), z.null()]).optional(), name: z.string(), description: z.union([z.string(), z.null()]).optional(), bio: z.array(z.string()), traits: z.array(z.string()), examples: z.array(z.string()), example_accounts: z.array(z.string()), loop_delay: z.number().int(), use_time_based_weights: z.boolean(), time_based_multipliers: z.record(z.number()), config: z.array(z.object({}).partial().passthrough()), tasks: z.array(z.object({}).partial().passthrough()), created_at: z.union([z.string(), z.null()]).optional(), updated_at: z.union([z.string(), z.null()]).optional() }).passthrough();
const TimeBasedMultipliers = z.object({ tweet_night_multiplier: z.number().default(0.4), engagement_day_multiplier: z.number().default(1.5) }).partial().passthrough();
const TaskCreate = z.object({ name: z.string(), weight: z.number().optional().default(1) }).passthrough();
const AgentCreate = z.object({ name: z.string(), description: z.union([z.string(), z.null()]).optional(), bio: z.array(z.string()), traits: z.array(z.string()), examples: z.array(z.string()).optional().default([]), example_accounts: z.array(z.string()).optional().default([]), loop_delay: z.number().int().optional().default(900), use_time_based_weights: z.boolean().optional().default(false), time_based_multipliers: TimeBasedMultipliers.optional(), config: z.array(z.object({}).partial().passthrough()).optional().default([]), tasks: z.array(TaskCreate).optional().default([]) }).passthrough();
const ValidationError = z.object({ loc: z.array(z.union([z.string(), z.number()])), msg: z.string(), type: z.string() }).passthrough();
const HTTPValidationError = z.object({ detail: z.array(ValidationError) }).partial().passthrough();
const AgentUpdate = z.object({ name: z.union([z.string(), z.null()]), description: z.union([z.string(), z.null()]), bio: z.union([z.array(z.string()), z.null()]), traits: z.union([z.array(z.string()), z.null()]), examples: z.union([z.array(z.string()), z.null()]), example_accounts: z.union([z.array(z.string()), z.null()]), loop_delay: z.union([z.number(), z.null()]), use_time_based_weights: z.union([z.boolean(), z.null()]), time_based_multipliers: z.union([z.record(z.number()), z.null()]), config: z.union([z.array(z.object({}).partial().passthrough()), z.null()]), tasks: z.union([z.array(z.object({}).partial().passthrough()), z.null()]) }).partial().passthrough();
const StatusResponse = z.object({ status: z.string() }).passthrough();
const ActionRequest = z.object({ connection: z.string(), action: z.string(), params: z.array(z.unknown()).optional().default([]) }).passthrough();
const ActionResponse = z.object({ status: z.string(), response: z.unknown().optional() }).passthrough();
const RunningStatusResponse = z.object({ running: z.boolean() }).passthrough();

export const schemas = {
	AgentResponse,
	TimeBasedMultipliers,
	TaskCreate,
	AgentCreate,
	ValidationError,
	HTTPValidationError,
	AgentUpdate,
	StatusResponse,
	ActionRequest,
	ActionResponse,
	RunningStatusResponse,
};

const endpoints = makeApi([
	{
		method: "get",
		path: "/",
		alias: "root__get",
		description: `Get server status`,
		requestFormat: "json",
		response: z.unknown(),
	},
	{
		method: "get",
		path: "/agents/",
		alias: "get_agents_agents__get",
		description: `Get all agents`,
		requestFormat: "json",
		response: z.array(AgentResponse),
	},
	{
		method: "post",
		path: "/agents/",
		alias: "create_agent_agents__post",
		description: `Create a new agent`,
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: AgentCreate
			},
		],
		response: AgentResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/agents/:agent_name",
		alias: "get_agent_agents__agent_name__get",
		description: `Get agent by name`,
		requestFormat: "json",
		parameters: [
			{
				name: "agent_name",
				type: "Path",
				schema: z.string()
			},
		],
		response: AgentResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "put",
		path: "/agents/:agent_name",
		alias: "update_agent_agents__agent_name__put",
		description: `Update an existing agent`,
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: AgentUpdate
			},
			{
				name: "agent_name",
				type: "Path",
				schema: z.string()
			},
		],
		response: AgentResponse,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "delete",
		path: "/agents/:agent_name",
		alias: "delete_agent_agents__agent_name__delete",
		description: `Delete an agent`,
		requestFormat: "json",
		parameters: [
			{
				name: "agent_name",
				type: "Path",
				schema: z.string()
			},
		],
		response: z.void(),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/agents/:agent_name/action",
		alias: "request_action_agents__agent_name__action_post",
		description: `Request an action from an agent`,
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: ActionRequest
			},
			{
				name: "agent_name",
				type: "Path",
				schema: z.string()
			},
		],
		response: z.object({ status: z.string(), response: z.unknown().optional() }).passthrough(),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/agents/:agent_name/start",
		alias: "start_agent_agents__agent_name__start_post",
		description: `Start an agent`,
		requestFormat: "json",
		parameters: [
			{
				name: "agent_name",
				type: "Path",
				schema: z.string()
			},
		],
		response: z.object({ status: z.string() }).passthrough(),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/agents/:agent_name/status",
		alias: "get_agent_status_agents__agent_name__status_get",
		description: `Get agent running status`,
		requestFormat: "json",
		parameters: [
			{
				name: "agent_name",
				type: "Path",
				schema: z.string()
			},
		],
		response: z.object({ running: z.boolean() }).passthrough(),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "post",
		path: "/agents/:agent_name/stop",
		alias: "stop_agent_agents__agent_name__stop_post",
		description: `Stop a running agent`,
		requestFormat: "json",
		parameters: [
			{
				name: "agent_name",
				type: "Path",
				schema: z.string()
			},
		],
		response: z.object({ status: z.string() }).passthrough(),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
	{
		method: "get",
		path: "/health",
		alias: "health_check_health_get",
		description: `Health check endpoint`,
		requestFormat: "json",
		response: z.unknown(),
	},
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
    return new Zodios(baseUrl, endpoints, options);
}
