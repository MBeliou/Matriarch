import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";




const DiscordConfig = z.object({ name: z.string().optional().default("discord"), message_read_count: z.number().int(), message_emoji_name: z.string(), server_id: z.string() }).passthrough();
const TwitterConfig = z.object({ name: z.string(), timeline_read_count: z.number().int(), own_tweet_replies_count: z.number().int(), tweet_interval: z.number().int() }).passthrough();
const NetworkConfig = z.object({ name: z.string(), network: z.union([z.string(), z.null()]).optional(), rpc: z.union([z.string(), z.null()]).optional(), private_key: z.string() }).passthrough();
const TaskConfig = z.object({ name: z.string(), weight: z.number() }).passthrough();
const TimeBasedMultipliers = z.object({ tweet_night_multiplier: z.number(), engagement_day_multiplier: z.number() }).passthrough();
const AgentConfig = z.object({ name: z.string(), bio: z.union([z.array(z.string()), z.null()]).optional(), traits: z.union([z.array(z.string()), z.null()]).optional(), examples: z.union([z.array(z.string()), z.null()]).optional(), example_accounts: z.union([z.array(z.string()), z.null()]).optional(), loop_delay: z.union([z.number(), z.null()]).optional(), config: z.union([z.array(z.union([DiscordConfig, TwitterConfig, NetworkConfig])), z.null()]).optional(), tasks: z.union([z.array(TaskConfig), z.null()]).optional(), use_time_based_weights: z.union([z.boolean(), z.null()]).optional(), time_based_multipliers: z.union([TimeBasedMultipliers, z.null()]).optional() }).passthrough();
const ValidationError = z.object({ loc: z.array(z.union([z.string(), z.number()])), msg: z.string(), type: z.string() }).passthrough();
const HTTPValidationError = z.object({ detail: z.array(ValidationError) }).partial().passthrough();
const ActionRequest = z.object({ connection: z.string(), action: z.string(), params: z.union([z.array(z.string()), z.null()]).optional().default([]) }).passthrough();

export const schemas = {
	DiscordConfig,
	TwitterConfig,
	NetworkConfig,
	TaskConfig,
	TimeBasedMultipliers,
	AgentConfig,
	ValidationError,
	HTTPValidationError,
	ActionRequest,
};

const endpoints = makeApi([
	{
		method: "get",
		path: "/agents/",
		alias: "get_agents_agents__get",
		requestFormat: "json",
		response: z.unknown(),
	},
	{
		method: "post",
		path: "/agents/",
		alias: "create_agent_agents__post",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: AgentConfig
			},
		],
		response: z.unknown(),
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
		requestFormat: "json",
		parameters: [
			{
				name: "agent_name",
				type: "Path",
				schema: z.string()
			},
		],
		response: z.unknown(),
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
		response: z.unknown(),
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
		path: "/agents/:agent_name/configure",
		alias: "configure_agent_agents__agent_name__configure_post",
		requestFormat: "json",
		response: z.unknown(),
	},
	{
		method: "post",
		path: "/agents/:agent_name/start",
		alias: "start_agent_agents__agent_name__start_post",
		requestFormat: "json",
		parameters: [
			{
				name: "agent_name",
				type: "Path",
				schema: z.string()
			},
		],
		response: z.unknown(),
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
		requestFormat: "json",
		parameters: [
			{
				name: "agent_name",
				type: "Path",
				schema: z.string()
			},
		],
		response: z.unknown(),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			},
		]
	},
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
    return new Zodios(baseUrl, endpoints, options);
}
