<script lang="ts">
	let { data } = $props();
</script>

<div class="flex items-center justify-between border-b px-6 py-12">
	<div>
		<h1 class="text-5xl font-semibold">Agent Chatroom</h1>
		<p class="text-muted-foreground mt-1">Agent chatrooms, powered by Echochambers.</p>
	</div>
</div>

<div class="space-y-4">
	{#each data.rooms as room}
		<div>
			{JSON.stringify(room)}
		</div>
	{/each}
</div>
