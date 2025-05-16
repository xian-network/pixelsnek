<script>
	import { onMount, beforeUpdate } from 'svelte'
	import { scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import NFTCard from './cards/NFTCard.svelte';
	import Button from './Button.svelte';
	import { formatThings, updateInfo, dedupArray } from "../js/utils";
	import { config } from '../js/config.js'
	import { userAccount, showModal } from '../js/stores.js'
	import { fetchThings } from "../js/processGraphql.js";
    import { getThingsForSaleUidsQuery } from "../js/graphqlQueries.js";

	export let forsale;
	export let preview = false;

    // let count = forsale.count;
	// console.log({count})
    let sending = false;
	let at_end = false;

	let scrollHeight;
	let innerHeight;

	$: formatted = formatThings(forsale)
	$: elements = []
	$: lastElementTop = elements.length > 0 ? elements[elements.length -1]?.offsetTop : null
	$: lastElementOffsetHeight = elements.length > 0 ? elements[elements.length -1]?.offsetHeight : null
	$: visibleHeight = scrollHeight + innerHeight
	$: checker = !preview ? checkGetMore(elements) : null

	const checkGetMore = () => {
    	if (lastElementTop === null || lastElementOffsetHeight === null || preview) return
		if (visibleHeight > lastElementTop - (lastElementOffsetHeight * 4)) getMore()
	}

    const getMore = async () => {
		if (at_end) return
    	if (sending) return;
		sending = true;
		const things = await fetchThings(getThingsForSaleUidsQuery(10, formatted.length))
		console.log(things)
		sending = false;
		formatted = [...formatted, ...formatThings(things)]
		if (!things.length) at_end = true
	}

	const updateThing = (e) => {
    	const { updates, index } = e.detail
    	updateInfo(formatted[index], updates)
		formatted = [...formatted].filter(thing => thing['price_amount'] > 0)
	}

</script>

<style>
	.section-title {
		font-size: var(--font-size-2xl, 1.5rem);
		font-weight: var(--font-weight-semibold, 600);
		color: var(--color-text-primary);
		margin-top: var(--space-lg, 32px);
		margin-bottom: var(--space-md, 12px);
		text-align: center;
		padding-bottom: var(--space-md, 12px);
		border-bottom: 1px solid var(--color-border-secondary);
	}
	.card-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: var(--space-md, 16px);
		margin-bottom: var(--space-lg, 24px);
	}
	
	.center-btn {
		display: flex;
		justify-content: center;
		margin: var(--space-lg, 24px) 0;
	}
	
	.empty-state {
		grid-column: 1 / -1;
		text-align: center;
		padding: var(--space-lg, 24px);
		background-color: var(--color-background-secondary);
		border-radius: var(--border-radius, 8px);
		color: var(--color-text-secondary);
	}
	
	@media (max-width: 768px) {
		.card-grid {
			grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		}
	}
	
	@media (max-width: 480px) {
		.card-grid {
			grid-template-columns: 1fr;
		}
	}
</style>

<h2 class="section-title">For Sale</h2>

<div class="card-grid">
    {#if formatted.length === 0}
        <div class="empty-state">
            No NFTs currently for sale
        </div>
    {:else}
        {#each formatted as thingInfo, index}
            <div 
                in:scale="{{duration: 200, delay: 0, opacity: 0, start: 0.75, easing: quintOut}}"
                bind:this={elements[index]}
            >
                <NFTCard
                    pixels={thingInfo.frames}
                    pixelSize={7}
                    frameNum={0}
                    title={thingInfo.name || 'Untitled NFT'}
                    description={thingInfo.description || ''}
                    creatorName={thingInfo.creator || 'Unknown Creator'}
                    ownerName={thingInfo.owner}
                    currentBid={thingInfo.price_amount || 0}
                    currencySymbol={config.currencySymbol}
                    updateInfo={(updates) => {
                        updateInfo(formatted[index], updates);
                        formatted = [...formatted].filter(thing => thing['price_amount'] > 0);
                    }}
                    href={`./frames/${thingInfo.uid}`}
                    {thingInfo}
                />
            </div>
        {/each}
    {/if}
</div>

{#if preview}
	<div class="center-btn">
		<Button href="forsale" variant="primary-medium" size="md">Browse All For Sale</Button>
	</div>
{:else}
	{#if !at_end}
		<div class="center-btn">
			<Button variant="secondary-medium" size="md" on:click={getMore} disabled={sending}>
				{sending ? 'Loading...' : 'Load More'}
			</Button>
		</div>
	{/if}
{/if}

<svelte:window bind:scrollY={scrollHeight} bind:innerHeight={innerHeight} on:scroll={!preview ? checkGetMore : null}/>
