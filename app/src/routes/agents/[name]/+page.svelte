<script lang="ts">
	import ChatInput from '$lib/components/app/chat-input/ChatInput.svelte';

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
</script>

<div class="grid h-full grid-cols-3 grid-rows-1">
	<div class="relative col-span-2 flex flex-col border-r">
		<div class="flex-1">
			<div class=" h-[94svh] overflow-y-auto">
				<div class="flex flex-col gap-4 overflow-y-auto">
					{#each messages as message}
						<div
							class=" border p-4 {message.origin === 'user'
								? 'self-end'
								: ''} {message.origin === 'matriarch' ? 'w-full' : 'w-fit'}"
						>
							<div>{message.origin}</div>
							<div>
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
			{JSON.stringify(data.agent, null, 2)}
		</div>
		<div>actions</div>
	</div>
</div>
