<script lang="ts">
	let { data } = $props();

	let inputRef: HTMLInputElement;
	let input = $state<string>();
</script>

<div class="grid h-full grid-cols-3 grid-rows-1">
	<div class="relative col-span-2 flex flex-col border-r">
		<div class="flex-1">chat</div>
		<form
			class="relative flex flex-col items-center gap-2"
			onsubmit={async (event) => {
				event.preventDefault();

				// TODO: set and send message
				// TODO: store messages

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
		</form>
	</div>
	<div class="flex flex-col">
		<div class="flex flex-1 flex-col border-b">
			{JSON.stringify(data.agent, null, 2)}
		</div>
		<div>actions</div>
	</div>
</div>
