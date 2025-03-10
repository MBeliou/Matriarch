<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import QrCodeIcon from 'lucide-svelte/icons/qr-code';

	let { address }: { address: string } = $props();

	// @ts-expect-error missing types
	import QrCode from 'svelte-qrcode';
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'icon' })}>
		<QrCodeIcon></QrCodeIcon>
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>EVM Address</Dialog.Title>
			<Dialog.Description>Your agent's EVM and Sonic address</Dialog.Description>
		</Dialog.Header>
		<div class="relative grid py-4">
			<div class="relative flex min-h-[200px] w-full items-center justify-center">
				<QrCode value={address} size={200} />
			</div>

			<div class="text-muted-foreground mt-2 text-center text-xs">{address}</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
