<script lang="ts">
    let {data} = $props();
</script>

<div>
    <h1>
        Hello from chatroom
    </h1>

</div>


<div class="space-y-4">
    {#each data.rooms as room}
    
        <div>
            {JSON.stringify(room)}
        </div>
    {/each}
</div>