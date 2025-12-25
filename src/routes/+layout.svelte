<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	import CrtOverlay from '$lib/components/CRTOverlay.svelte';
	import Scanlines from '$lib/components/Scanlines.svelte';
	import Terminal from '$lib/components/Terminal.svelte';
	import TerminalHeader from '$lib/components/TerminalHeader.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>



<Terminal>
	<Scanlines />
	<TerminalHeader />

	{@render children()}
</Terminal>

<CrtOverlay />
