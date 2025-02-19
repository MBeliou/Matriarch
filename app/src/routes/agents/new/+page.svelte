<script lang="ts">
	import { MATRIARCH_CLIENT } from '$lib/clients';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { createAgentSchema, type CreateAgentSchema } from './schema';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';

	let { data }: { data: { form: SuperValidated<Infer<CreateAgentSchema>> } } = $props();

	const form = superForm(data.form, {
		validators: zodClient(createAgentSchema)
	});

	const { form: formData, enhance } = form;

	async function createAgent() {
		MATRIARCH_CLIENT.POST('/agents/', {
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
</script>

<form method="POST" use:enhance>
	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Agent Name</Form.Label>
				<Input {...props} bind:value={$formData.name} />
			{/snippet}
		</Form.Control>
	</Form.Field>
</form>
