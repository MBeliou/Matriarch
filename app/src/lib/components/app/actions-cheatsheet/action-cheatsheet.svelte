<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import ListIcon from 'lucide-svelte/icons/clipboard-list';
	import type { z } from 'zod';
	import type { schemas } from '$lib/types/matriarch.zod';

	let {
		actions: availableActions
	}: { actions: z.infer<typeof schemas.AgentActionsResponse.shape.response> } = $props();
</script>

<Sheet.Root>
	<Sheet.Trigger class={buttonVariants({ variant: 'outline', size: 'icon' })}>
		<ListIcon></ListIcon>
	</Sheet.Trigger>
	<Sheet.Content>
		<Sheet.Header class="border-b pb-2">
			<Sheet.Title>Action Cheatsheet</Sheet.Title>
			<Sheet.Description>These are all the actions available for this agent.</Sheet.Description>
		</Sheet.Header>
		<div class="relative max-h-[100svh] overflow-y-auto pb-12">
			<ul class="space-y-2">
				{#each Object.entries(availableActions) as [connection, actions]}
					<li>
						<div
							class="sticky top-0 flex items-baseline justify-between border-b bg-background py-2"
						>
							<h2 class="text-xl capitalize">
								{connection}
							</h2>
							<div class="text-muted-foreground">
								{connection}
							</div>
						</div>
						<ul class="mt-2">
							{#each Object.entries(actions) as [action, content]}
								<li>
									<div>
										<div class="text-lg">
											{action}
										</div>
										<div class="text-sm text-muted-foreground">
											{content.description}
										</div>
									</div>
									<div>
										<pre class="text-wrap text-white">
                                            {JSON.stringify(content.parameters, null, 2)}

                                        </pre>
									</div>
								</li>
							{/each}
						</ul>
					</li>
				{/each}
			</ul>
		</div>
	</Sheet.Content>
</Sheet.Root>
