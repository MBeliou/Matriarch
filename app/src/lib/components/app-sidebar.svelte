<script lang="ts" module>
	import Robot from 'lucide-svelte/icons/bot-message-square';
	import MessagesSquare from 'lucide-svelte/icons/messages-square';
	import PlusIcon from 'lucide-svelte/icons/plus';
	import GithubIcon from 'lucide-svelte/icons/github';
	// This is sample data
	const data = {
		user: {
			name: 'shadcn',
			email: 'm@example.com',
			avatar: '/avatars/shadcn.jpg'
		},
		navMain: [
			{
				title: 'Agents',
				url: '/agents',
				icon: Robot,
				isActive: true
			},
			{
				title: 'Chat',
				url: '/chat',
				icon: MessagesSquare,
				isActive: false
			}
		]
	};
</script>

<script lang="ts">
	import NavUser from '$lib/components/nav-user.svelte';
	import { useSidebar } from '$lib/components/ui/sidebar/context.svelte.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import Command from 'lucide-svelte/icons/command';
	import type { ComponentProps } from 'svelte';
	import { sidebarMenuButtonVariants } from './ui/sidebar/sidebar-menu-button.svelte';
	import Button from './ui/button/button.svelte';
	import type { z } from 'zod';
	import type { schemas } from '$lib/types/matriarch.zod';
	import SidebarMenuItem from './ui/sidebar/sidebar-menu-item.svelte';

	type Agent = z.infer<(typeof schemas)['AgentResponse']>;
	let {
		ref = $bindable(null),
		agents,
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & {
		agents: Agent[];
	} = $props();

	let activeItem = $state(data.navMain[0]);
	//let agents = $state(data.agents);
	const sidebar = useSidebar();

	let searchInput = $state<string>(null!);

	let filteredAgents = $derived.by(() => {
		if (searchInput && searchInput.length > 2) {
			return agents.filter((agent) => agent.name.toLowerCase().includes(searchInput.toLowerCase()));
		} else {
			return agents;
		}
	});
</script>

<Sidebar.Root
	bind:ref
	collapsible="icon"
	class="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
	{...restProps}
>
	<Sidebar.Root collapsible="none" class="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r">
		<Sidebar.Header>
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<Sidebar.MenuButton size="lg" class="md:h-8 md:p-0">
						{#snippet child({ props })}
							<a href="/" {...props}>
								<div
									class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
								>
									<Command class="size-4" />
								</div>
								<div class="grid flex-1 text-left text-sm leading-tight">
									<span class="truncate font-semibold">Matriarch</span>
									<span class="truncate text-xs">Enterprise</span>
								</div>
							</a>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Header>
		<Sidebar.Content>
			<Sidebar.Group>
				<Sidebar.GroupContent class="px-1.5 md:px-0">
					<Sidebar.Menu>
						{#each data.navMain as item (item.title)}
							<Sidebar.MenuItem>
								<a href={item.url} title={item.title} class={sidebarMenuButtonVariants.base}>
									<item.icon></item.icon>
								</a>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		</Sidebar.Content>
		<Sidebar.Footer class="flex flex-col items-center ">
			<a href="https://github.com/MBeliou/ZerePy"><GithubIcon size={18}></GithubIcon></a>
		</Sidebar.Footer>
	</Sidebar.Root>

	<!-- This is the second sidebar -->
	<!-- We disable collapsible and let it fill remaining space -->
	<Sidebar.Root collapsible="none" class="relative hidden flex-1 md:flex">
		<Sidebar.Header class="gap-3.5 border-b p-4">
			<div class="flex w-full items-center justify-between">
				<div class="text-foreground text-base font-medium">
					{activeItem.title}
				</div>

				<Button size="sm" href="/agents/new"><PlusIcon></PlusIcon>Create</Button>
			</div>
			<Sidebar.Input placeholder="Type to search..." bind:value={searchInput} />
		</Sidebar.Header>
		<Sidebar.Content class="">
			<Sidebar.Group class="px-0 ">
				<Sidebar.GroupContent class=" mb-24">
					{#each filteredAgents as agent (agent.name)}
						<a
							href="/agents/{agent.name}"
							class="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0"
						>
							<div class="flex w-full items-center gap-2">
								<span class="text-base font-medium">{agent.name}</span>
								<span class="text-muted-foreground ml-auto text-xs">#{agent.id}</span>
							</div>
							<span class="font-medium">{agent.description}</span>
							<span class="line-clamp-2 w-[260px] whitespace-break-spaces text-xs">
								{agent.description}
							</span>
						</a>
					{/each}
				</Sidebar.GroupContent>
			</Sidebar.Group>
		</Sidebar.Content>
	</Sidebar.Root>
</Sidebar.Root>
