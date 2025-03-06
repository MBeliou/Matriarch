<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';
	import ArrowLeft from 'lucide-svelte/icons/arrow-left';
</script>

<div class="flex h-full flex-col justify-center">
	<div class="p-8">
		<h1 class="break-before-all text-4xl font-semibold">
			We couldn't reach the chatroom {page.params.id}
		</h1>
		<p class="text-muted-foreground mt-1">{page.status} - {page.error?.message}</p>

		<Button class="mt-8" href="/chat">
			<ArrowLeft></ArrowLeft>
			Back to All chatroom</Button
		>
	</div>
</div>
