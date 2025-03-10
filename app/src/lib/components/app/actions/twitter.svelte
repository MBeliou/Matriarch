<script lang="ts" module>
</script>

<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import Spinner from 'lucide-svelte/icons/loader-circle';

	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import TwitterIcon from 'lucide-svelte/icons/twitter';

	let {
		onRequestLLM,
		onPostTweet
	}: {
		onPostTweet: (content: string) => Promise<void>;
		onRequestLLM: (prompt: string) => Promise<string>;
	} = $props();

	// NOTE: agent deals with decimals itself, no worries here
	let amount: string = $state('10');
	let tokenTicker: string = $state(null!);
	let recipient: string = $state(null!);

	async function hey() {
		if (tokenTicker) {
			// query address if required
		}
	}

	let input = $state('');

	let characterCount = $derived(input.length);
	const characterCountLimit = 280;

	let isPrompting = $state(false);

	async function requestLLM() {
		isPrompting = true;
		const llmResponse = await onRequestLLM(input);
		isPrompting = false;

		input = llmResponse;
	}

	let isOpen = $state(false);

	async function requestPostTweet() {
		onPostTweet(input);
		isOpen = false;
	}
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'icon' })}>
		<TwitterIcon></TwitterIcon>
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>X (ex-Twitter)</Dialog.Title>
			<Dialog.Description>Write a tweet for your agent to send</Dialog.Description>
		</Dialog.Header>
		<div class="relative grid py-4">
			<div class="relative min-h-[200px]">
				<Textarea class="disabled:bg-muted h-full" disabled={isPrompting} bind:value={input}
				></Textarea>
				{#if isPrompting}
					<div class="absolute inset-0">
						<div class="flex h-full flex-col items-center justify-center">
							<Spinner class="animate-spin"></Spinner>
						</div>
					</div>
				{/if}
			</div>

			<div class="text-muted-foreground mt-2 text-right text-xs">
				{characterCount} / {characterCountLimit} characters
			</div>
		</div>
		<Dialog.Footer>
			<Button variant="secondary" onclick={() => requestLLM()}>Prompt LLM</Button>
			<Button onclick={() => requestPostTweet()}>Post</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
