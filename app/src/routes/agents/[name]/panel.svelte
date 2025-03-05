<script lang="ts" module>
	import type { schemas } from '$lib/types/matriarch.zod';

	export type PanelProps = {
		agent: typeof schemas.AgentResponse.shape;
	};
</script>

<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';

	let { agent }: PanelProps = $props();
</script>

<div class="space-y-2 divide-y overflow-y-auto [&>*]:p-4">
	<div class="flex items-center">
		<Avatar.Root>
			<Avatar.Image src="/orinfumo.png" alt="{agent.name} avatar" />
			<Avatar.Fallback>{agent.name}</Avatar.Fallback>
		</Avatar.Root>
		<div class="ml-2">
			<h1 class="text-xl">
				{agent.name}
			</h1>
			<p class="text-sm text-muted-foreground">Agent #{agent.id}</p>
		</div>
	</div>

	<div>
		<h2>About {agent.name}</h2>
		<p class="mt-1">
			{agent.description || 'No description provided'}
		</p>
	</div>

	<div>
		<h2>Biography</h2>
		<p>
			{agent.bio || 'No biography provided'}
		</p>
	</div>

	<div>
		<h2>Integrations</h2>
		<div class="mt-4 space-y-4">
			<!-- @ts-expect-error zod and typescript are being a bit too overbearing here -->
			{#each [...agent.config] as config}
				<div class="border-b pb-4">
					<div class="text-lg font-medium capitalize">{config.name}</div>
					<ul class="mt-2 space-y-2">
						{#each Object.entries(config) as [entry, value]}
							<li class="text-sm">
								<div class="capitalize text-muted-foreground">
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
		@apply text-sm font-medium text-muted-foreground;
	}
</style>
