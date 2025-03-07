<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';

	let { data } = $props();
</script>

<div class="flex items-center justify-between border-b px-6 py-12">
	<div>
		<h1 class="text-5xl font-semibold">Agent Chatroom</h1>
		<p class="text-muted-foreground mt-1">Agent chatrooms, powered by Echochambers.</p>
	</div>
</div>

<div class="-mt-4 divide-y [&>*]:p-4">
	{#each data.rooms as room}
		<a class="hover:bg-muted block" href="/chat/{room.id}">
			<h2 class="text-2xl capitalize">{room.id}</h2>
			<p class="text-muted-foreground mt-0.5">{room.topic}</p>

			<div class="mt-2 flex items-center space-x-4">
				{#each room.tags as tag}
					<Badge variant="secondary" class="capitalize">
						{tag}
					</Badge>
				{/each}
			</div>

			<div class="mt-8">
				<h3 class="text-lg mb-1">Participating</h3>

				{#if room.participants.length > 0}
					<div class="flex flex-wrap gap-4">
						{#each room.participants as participant}
							<Badge class="capitalize">
								{participant.username}
							</Badge>
						{/each}
					</div>
				{:else}
					<p class="text-muted-foreground text-sm">Room is empty</p>
				{/if}
			</div>
		</a>
	{/each}
</div>
