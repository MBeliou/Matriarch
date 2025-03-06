<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { MATRIARCH_CLIENT } from '$lib/clients';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import Label from '$lib/components/ui/label/label.svelte';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Rotate from 'lucide-svelte/icons/rotate-cw';
	import { onMount } from 'svelte';
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { generatePrivateKey, privateKeyToAddress } from 'viem/accounts';
	import { BASE_CONFIG_ITEMS, makeDiscordConfig, makeGoatConfig } from './baseConfigItems';
	import { createAgentSchema, type CreateAgentSchema } from './schema';

	let { data }: { data: { form: SuperValidated<Infer<CreateAgentSchema>> } } = $props();
	const form = superForm(data.form, {
		validators: zodClient(createAgentSchema)
	});
	const { form: formData, enhance } = form;

	async function createAgent() {
		try {
			const result = await MATRIARCH_CLIENT.post('/agents/', {
				...$formData
			});

			goto(`/agents/${result.name}`);
		} catch (error) {
			console.error(error);
		}

		/*
		MATRIARCH_CLIENT.post('/agents/', {
			body: {
				name: '',
				bio: '',
				config: {},
				example_accounts: [],
				examples: [],
				loop_delay: undefined,
				tasks: [],
				time_based_multipliers: {
					engagement_day_multiplier: 1,
					tweet_night_multiplier: 1
				},
				traits: [],
				use_time_based_weights: false
			}
		});
		*/
	}

	const personalityTraits = [
		{
			id: 'extroversion',
			trait: 'Extroverted',
			opposite: 'Introverted',
			description: 'How the agent interacts with others'
		},
		{
			id: 'openness',
			trait: 'Open-minded',
			opposite: 'Conventional',
			description: 'How the agent approaches new ideas and experiences'
		},
		{
			id: 'assertiveness',
			trait: 'Assertive',
			opposite: 'Passive',
			description: 'How the agent expresses opinions and makes requests'
		},
		{
			id: 'empathy',
			trait: 'Empathetic',
			opposite: 'Indifferent',
			description: "How the agent responds to users' emotions and needs"
		},
		{
			id: 'analytical',
			trait: 'Analytical',
			opposite: 'Intuitive',
			description: 'How the agent processes information and makes decisions'
		}
	] as const;

	let selectedTraits = $state<Record<(typeof personalityTraits)[number]['id'], string>>({
		extroversion: 'Extroverted',
		openness: 'Open-minded',
		assertiveness: 'Assertive',
		empathy: 'Empathetic',
		analytical: 'Analytical'
	});

	let isMainnet = $state(true);

	const NETWORKS = $state([
		{
			name: 'sonic',
			enabled: true,
			rpc: {
				mainnet: 'https://rpc.soniclabs.com',
				testnet: 'https://rpc.blaze.soniclabs.com'
			}
		},
		{
			name: 'ethereum',
			enabled: true,
			rpc: {
				mainnet: 'https://ethereum-rpc.publicnode.com',
				testnet: ''
			}
		},
		{
			name: 'solana',
			enabled: false,
			disabled: true,
			rpc: {
				mainnet: 'https://api.mainnet-beta.solana.com',
				testnet: ''
			}
		}
	]);

	let privateKey = $state<string>('');
	// TODO: Goat requires porting from a version of Zerepy that actually features it
	let allowGoat = false;

	function createRandomPrivateKey() {
		privateKey = generatePrivateKey();
	}

	let discordServerID = $state<string>(null!);
	let coingeckoAPIKey = $state<string>(null!);

	// Derivations
	let networkForForm = $derived.by(() => {
		return NETWORKS.filter((n) => n.enabled)
			.map((n) => {
				if (n.name === 'sonic') {
					return {
						name: 'sonic',
						network: isMainnet ? 'mainnet' : 'testnet',
						private_key: privateKey
					};
				}
				if (n.name === 'ethereum') {
					return {
						name: 'ethereum',
						rpc: isMainnet ? n.rpc['mainnet'] : n.rpc['testnet'],
						private_key: privateKey
					};
				}

				return null;
			})
			.filter((c) => c !== null);
	});

	// Effects
	let evmAddress = $derived.by(() => {
		try {
			return privateKeyToAddress(privateKey as `0x${string}`);
		} catch (error) {
			return 'Invalid Private Key';
		}
	});

	$effect(() => {
		$formData.traits = Object.values(selectedTraits);
	});

	$effect(() => {
		const toInsert: Record<string, unknown>[] = [...networkForForm, ...BASE_CONFIG_ITEMS];
		if (discordServerID) {
			const discordConfig = makeDiscordConfig(discordServerID);
			toInsert.push(discordConfig);
		}
		if (allowGoat && coingeckoAPIKey) {
			const goatConfig = makeGoatConfig(coingeckoAPIKey);
			toInsert.push(goatConfig);
		}

		$formData.config = toInsert;
	});

	onMount(() => {
		$formData.examples = ['This is an example tweet.', 'This is another example tweet.', ''];
		$formData.example_accounts = ['0xzerebro', '', ''];

		$formData.tasks = [
			{ name: 'post-tweet', weight: 1 },
			{ name: 'reply-to-tweet', weight: 1 },
			{ name: 'like-tweet', weight: 1 }
		];

		$formData.time_based_multipliers = {
			tweet_night_multiplier: 0.4,
			engagement_day_multiplier: 1.5
		};
		$formData.use_time_based_weights = true;
		createRandomPrivateKey();
	});
