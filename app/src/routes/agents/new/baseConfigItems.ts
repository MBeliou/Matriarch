export const BASE_CONFIG_ITEMS = [
	{
		name: 'twitter',
		timeline_read_count: 10,
		own_tweet_replies_count: 2,
		tweet_interval: 5400
	},
	{
		name: 'farcaster',
		timeline_read_count: 10,
		cast_interval: 60
	},
	{
		name: 'openai',
		model: 'gpt-3.5-turbo'
	},
	{
		name: 'anthropic',
		model: 'claude-3-5-sonnet-20241022'
	},
	{
		name: 'xai',
		model: 'grok-2-latest'
	},
	{
		name: 'together',
		model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo'
	},
	{
		name: 'eternalai',
		model: 'NousResearch/Hermes-3-Llama-3.1-70B-FP8',
		chain_id: '45762'
	},
	{
		name: 'ollama',
		base_url: 'http://localhost:11434',
		model: 'llama3.2'
	},
	{
		name: 'groq',
		model: 'llama-3.3-70b-versatile',
		temperature: 0.5
	},
	{
		name: 'hyperbolic',
		model: 'meta-llama/Meta-Llama-3-70B-Instruct'
	},
	{
		name: 'galadriel',
		model: 'gpt-3.5-turbo'
	},
	{
		name: 'allora',
		chain_slug: 'testnet'
	}
];

export function makeDiscordConfig(serverID: string) {
	return {
		name: 'discord',
		message_read_count: 10,
		message_emoji_name: '❤️',
		server_id: serverID
	};
}

export function makeGoatConfig(coingeckoKey: string) {
	return {
		name: 'goat',
		plugins: [
			...(coingeckoKey
				? [
						{
							name: 'coingecko',
							args: {
								api_key: 'YOUR_API_KEY'
							}
						}
					]
				: []),
			{
				name: 'erc20',
				args: {
					tokens: ['goat_plugins.erc20.token.PEPE', 'goat_plugins.erc20.token.USDC']
				}
			}
		]
	};
}
