<script lang="ts">
	import BotIcon from 'lucide-svelte/icons/bot';
    import UserIcon from "lucide-svelte/icons/user";

	let { role, content }: { role: 'assistant' | 'user'; content: string } = $props();
</script>

<div
	class={`flex w-full flex-row gap-4 px-4 first-of-type:pt-20 md:w-[500px] md:px-0`}
	initial={{ y: 5, opacity: 0 }}
	animate={{ y: 0, opacity: 1 }}
>
	<div class="flex size-[24px] flex-shrink-0 flex-col items-center justify-center text-zinc-400">
		{#if role === 'assistant'}
			<BotIcon />
		{:else}
			<UserIcon />
		{/if}
	</div>

	<div class="flex w-full flex-col gap-1">
		<div class="flex flex-col gap-4 text-zinc-800 dark:text-zinc-300">
			{content}
		</div>
	</div>
</div>
