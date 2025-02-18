<script lang="ts">
	import Marquee from '$lib/components/app/marquee/marquee.svelte';
	import Particles from '$lib/components/app/particles/particles.svelte';

	const reviews = [
		{
			name: 'OpenAI',
			username: '@Bhide',
			body: "You're my Co-Founder, we need a roadmap.",
			img: 'https://avatar.vercel.sh/jack'
		},
		{
			name: 'Sonic',
			body: 'Swap my USDC for Sonic',
			img: 'https://avatar.vercel.sh/jill'
		},
		{
			name: 'X (ex-Twitter)',
			username: '@Pokie',
			body: 'Answer the most recent posts on your timeline',
			img: 'https://avatar.vercel.sh/john'
		},
		{
			name: 'Echo Chambers',
			username: '@Saloni',
			body: 'Tell the other agents about our token.',
			img: 'https://avatar.vercel.sh/jenny'
		},
		{
			name: 'Degen Express',
			username: '@pablo',
			body: 'Launch a token on Degen, call it Soylana.',
			img: 'https://avatar.vercel.sh/jane'
		},
		{
			name: 'Debridge',
			username: '@Bhai',
			body: 'Funding you from Ethereum.',
			img: 'https://avatar.vercel.sh/james'
		}
	];

	let firstRow = reviews.slice(0, reviews.length / 2);
	let secondRow = reviews.slice(reviews.length / 2);
</script>

<div class="relative flex flex-col items-center pt-16">
	<h1
		class="via-white to-background/80 pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b  bg-clip-text text-center text-8xl font-semibold leading-none text-transparent from-white"
	>
		Meet Matriarch
	</h1>
	<p class="z-10 mt-1 font-medium text-muted-foreground">
		Create and design AI Agents, built on ZerePy & Sonic.
	</p>

	<div class="aboslute bottom-0 flex z-10 items-center justify-center border-b w-full mt-10">
		<img decoding="async" src="/matriarch.png" alt="" class=" w-[640px]" style="" />
	</div>

	<Particles className="absolute inset-0" refresh={true} />

</div>

<div
	class="relative py-16 flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg  [--sidebar-width:0px] md:shadow-xl
	md:[--sidebar-width:350px]
	"
	style="width: calc(100vw - var(--sidebar-width));"
>
	<Marquee pauseOnHover class="[--duration:20s]">
		{#each firstRow as item}
			<div class="w-64 rounded border bg-card p-4">
				<div>
					<img src={item.img} alt={item.name} class="w-8 rounded-full" />
				</div>
				<div class="mt-2 text-lg font-medium">
					{item.name}
				</div>
				<div class="mt-2 text-muted-foreground">
					{item.body}
				</div>
			</div>
		{/each}
	</Marquee>
	<Marquee reverse pauseOnHover class="[--duration:20s]">
		{#each secondRow as item}
			<div class="w-64 rounded border bg-card p-4">
				<div>
					<img src={item.img} alt={item.name} class="w-8 rounded-full" />
				</div>
				<div class="mt-2 text-lg font-medium">
					{item.name}
				</div>
				<div class="mt-2 text-muted-foreground">
					{item.body}
				</div>
			</div>
		{/each}
	</Marquee>
	<div
		class="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white dark:from-background"
	></div>
	<div
		class="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white dark:from-background"
	></div>
</div>
