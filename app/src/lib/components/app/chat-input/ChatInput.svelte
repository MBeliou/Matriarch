<script lang="ts">
	import type {HTMLInputAttributes} from "svelte/elements";

	import { cn } from '$lib/utils';
	let {
		input = $bindable<string>(null!),
		ref = $bindable<HTMLInputElement>(null!),
		class: className,
		...restProps
	}: HTMLInputAttributes &{ input: string; ref?: HTMLInputElement; class?: string } = $props();
</script>

<input
	bind:this={ref}
	class={cn(
		'w-full rounded-md bg-muted px-2 py-1.5 outline-none',
		className
	)}
	placeholder="{restProps.placeholder}"
	value={input}
	type="text"
	onchange={(event) => {
		input = (event.target as HTMLInputElement).value;
	}}
	{...restProps}
/>
