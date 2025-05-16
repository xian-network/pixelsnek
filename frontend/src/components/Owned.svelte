<script>
    import { onMount, beforeUpdate } from 'svelte'
    import { scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

    import NFTCard from './cards/NFTCard.svelte';

    import { formatThings, updateInfo, formatAccountAddress, isXianKey } from "../js/utils.js";
    import { userAccount } from '../js/stores'
	import { config } from '../js/config'

	import { fetchThings } from "../js/processGraphql.js";
    import { getOwnedUidsQuery } from "../js/graphqlQueries.js";

    export let owned;
    export let account;

	let at_end = false;
    let sending = false;
    let scrollHeight;
	let innerHeight;
    $: formatted = formatThings(owned)
    $: elements = []
	$: lastElementTop = elements.length > 0 ? elements[elements.length -1].offsetTop: null
	$: lastElementOffsetHeight = elements.length > 0 ? elements[elements.length -1].offsetHeight: null
	$: visibleHeight = scrollHeight + innerHeight
	$: checker = checkGetMore(elements)

    // Log thingInfo to see data structure
    $: if (formatted && formatted.length > 0) {
        const sample = formatted[0];
        console.log("Sample NFT data:", sample);
        console.log("Price fields: ", {
            price: sample.price,
            price_amount: sample.price_amount,
            current_price: sample.current_price,
            list_price: sample.list_price
        });
    }

	const checkGetMore = () => {
    	if (lastElementTop === null || lastElementOffsetHeight === null) return
		if (visibleHeight > lastElementTop - (lastElementOffsetHeight * 4) && account) getMore()
	}
	const getMore = async () => {
		if (at_end) return
    	if (sending) return;

		sending = true;
		const query = getOwnedUidsQuery(account, formatted.length)
		const moreThings = await fetchThings(query)
		sending = false;
		formatted = [...formatted, ...formatThings(moreThings)]
		if (!moreThings.length) at_end = true
	}

    const updateThing = (updates, index) => {
    	updateInfo(formatted[index], updates)
		formatted = [...formatted]
	}

    // Helper function to get price for NFT
    function getNFTPrice(nft) {
        // Look for price in these potential fields
        return nft.price_amount || nft.price || nft.current_price || nft.list_price || 0;
    }
</script>

<style>
	h2{
		border-top: 1px solid lightgray;
		padding-top: 1rem;
		margin-top: 2rem;
        color: var(--color-text-primary);
        font-family: var(--font-family-heading);
        letter-spacing: 0.15em;
        text-transform: uppercase;
	}
    p{
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
	a{
		color: var(--color-text-link);
	}
    
    .nft-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: var(--space-lg, 24px);
    }

    @media (max-width: 600px) {
        .nft-grid {
            grid-template-columns: 1fr;
        }
    }
</style>

<!-- <h2>
	All NFTs owned by
	{#if isXianKey(account)}
		<a href="{`${config.blockExplorer}/addresses/${account}`}" target="_blank" rel="noopener noreferrer">
			{formatAccountAddress(account, 8, 5)}
		</a>
	{:else}
		{account.length > 15 && !account.startsWith("con_") ? formatAccountAddress(account, 8, 5) : account}
	{/if}
</h2> -->

{#if formatted.length == 0}
	<p>
		{`${account === $userAccount ? "You don't" : "This user doesn't"} own anything yet!`}
	</p>
{/if}

<div class="nft-grid">
    {#each formatted as thingInfo, index}
		{#if thingInfo.blacklist && thingInfo.owner !== $userAccount}
        
		{:else}
			<div
				bind:this={elements[index]}>
				<NFTCard
                    pixels={thingInfo.frames}
                    pixelSize={7}
                    title={thingInfo.name}
                    description={thingInfo.description}
                    creatorName={thingInfo.creator}
                    ownerName={thingInfo.owner}
                    currentBid={getNFTPrice(thingInfo)}
                    currencySymbol={config.currencySymbol}
                    href={`/frames/${thingInfo.uid}`}
                    {thingInfo}
                    updateInfo={(updates) => updateThing(updates, index)}
                />
        	</div>
		{/if}
    {/each}
</div>

<svelte:window bind:scrollY={scrollHeight} bind:innerHeight={innerHeight} on:scroll={checkGetMore}/>