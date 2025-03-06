<script lang="ts">
	import { navigating } from '$app/state';
	import type { Snippet } from 'svelte';
	import Spinner from 'lucide-svelte/icons/loader-circle';

	let { children }: { children: Snippet } = $props();
</script>

{#if navigating.to}
	<div class="flex h-full flex-col items-center justify-center">
		<Spinner class="animate-spin"></Spinner>
	</div>
{:else}
	{@render children?.()}
{/if}
