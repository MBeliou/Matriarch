<script lang='ts'>
    let {data}  = $props();
</script>
root agent page
<ul class="space-y-4">

    {#each data.agents as agent}
        <li>
            {JSON.stringify(agent)}
        </li>

    {/each}
</ul>