</script>

<div class="flex items-center justify-between border-b px-6 py-12">
	<div>
		<h1 class="text-5xl font-semibold">New Agent</h1>
		<p class="text-muted-foreground mt-1">Create a brand new agent with its own crypto wallet.</p>
	</div>
</div>
<div class="p-6">
	<!-- method="POST"
	use:enhance -->
	<form
		class="space-y-12"
		onsubmit={(e) => {
			e.preventDefault();
			console.log('submitting');
			createAgent();
		}}
	>
		<div>
			<div class="border-b pb-2">
				<h3 class=" text-xl font-medium">About your agent</h3>
				<p class="text-muted-foreground mt-1 text-sm">
					Tell us about your agent and how it should interact
				</p>
			</div>
			<div class="mt-4">
				<Form.Field {form} name="name">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Agent Name</Form.Label>
							<Input {...props} autocomplete="off" bind:value={$formData.name} minlength={5} />
						{/snippet}
					</Form.Control>
				</Form.Field>
				<Form.Field {form} name="bio" class="mt-4">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Agent Biography</Form.Label>
							<Textarea
								{...props}
								placeholder="Tell us about your agent"
								class="resize-none"
								bind:value={$formData.bio[0]}
							/>
						{/snippet}
					</Form.Control>
				</Form.Field>
			</div>
		</div>

		<div>
			<h3 class="text-sm font-semibold">Personality Traits</h3>
			<div class="mt-4 space-y-6">
				<div class="grid grid-cols-2 gap-8">
					{#each personalityTraits as trait, i}
						<div>
							<div class="flex max-w-[300px] items-center [&>*]:w-1/3">
								<Label for={trait.id}>{trait.opposite}</Label>
								<div class="flex items-center justify-center">
									<Switch
										onCheckedChange={(checked) => {
											selectedTraits[trait.id] = checked ? trait.trait : trait.opposite;
										}}
										checked={selectedTraits[trait.id] === trait.trait}
										id={trait.id}
									/>
								</div>

								<Label for={trait.id}>{trait.trait}</Label>
							</div>
							<p class="text-muted-foreground mt-1 text-xs">{trait.description}</p>
						</div>
					{/each}
				</div>
			</div>
		</div>
		<div class="">
			<div class="mt-12 border-b pb-2">
				<h3 class=" text-xl font-medium">X (ex-Twitter)</h3>
				<p class="text-muted-foreground mt-1 text-sm">Everything related to X</p>
			</div>
			<div class="mt-4 grid grid-cols-2 gap-4">
				<div>
					<h4 class="text-sm font-medium">Example Tweets</h4>

					<ul class="mt-2 space-y-4">
						{#each $formData.examples as example, i}
							<Form.Field {form} name="examples">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label>Example {i + 1}</Form.Label>
										<Input {...props} bind:value={$formData.examples[i]}></Input>
									{/snippet}
								</Form.Control>
							</Form.Field>
						{/each}
					</ul>
				</div>
				<div>
					<h4 class="text-sm font-medium">Accounts to track</h4>
					<ul class="mt-2 space-y-4">
						{#each $formData.example_accounts as account, i}
							<Form.Field {form} name="example_accounts">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label>Account {i + 1}</Form.Label>
										<Input {...props} bind:value={$formData.example_accounts[i]}></Input>
									{/snippet}
								</Form.Control>
							</Form.Field>
						{/each}
					</ul>
				</div>
				<div>
					<h4 class="text-sm font-medium">Tasks</h4>
					<ul class="mt-2 space-y-4">
						{#each $formData.tasks as task, i}
							<Form.Field {form} name="tasks">
								<Form.Control>
									{#snippet children({ props })}
										<div class="flex items-center">
											<Checkbox {...props} checked={true} disabled></Checkbox>
											<Form.Label class="ml-2">{task.name}</Form.Label>
										</div>
									{/snippet}
								</Form.Control>
							</Form.Field>
						{/each}
					</ul>
				</div>
			</div>
		</div>
		<div class="space-y-8">
			<div class="border-b pb-2">
				<h3 class=" text-xl font-medium">Crypto</h3>
				<p class="text-muted-foreground mt-1 text-sm">
					Define blockchains your Agent will interact with
				</p>
			</div>
			<div class="">
				<Label>Private Key</Label>
				<div class="relative mt-1 rounded">
					<Input bind:value={privateKey}></Input>
					<button
						onclick={() => createRandomPrivateKey()}
						class="bg-muted absolute right-0 top-1/2 h-full -translate-y-1/2 rounded-r px-3"
					>
						<Rotate size="17"></Rotate>
					</button>
				</div>
				<p class="text-muted-foreground mt-1 text-xs">Agent Address: {evmAddress}</p>
			</div>
			<div class="">
				<div class="flex items-center justify-between">
					<h4>Networks</h4>

					<div class=" flex items-center space-x-2">
						<Label for="mainnet">Testnet</Label>
						<Switch id="mainnet" bind:checked={isMainnet}></Switch>
						<Label for="mainnet">Mainnet</Label>
					</div>
				</div>
				<p class="text-muted-foreground mt-1 text-sm">
					Select blockchain networks your agent can interact with
				</p>
				<div class=" mt-6 grid gap-4 lg:grid-cols-4">
					{#each NETWORKS as network, i}
						<div class="flex items-center space-x-2">
							<Label for="toggle-{network.name}" class="capitalize">{network.name}</Label>
							<Switch
								id="toggle-{network.name}"
								disabled={network.disabled}
								bind:checked={NETWORKS[i].enabled}
							></Switch>
						</div>
					{/each}
				</div>
			</div>
		</div>
		<div>
			<div class="border-b pb-2">
				<h3 class=" text-xl font-medium">Others</h3>
				<p class="text-muted-foreground mt-1 text-sm">Everything else your agent can do</p>
			</div>

			<div class="mt-8 grid gap-4 lg:grid-cols-2">
				<div>
					<Label for="discord-server" class="capitalize">Discord Server ID</Label>
					<Input id="discord-server" class="mt-1" bind:value={discordServerID}></Input>
				</div>
				<div>
					<Label for="coingecko-key" class="capitalize">CoinGecko API Key</Label>
					<Input id="coingecko-key" class="mt-1" bind:value={coingeckoAPIKey}></Input>
				</div>
				{#each BASE_CONFIG_ITEMS as configItem}
					<div>
						<Label for="config-{configItem.name}" class="capitalize">{configItem.name}</Label>
						<Textarea
							id="config-{configItem.name}"
							class="mt-1"
							disabled
							value={JSON.stringify(configItem)}
						></Textarea>
					</div>
				{/each}
			</div>
		</div>

		<Button type="submit">Create Agent</Button>
	</form>

	{#if browser}
		<div class="mt-12">
			<SuperDebug data={$formData} />
		</div>
	{/if}
</div>
