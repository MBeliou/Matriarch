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

	let { data }: { data: { form: SuperValidated<Infer<CreateAgentSchema>> } } = $props();

	const form = superForm(data.form, {
		validators: zodClient(createAgentSchema)
	});

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
			description: 'How the agent interacts with others and draws energy'
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
</script>

<div class="flex items-center justify-between border-b px-6 py-12">
	<div>
		<h1 class="text-5xl font-semibold">New Agent</h1>
		<p class="text-muted-foreground mt-1">Create a brand new agent</p>
	</div>
</div>
<div class="p-6">
	<form method="POST" use:enhance class="space-y-6">
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
			<div class="mt-4 space-y-2">
				{#each personalityTraits as trait, i}
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
				{/each}
			</div>
		</div>
	</form>

	{#if browser}
		<div class="mt-12">
			<SuperDebug data={$formData} />
		</div>
	{/if}
</div>
