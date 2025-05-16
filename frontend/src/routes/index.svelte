<!-- /frontend/src/routes/index.svelte -->
<script context="module">
	import { fetchThings } from "../js/processGraphql.js";
	import { 
		getMostLikedUidsQuery, 
		getRecentUidsQuery, 
		getOwnedUidsQuery, 
		getThingsForSaleUidsQuery 
	} from "../js/graphqlQueries.js";
	
	export async function preload() {
		console.log("WE DOIN IT")
		let data = await Promise.all([
			fetchThings(getRecentUidsQuery()),
			fetchThings(getThingsForSaleUidsQuery()),
			// this.fetch(`./getArtistEvent.json?event=artist`).then(res => res.json())
			// fetchData(getMostLikedUidsQuery()),
			// fetchData(getOwnedUidsQuery()),
		]);

		console.log(data[1])

		// let eventInfo = data[2];

		// try{
		// 	let endDate = new Date(eventInfo.endDate)
		// 	let shouldShowEvent = new Date() <= endDate.setDate(endDate.getDate() + 3) && new Date() >= new Date(eventInfo.announceDate)
		// 	if (!shouldShowEvent) eventInfo = false
		// }catch (e) {
		// 	eventInfo = null
		// }

		return {
			// mostLiked: data[0],
			recent: data[0],
			forsale: data[1],
			// eventInfo
		}
	}
</script>

<script>
	import {onMount} from 'svelte'

	// Components
	import Title from "../components/Title.svelte";
	// import PixelWall from '../components/PixelWall.svelte';
	import Recent from '../components/Recent.svelte';
	import ForSale from '../components/ForSale.svelte';
	import ArtistEvent from "../components/ArtistEvent.svelte";


	// export let mostLiked;
	export let segment;
	export let recent;
	export let forsale;
	export let eventInfo;

</script>

<svelte:head>
	<title>Pixel Snek: On-chain NFT Animations!</title>
</svelte:head>

<div class="page-container">
	<div class="header-section">
		<Title fontSize={8} showFullLogo={true}/>
	</div>

	<div class="mobile-message">
		<strong>This site is not mobile optimized.</strong>
		Please visit us on a desktop for the full experience including integration with the Xian Wallet to enable
		<strong>buying, selling and creating custom NFT pixel animations!</strong>
	</div>

	{#if eventInfo}
		<section class="event-section">
			<ArtistEvent {eventInfo}/>
		</section>
	{/if}
	<!-- {:else}
		<PixelWall {mostLiked}/>
	{/if} -->

	<section class="content-section">
		<Recent {recent} preview={true}/>
	</section>

	<section class="content-section">
		<ForSale {forsale} preview={true}/>
	</section>
</div>

<style>
	.page-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: var(--space-lg, 16px);
	}

	.header-section {
		margin: 3rem auto;
	}

	.content-section {
		margin-bottom: var(--space-xxl, 48px);
	}

	.section-title {
		font-size: var(--font-size-2xl, 1.5rem);
		font-weight: var(--font-weight-semibold, 600);
		color: var(--color-text-primary);
		margin-bottom: var(--space-md, 12px);
		text-align: center;
		padding-bottom: var(--space-md, 12px);
		border-bottom: 1px solid var(--color-border-secondary);
	}

	.event-section {
		margin: var(--space-xl, 24px) 0;
	}

	.mobile-message {
		background-color: var(--color-background-secondary);
		border-radius: var(--border-radius, 8px);
		padding: var(--space-md, 12px);
		text-align: center;
		margin-bottom: var(--space-lg, 16px);
		display: none;
	}

	@media (max-width: 768px) {
		.mobile-message {
			display: block;
		}

		.header-section {
			margin: 1rem auto;
		}
	}

	@media (max-width: 480px) {
		.page-container {
			padding: var(--space-sm, 8px);
		}
	}
</style>