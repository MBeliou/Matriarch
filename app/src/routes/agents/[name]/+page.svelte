<script lang="ts">
	import ChatInput from '$lib/components/app/chat-input/ChatInput.svelte';
	import { unknown } from 'zod';
	import Panel, { type PanelProps } from './panel.svelte';

	let { data } = $props();

	let inputRef: HTMLInputElement;
	let input = $state<string>(null!);

	type Message = {
		origin: 'user' | 'assistant' | 'matriarch';
		content: string;
	};
	let messages: Message[] = $state([
		{
			origin: 'user',
			content: 'Hey! How do you do today?'
		},
		{
			origin: 'assistant',
			content: 'I am goodge happyPeepo'
		},
		{
			origin: 'matriarch',
			content: 'Your Transaction went through'
		}
	]);

	/*
	{
  "connection": "openai",
  "action": "resume-chat",
  "params": [[
    {
      "role": "system",
      "content": "You are an helpful assistant, please answer in a friendly manner"
    },
    {
      "role": "user",
      "content": "This is my prompt, that's the best I have"
    },
    {
      "role": "assistant",
      "content": "No problem at all! I'd be happy to assist with whatever you need. Just let me know how I can help you with your prompt."
    }
  ]]
}*/

	let names = {
		assistant: data.agent.name,
		user: 'You'
	};
</script>

<div class="grid h-full grid-cols-3 grid-rows-1">
	<div class="relative col-span-2 flex flex-col border-r">
		<div class="flex-1">
			<div class=" h-[94svh] overflow-y-auto">
				<div class="flex flex-col gap-4 overflow-y-auto p-4">
					{#each messages as message}
						{@const displayedName = names[message.origin] || null}
						<div
							class="{message.origin === 'user' ? 'self-end text-right' : ''} {message.origin ===
							'matriarch'
								? 'w-full'
								: 'w-fit'}"
						>
							{#if message.origin !== 'matriarch'}
								<div class="mb-1 text-sm font-medium capitalize text-muted-foreground">
									{displayedName}
								</div>
							{/if}
							<div
								class="rounded border p-4 {message.origin === 'matriarch'
									? 'rounded-lg bg-primary text-foreground'
									: ''}"
							>
								{message.content}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
		<form
			class="relative flex flex-col items-center gap-2"
			onsubmit={async (event) => {
				event.preventDefault();

				// TODO: set and send message
				// TODO: store messages

				messages.push({
					origin: 'user',
					content: input
				});

				input = '';
				/*
				event.preventDefault();

				setMessages((messages) => [
					...messages,
					<Message key={messages.length} role="user" content={input} />
				]);
				setInput('');

				const response: ReactNode = await sendMessage(input);
				setMessages((messages) => [...messages, response]);*/
			}}
		>
			<!-- 
			<input
				bind:this={inputRef}
				class="absolute bottom-6 w-full max-w-[calc(100dvw-32px)] rounded-md bg-muted px-2 py-1.5 outline-none md:max-w-[500px]"
				placeholder="Send a message..."
				value={input}
				type="text"
				onchange={(event) => {
					input = (event.target as HTMLInputElement).value;
				}}
			/>
			 -->
			<ChatInput bind:input></ChatInput>
		</form>
	</div>
	<div class="flex flex-col">
		<div class="flex flex-1 flex-col border-b">
			<Panel agent={data.agent as unknown as PanelProps['agent']}></Panel>
		</div>
		<div>actions</div>
	</div>
</div>
