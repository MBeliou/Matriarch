<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Check from 'lucide-svelte/icons/check';
	import Plus from 'lucide-svelte/icons/plus';

	let { data } = $props();
</script>

<div class="flex items-center justify-between border-b px-6 py-12">
	<div>
		<h1 class="text-5xl font-semibold">Agents</h1>
		<p class="text-muted-foreground mt-1">All currently available agents</p>
	</div>
	<div>
		<Button href="/agents/new">
			<span>Create Agent</span>
            <Plus></Plus>
		</Button>
	</div>
</div>
<ul class="grid gap-4 p-6 lg:grid-cols-3">
	{#each data.agents as agent}
		{@const configs = agent.config.map((c) => c.name)}
		<li class=" rounded border">
			<h2 class="border-b p-2 text-lg font-medium">
				{agent.name}
			</h2>

			<div class="p-2">
				<div class=" text-muted-foreground text-sm">Connections</div>
				<div class="mt-2 grid h-[200px] grid-cols-2 gap-2 overflow-y-auto">
					{#each configs as config}
						<div class="flex items-center space-x-2 capitalize">
							<div class="bg-muted text-muted-foreground rounded-full border p-1">
								<Check size={16}></Check>
							</div>
							<span>
								{config}
							</span>
						</div>
					{/each}
				</div>
			</div>

			<Button class="w-full">Interact with {agent.name}</Button>
		</li>
	{/each}
</ul>
