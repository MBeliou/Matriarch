<script lang="ts" module>
	import type { schemas } from '$lib/types/matriarch.zod';
	import type { z } from 'zod';
	export type PanelProps = {
		agent: z.infer<typeof schemas.AgentResponse>;
		docs?: Snippet;
	};
</script>

<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	
	import type { Snippet } from 'svelte';

	let { agent, docs }: PanelProps = $props();
</script>

<div class="space-y-2 divide-y overflow-y-auto [&>*]:p-4">
	<div class="flex justify-between">
		<div class="flex items-center">
			<Avatar.Root>
				<Avatar.Image src="/orinfumo.png" alt="{agent.name} avatar" />
				<Avatar.Fallback>{agent.name}</Avatar.Fallback>
			</Avatar.Root>
			<div class="ml-2">
				<h1 class="text-xl">
					{agent.name}
				</h1>
				<p class="text-muted-foreground text-sm">Agent #{agent.id}</p>
			</div>
		</div>

		{@render docs?.()}
	</div>

	<div>
		<h2>About {agent.name}</h2>
		<p class="mt-1">
			{agent.description || 'No description provided'}
		</p>
	</div>

	<div>
		<h2>Traits</h2>
		<ul class="mt-1 grid grid-cols-2 gap-2">
			{#each agent.traits as trait}
				<li>{trait}</li>
			{/each}
		</ul>
	</div>

	<div>
		<h2>Biography</h2>
		<p>
			{agent.bio || 'No biography provided'}
		</p>
	</div>

	<div>
		<h2>Integrations</h2>
		<div class="mt-4 space-y-4 pb-24">
			<!-- @ts-expect-error zod and typescript are being a bit too overbearing here -->
			{#each [...agent.config] as config}
				<div class="border-b pb-4">
					<div class="text-lg font-medium capitalize">{config.name}</div>
					<ul class="mt-2 space-y-2">
						{#each Object.entries(config) as [entry, value]}
							<li class="text-sm">
								<div class="text-muted-foreground capitalize">
									{entry}
								</div>

								<div class="overflow-hidden text-ellipsis text-right">
									<div class="">
										{#if Array.isArray(value)}
											{#each value as subValue}
												<div>
													{JSON.stringify(subValue)}
												</div>
											{/each}
										{:else}
											{value || 'No value provided'}
										{/if}
									</div>
								</div>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- {JSON.stringify(agent, null, 2)} -->

<style lang="postcss">
	h2 {
		@apply text-muted-foreground text-sm font-medium;
	}
</style>
