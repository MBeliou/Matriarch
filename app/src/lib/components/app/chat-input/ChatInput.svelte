<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		input = $bindable<string>(null!),
		ref = $bindable<HTMLInputElement>(null!),
		class: className,
		...restProps
	}: { input: string; ref?: HTMLInputElement; class?: string } = $props();
</script>

<input
	bind:this={ref}
	class={cn(
		'absolute bottom-6 w-full max-w-[calc(100dvw-32px)] rounded-md bg-muted px-2 py-1.5 outline-none md:max-w-[500px]',
		className
	)}
	placeholder="Send a message..."
	value={input}
	type="text"
	onchange={(event) => {
		input = (event.target as HTMLInputElement).value;
	}}
	{...restProps}
/>
