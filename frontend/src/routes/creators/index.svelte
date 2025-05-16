<script context="module">
	import { fetchData } from "../../js/processGraphql.js";
	import { getAllCreatorsQuery, processCreatorsFromAggregates } from "../../js/graphqlQueries.js";
	import { config } from '../../js/config.js'
	
	export async function preload() {
		const creatorsData = await fetchData(getAllCreatorsQuery());
		const creatorsList = processCreatorsFromAggregates(creatorsData);
		return { creators: creatorsList };
	}
</script>

<script>
	import { isXianKey } from '../../js/utils';
	export let creators = [];

	// Sort creators by NFT count (descending)
	$: sortedCreators = [...creators].sort((a, b) => b.count - a.count);
	
	// Format address without quotes
	const formatAddress = (address) => {
		if (!address) return '';
		// Remove any quotes that might be in the address
		const cleanAddress = String(address).replace(/['"]+/g, '');
		return cleanAddress.substring(0, 6) + '...' + cleanAddress.substring(cleanAddress.length - 4);
	};
	
	// Clean address for URL use - strip all quotes
	const getCleanAddressForUrl = (address) => {
		return String(address).replace(/['"]+/g, '');
	};
</script>

<svelte:head>
	<title>All Creators - Pixel Whale</title>
</svelte:head>

<div class="creators-container">
	<header>
		<h1>All Creators</h1>
		<p>Browse all creators who have minted NFTs on Pixel Whale</p>
	</header>

	{#if sortedCreators.length === 0}
		<div class="empty-state">
			<p>No creators found. Check back later!</p>
		</div>
	{:else}
		<div class="creators-list">
			{#each sortedCreators as creator}
				<a href={`/profile/${getCleanAddressForUrl(creator.address)}`} class="creator-item">
					<span class="creator-address">
						{formatAddress(creator.address)}
					</span>
					<span class="nft-count">{creator.count} NFTs</span>
				</a>
			{/each}
		</div>
	{/if}
</div>

<style>
	.creators-container {
		max-width: 900px;
		margin: 0 auto;
		padding: var(--space-lg, 16px);
	}

	header {
		margin-bottom: var(--space-xl, 24px);
	}

	h1 {
		color: var(--color-text-primary);
		font-size: var(--font-size-3xl, 2rem);
		font-weight: var(--font-weight-bold, 700);
		margin-bottom: var(--space-xs, 8px);
	}

	header p {
		color: var(--color-text-secondary);
		font-size: var(--font-size-lg, 1.125rem);
	}

	.empty-state {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 200px;
		background-color: var(--color-background-secondary, #f5f5f5);
		border-radius: var(--border-radius, 8px);
		padding: var(--space-xl, 24px);
	}

	.creators-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs, 4px);
	}

	.creator-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-sm, 12px);
		background-color: var(--color-background-secondary, #f5f5f5);
		border-radius: var(--border-radius, 8px);
		border: 1px solid var(--color-border-secondary, #e0e0e0);
		text-decoration: none;
		transition: background-color 0.2s ease;
	}

	.creator-item:hover {
		background-color: var(--color-background-tertiary, #eaeaea);
	}

	.creator-address {
		color: var(--color-text-primary);
		font-size: var(--font-size-xs, 0.75rem);
		font-family: var(--font-family-mono, monospace);
	}
	
	.nft-count {
		color: var(--color-text-secondary);
		font-size: var(--font-size-xs, 0.75rem);
		font-weight: var(--font-weight-medium, 500);
	}
</style> 