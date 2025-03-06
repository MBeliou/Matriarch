<script lang="ts">
	import { browser } from '$app/environment';
	import { MATRIARCH_CLIENT } from '$lib/clients';
	import ActionCheatsheet from '$lib/components/app/actions-cheatsheet/action-cheatsheet.svelte';
	import Transfer from '$lib/components/app/actions/transfer.svelte';
	import ChatInput from '$lib/components/app/chat-input/ChatInput.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Switch } from '$lib/components/ui/switch';
	import { LocalStorage } from '$lib/services/localstorage.svelte';
	import type { schemas } from '$lib/types/matriarch.zod';
	import { onMount } from 'svelte';
	import { z } from 'zod';
	import Panel, { type PanelProps } from './panel.svelte';

	let { data } = $props();

	let inputRef: HTMLInputElement;
	let input = $state<string>(null!);

	type Message = {
		origin: 'user' | 'assistant';
		content: string;
	};

	type MatriarchMessage = {
		origin: 'matriarch';
		connection: string;
		action: string;
		result: string;
	};

	let messages: (Message | MatriarchMessage)[] = $state([
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
			connection: 'sonic',
			action: 'transfer',
			result: 'Your Transaction went through'
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
		user: 'You',
		matriarch: 'matriarch'
	} as const;

	type Action = z.infer<typeof schemas.ActionRequest>;
	async function requestAction(action: Action) {
		const actionRequest = await MATRIARCH_CLIENT.post(
			'/agents/:agent_name/action',
			{
				action: action.action,
				connection: action.connection,
				params: action.params
			},
			{
				params: {
					agent_name: data.agent.name
				}
			}
		);

		return actionRequest;
		console.dir(actionRequest.response);
	}

	let localStorage;
	if (browser) {
		localStorage = new LocalStorage(`${data.agent.name}`);
	}
	onMount(() => {
		/*
		requestAction({
			action: 'get-balance',
			connection: 'sonic',
			params: []
		});
		*/
	});

	async function resumeChat(message: string) {
		const previousMessages = messages
			.filter((message) => message.origin !== 'matriarch')
			.map((message) => {
				return {
					role: message.origin === 'user' ? 'user' : 'assistant',
					content: message.content
				};
			});
		previousMessages.push({
			role: 'user',
			content: message
		});

		const actionRequest = await MATRIARCH_CLIENT.post(
			'/agents/:agent_name/action',
			{
				connection: 'openai',
				action: 'resume-chat',
				params: [previousMessages]
			},
			{
				params: {
					agent_name: data.agent.name
				}
			}
		);

		messages.push({
			origin: 'assistant',
			content: actionRequest.response as string
		});
	}

	let isUserRequestingAction = $state(false);

	function setupAutoScroll(containerId: string) {
		const container = document.getElementById(containerId);

		if (!container) {
			console.error(`Container with ID "${containerId}" not found.`);
			return;
		}

		// Create a MutationObserver to detect changes in the container
		const observer = new MutationObserver(() => {
			//container.scrollTop = container.scrollHeight;
			container.scrollTo({
				top: container.scrollHeight,
				behavior: 'smooth'
			});
		});

		// Start observing the container for changes
		observer.observe(container, {
			childList: true, // observe direct children
			subtree: true, // and lower descendants too
			characterData: true // observe changes to text content
		});

		return observer; // return the observer so it can be disconnected if needed
	}

	onMount(() => {
		const scroller = setupAutoScroll('scroller');

		return () => {
			scroller?.disconnect();
		};
	});
</script>

<div class="grid h-full grid-cols-3 grid-rows-1">
	<div class="relative col-span-2 flex max-h-[90svh] flex-col border-r">
		<div class="flex-1 overflow-y-auto pb-24" id="scroller">
			<div class="flex flex-col gap-4 p-4">
				{#each messages as message}
					{@const displayedName = names[message.origin] || null}
					{#if message.origin === 'matriarch'}
						<div>
							<div class="text-muted-foreground mb-1 text-sm capitalize">
								{message.connection} - {message.action}
							</div>
							<div
								class="bg-primary
									text-foreground w-full overflow-hidden rounded border"
							>
								<div class="px-4 py-2">
									{message.result}
								</div>
							</div>
						</div>
					{:else}
						<div class="{message.origin === 'user' ? 'self-end text-right' : ''} max-w-[66%]">
							<div class="text-muted-foreground mb-1 text-sm capitalize">
								{displayedName}
							</div>
							<div class=" text-pretty rounded border px-4 py-2">
								{message.content}
							</div>
						</div>
					{/if}
				{/each}
			</div>
		</div>
		<form
			class="relative flex min-h-[100px] flex-col items-center gap-2"
			onsubmit={async (event) => {
				event.preventDefault();

				if (!input || input.length === 0) {
					return;
				}

				if (isUserRequestingAction) {
					let splitInput = input.split(' ');
					if (splitInput.length < 2) {
						return;
					}

					const [connection, action, ...params] = splitInput;
					// TODO: show we're querying
					const actionResponse = await requestAction({
						action,
						connection,
						params
					});

					messages.push({
						origin: 'matriarch',
						action: `${action} (${params.join(', ')})`,
						connection: connection,
						result: actionResponse.response as string
					});

					input = '';
					return;
				}

				let resumeChatPromise = resumeChat(input);

				// TODO: set and send message
				// TODO: store messages
				// Just chatting
				messages.push({
					origin: 'user',
					content: input
				});

				input = '';
				await resumeChatPromise;
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

			<!-- TODO: we want to also be able to just send an action via test to the Agent -->
			<div
				class="absolute bottom-6 flex w-full max-w-[calc(100dvw-32px)] flex-col space-y-2 px-4 md:max-w-[500px]"
			>
				<div class="flex items-center justify-end space-x-2">
					<Label for="user-request-action" class="text-muted-foreground text-sm"
						>Request Action</Label
					>
					<Switch id="user-request-action" bind:checked={isUserRequestingAction}></Switch>
					{#if data.actions}
						<ActionCheatsheet actions={data.actions}></ActionCheatsheet>
					{/if}
				</div>
				<ChatInput
					bind:input
					placeholder={isUserRequestingAction ? 'connection action params' : 'Send a message...'}
				></ChatInput>
			</div>
		</form>
	</div>
	<div class="flex max-h-[90svh] flex-col">
		<div class="relative flex flex-1 flex-col overflow-y-hidden border-b">
			<Panel agent={data.agent as unknown as PanelProps['agent']}></Panel>
			<div
				class="to-background/60 pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent"
			></div>
		</div>
		<div class="p-2 xl:p-4">
			<h2 class="text-xl font-medium">Actions</h2>
			<div class=" mt-2 flex flex-wrap gap-4">
				<Transfer
					onSubmit={() => {
						console.log('submit these');
					}}
				></Transfer>qu
			</div>
		</div>
	</div>
</div>
