<script lang="ts" module>
</script>

<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import SendIcon from 'lucide-svelte/icons/send';

	let { onSubmit }: { onSubmit: () => void } = $props();

	// NOTE: agent deals with decimals itself, no worries here
	let amount: string = $state('10');
	let tokenTicker: string = $state(null!);
	let recipient: string = $state(null!)

	async function hey() {
		if (tokenTicker) {
			// query address if required
		}
	}
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'icon' })}>
		<SendIcon></SendIcon>
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Transfer</Dialog.Title>
			<Dialog.Description>Agent will send tokens to the given recipient</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid gap-2">
				<Label for="recipient" class="">Recipient</Label>
				<Input id="recipient" bind:value={recipient} placeholder="0x..." class="col-span-3" />
			</div>
			<div class="grid gap-2">
				<Label for="amount" class="">Amount</Label>
				<Input
					id="amount"
					inputmode="decimal"
					pattern="[0-9]*[.]?[0-9]*"
					bind:value={amount}
					class="col-span-3"
				/>
			</div>
			<div class="grid gap-2">
				<Label for="token-ticker" class="">Ticker (Optional)</Label>
				<Input id="token-ticker" bind:value={tokenTicker} placeholder="0x..." class="col-span-3" />
			</div>
		</div>
		<Dialog.Footer>
			<Button type="submit">Request Transfer</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
