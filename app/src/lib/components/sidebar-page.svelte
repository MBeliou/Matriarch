<script lang="ts">
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { Snippet } from 'svelte';

	let { children, agents }: { children: Snippet } = $props();
</script>

<Sidebar.Provider style="--sidebar-width: 350px;">
	<AppSidebar {agents}/>
	<Sidebar.Inset>
		<header class="sticky z-50 top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
			<Sidebar.Trigger class="-ml-1" />
			<Separator orientation="vertical" class="mr-2 h-4" />
			<h1>Matriarch</h1>
		</header>

		<div class="flex flex-1 flex-col gap-4">
			<!-- 
				{#each Array.from({ length: 24 }) as _, index (index)}
				<div class="bg-muted/50 aspect-video h-12 w-full rounded-lg"></div>
				{/each}
				-->
			{@render children?.()}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
