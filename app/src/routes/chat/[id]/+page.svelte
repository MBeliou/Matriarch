<script lang="ts">
	import { chatService } from '$lib/clients/chat';
	import type { ChatMessage } from '$lib/clients/chat/types.js';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { setupAutoScroll } from '$lib/utils.js';
	import SendIcon from 'lucide-svelte/icons/send';
	import { onMount } from 'svelte';

	let { data } = $props();

	let messages = $state(data.roomHistory.messages);
	//let participants = $state(data.room.participants);

	let participants = $derived.by(() => {
		const uniqueSenders = new Set(data.roomHistory.messages.map((m) => JSON.stringify(m.sender)));
		return Array.from(uniqueSenders).map((str) => JSON.parse(str));
	});

	$effect(() => {
		console.log('sort');
		messages = messages.sort((a, b) => {
			return new Date(a.timestamp).valueOf() - new Date(b.timestamp).valueOf();
		});
	});

	$inspect(messages);

	onMount(() => {
		const pollSubscription = chatService.pollNewMessages(
			data.room.id,
			Math.max(
				...data.roomHistory.messages.map((m) => new Date(m.timestamp).valueOf()),
				0
			).toString(),
			2000,
			(data) => {
				messages.push(...data);
			}
		);

		return () => {
			pollSubscription();
		};
	});

	async function onSubmitMessage(message: string) {
		await chatService.sendMessage(data.room.id, message, {
			model: 'Brain Power',
			username: 'Human'
		});

		const { messages: latestMessages } = await chatService.getRoomHistory(data.room.id);
		messages = latestMessages;
	}

	let chatInput: string = $state(null!);
</script>

{#snippet chatBubble(message: ChatMessage)}
	<div class="rounded border p-2">
		<div class="flex items-center justify-between text-sm">
			<div>
				{message.sender.username}
			</div>
			<div class="text-muted-foreground">
				{message.sender.model}
			</div>
		</div>
		<div class="mt-2 max-w-[300px] text-pretty">
			{message.content}
		</div>
		<div class="text-muted-foreground mt-4 text-right text-xs">
			{new Date(message.timestamp).toLocaleTimeString()}
		</div>
	</div>
{/snippet}

<div class=" border-b px-6 py-6">
	<div class="">
		<h1 class="text-3xl font-semibold">{data.room.name}</h1>
		<p class="text-muted-foreground mt-1 text-sm">{data.room.topic}</p>
	</div>
	<div class="mt-4 flex items-center space-x-4">
		{#each data.room.tags as tag}
			<Badge variant="secondary" class="capitalize">
				{tag}
			</Badge>
		{/each}
	</div>
</div>
<div class="-mt-4 flex flex-1 items-stretch divide-x">
	<div class="relative flex flex-1 flex-col">
		<div class="flex-1 overflow-y-auto">
			<div class="space-y-4 px-6 py-6">
				{#each messages as message (message.id)}
					{@render chatBubble(message)}
				{/each}
			</div>
		</div>
		<div class="sticky inset-x-0 bottom-0 p-6">
			<form
				onsubmit={(e) => {
					e.preventDefault();
					console.log('submiting', chatInput);
					onSubmitMessage(chatInput);

					chatInput = '';
				}}
				class="flex items-center space-x-2"
			>
				<Input
					bind:value={chatInput}
					autocomplete="off"
					required
					type="text"
					minlength={2}
					placeholder="Start typing..."
				></Input>
				<Button size="icon" type="submit">
					<SendIcon></SendIcon>
				</Button>
			</form>
		</div>
	</div>

	<div class="w-full max-w-[240px]">
		<h2 class="border-b p-4">Participants</h2>
		<div class=" divide-y">
			{#each participants as participant}
				<div class="flex items-center justify-between p-4">
					<div>
						<div>
							{participant.username}
						</div>
						<div class="text-muted-foreground mt-1 text-xs">
							{participant.model}
						</div>
					</div>
					<div class="h-1 w-1 rounded-full bg-green-500"></div>
				</div>
			{/each}
		</div>
	</div>
</div>
