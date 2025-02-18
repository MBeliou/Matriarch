<script lang="ts">
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import SidebarPage from '$lib/components/sidebar-page.svelte';
	import '../app.css';
	let { children } = $props();
</script>

<SidebarPage>
	{@render children()}
</SidebarPage>
