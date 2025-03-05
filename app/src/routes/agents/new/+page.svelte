<script lang="ts">
	import { MATRIARCH_CLIENT } from '$lib/clients';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import SuperDebug, { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { createAgentSchema, type CreateAgentSchema } from './schema';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { browser } from '$app/environment';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { onMount } from 'svelte';

	import Rotate from 'lucide-svelte/icons/rotate-cw';

	let { data }: { data: { form: SuperValidated<Infer<CreateAgentSchema>> } } = $props();

	const form = superForm(data.form, {
		validators: zodClient(createAgentSchema)
	});
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { generatePrivateKey } from 'viem/accounts';

	const { form: formData, enhance } = form;

	async function createAgent() {
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

	$effect(() => {
		$formData.traits = Object.values(selectedTraits);
	});

	onMount(() => {
		$formData.examples = ['', '', ''];
		$formData.example_accounts = ['', '', ''];

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

	let privateKey = $state<string>('');

	function createRandomPrivateKey() {
		privateKey = generatePrivateKey();
	}

	// TODO: need to create a private key
</script>

<div class="flex items-center justify-between border-b px-6 py-12">
	<div>
		<h1 class="text-5xl font-semibold">New Agent</h1>
		<p class="text-muted-foreground mt-1">Create a brand new agent with its own crypto wallet.</p>
	</div>
</div>
<div class="p-6">
	<form method="POST" use:enhance class="space-y-6">
		<h3 class="text-xl font-medium">About your agent</h3>

		<Form.Field {form} name="name">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Agent Name</Form.Label>
					<Input {...props} bind:value={$formData.name} />
				{/snippet}
			</Form.Control>
		</Form.Field>
		<Form.Field {form} name="bio">
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
			<h3 class="mt-12 border-b pb-2 text-xl font-medium">X (ex-Twitter)</h3>
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
		<div class="">
			<h3 class="mt-12 border-b pb-2 text-xl font-medium">Crypto</h3>
			<div class="mt-4">
				<Label>Private Key</Label>
				<div class="relative  rounded mt-1">
					<Input bind:value={privateKey}></Input>
					<button onclick="{() => createRandomPrivateKey()}" class="bg-muted rounded-r absolute right-0 top-1/2 -translate-y-1/2 px-3 h-full">
						<Rotate size="17"></Rotate>
					</button>
				</div>
			</div>
		</div>
	</form>

	{#if browser}
		<div class="mt-12">
			<SuperDebug data={$formData} />
		</div>
	{/if}
</div>
