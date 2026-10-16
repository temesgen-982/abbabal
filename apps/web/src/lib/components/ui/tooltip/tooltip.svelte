<script lang="ts">
	import { Tooltip as TooltipPrimitive } from "bits-ui";
	import TooltipProvider from "./tooltip-provider.svelte";
	import type { Snippet } from "svelte";
	import type { WithoutChildrenOrChild } from "$lib/utils.js";

	let {
		open = $bindable(false),
		children,
		...restProps
	}: WithoutChildrenOrChild<TooltipPrimitive.RootProps> & { children?: Snippet } = $props();
</script>

<TooltipProvider>
	<TooltipPrimitive.Root bind:open {...restProps}>
		{@render children?.()}
	</TooltipPrimitive.Root>
</TooltipProvider>
