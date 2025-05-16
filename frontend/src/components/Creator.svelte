<script>
    import { beforeUpdate } from 'svelte';
    import NFTCard from './cards/NFTCard.svelte';
	import { fetchThings } from "../js/processGraphql.js";
    import { getCreatedUidsQuery } from "../js/graphqlQueries.js";
    // MISC
    import { decodeFrames, formatAccountAddress, isXianKey, updateInfo } from "../js/utils.js";
	import { formatThings } from "../js/utils";

    import { userAccount } from '../js/stores'
    import { config } from '../js/config'

    export let created;
    export let creator;

    let formatted = [];
    let scrollHeight;
	let innerHeight;
    let at_end = false;
    let sending = false;


    $: formatted = formatThings(created);
    $: elements = []
	$: lastElementTop = elements.length > 0 ? elements[elements.length -1].offsetTop: null
	$: lastElementOffsetHeight = elements.length > 0 ? elements[elements.length -1].offsetHeight: null
	$: visibleHeight = scrollHeight + innerHeight
	$: checker = checkGetMore(elements)

    // Log thingInfo to see data structure
    $: if (formatted && formatted.length > 0) {
        const sample = formatted[0];
        console.log("Created NFT sample data:", sample);
        console.log("Created NFT price fields: ", {
            price: sample.price,
            price_amount: sample.price_amount,
            current_price: sample.current_price,
            list_price: sample.list_price
        });
    }

	const checkGetMore = () => {
    	if (lastElementTop === null || lastElementOffsetHeight === null) return
		if (visibleHeight > lastElementTop - (lastElementOffsetHeight * 4)) getMore()
	}

	const getMore = async () => {
    	if (at_end) return
    	if (sending) return;
		sending = true;
		const moreThings = await fetchThings(getCreatedUidsQuery(creator, formatted.length))
		sending = false;
		formatted = [...formatted, ...formatThings(moreThings)]
		if (!moreThings.length) at_end = true
	}
    
    // Function to update an NFT's info after actions
    function updateNFTInfo(updates, index) {
        updateInfo(formatted[index], updates);
        formatted = [...formatted]; // Trigger reactivity
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
        width: 100%;
        padding: 1rem 0;
        box-sizing: border-box;
    }

    @media (max-width: 600px) {
        .nft-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
<!-- <h2>
	All NFTs Created by
	{#if isXianKey(creator)}
		<a href="{`${config.blockExplorer}/addresses/${creator}`}" target="_blank" rel="noopener noreferrer">
            {formatAccountAddress(creator, 8, 5)}
        </a>
	{:else}
		{creator.length > 15 && !creator.startsWith("con_") ? formatAccountAddress(creator, 8, 5) : creator}
	{/if}
</h2> -->

{#if formatted.length == 0}
	<p>
		{`${creator === $userAccount ? "You haven't" : "This user hasn't"} created anything yet!`}
	</p>
{/if}
<div class="nft-grid">
    {#each formatted as thingInfo, index}
        {#if thingInfo.blacklist && thingInfo.owner !== $userAccount}

		{:else}
            <div bind:this={elements[index]}>
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
                    updateInfo={(updates) => updateNFTInfo(updates, index)}
                />
            </div>
        {/if}
    {/each}
</div>

<svelte:window bind:scrollY={scrollHeight} bind:innerHeight={innerHeight} on:scroll={checkGetMore}/>