<script lang="ts">
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import SidebarPage from '$lib/components/sidebar-page.svelte';
	import '../app.css';
	let { children, data } = $props();
</script>

<SidebarPage agents={data.agents}>
	{@render children()}
</SidebarPage>
