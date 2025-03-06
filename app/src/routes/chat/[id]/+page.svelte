<script lang="ts">
	import { chatService } from '$lib/clients/chat';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { onMount } from 'svelte';

	let { data } = $props();


    let messages = $state(data.roomHistory.messages);

    onMount(() => {
            const pollSubscription = chatService.pollNewMessages(data.room.id, data.roomHistory.messages.at(-1)?.timestamp || "0", 5000, (data) => {
                messages.push(...data);
            })


            return () => {
                pollSubscription();
            }

    }) 
</script>

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
<div class="bg-primary -mt-4 flex flex-1 items-stretch divide-x">
	<div class="max-h-[70vh] flex-1 overflow-y-auto">
		<div class="h-[200vh] bg-blue-500">

            {#each data.roomHistory.messages as message (message.id)}
                {message.content}
            {/each}
        </div>
	</div>
	<div class="w-full max-w-[200px]">
		<h2>Participants</h2>
		<div>
			{#each data.room.participants as participant}
				<div>
					{participant.username}
				</div>
			{/each}
		</div>
	</div>
</div>
