<script>

    // Misc
    import { userAccount, showModal, released, tauPrice, auctions } from '../js/stores.js'
    import { stringToFixed, toBigNumber } from '../js/utils.js'
    import { config, featureLocks } from '../js/config.js'

    // Pictures
    import LamdenLogoIcon from '../../static/img/lamden_logo_new.svg'

    // Components
    import FormSell from './FormSell.svelte'
    import FormBuy from './FormBuy.svelte'
    import FormAuctionCreate from './FormAuctionCreate.svelte'
    import Button from './Button.svelte'

    export let thingInfo
    export let updateInfo
    export let compact = false // For more compact display if needed

    $: price = toBigNumber(thingInfo.price_amount)
    $: usdPrice = price.isGreaterThan(0) ? price.multipliedBy($tauPrice) : false
    $: auctionFeatureLocked = featureLocks.auctions.locked

    const openModal = (modal) => {
        console.log({thingInfo, modal, updateInfo})
        showModal.set({modalData:{thingInfo, modal: modal, updateInfo}, show:true})
    }

</script>

<div class="price-container {compact ? 'compact' : ''}">
    {#if price.isGreaterThan(0)}
        <div class="price-display">
            <div class="price-amount">
                <span class="currency-symbol">{config.currencySymbol}</span>
                <span class="amount">{stringToFixed(price, 8)}</span>
                {#if usdPrice && !usdPrice.isNaN()}
                    <span class="usd-price">(${usdPrice.toFixed(2)})</span>
                {/if}
            </div>

            {#if $userAccount && !compact}
                <div class="price-actions">
                    {#if thingInfo.owner !== $userAccount}
                        <Button 
                            variant="secondary-small" 
                            on:click={() => openModal(FormBuy)}
                            size="xs">
                            Buy
                        </Button>
                    {:else}
                        <Button 
                            variant="secondary-medium" 
                            on:click={() => openModal(FormSell)}
                            size="xs">
                            Set Price
                        </Button>
                    {/if}
                </div>
            {/if}
        </div>
    {:else}
        <div class="not-for-sale">
            {#if thingInfo.owner !== $userAccount}
                <span class="not-for-sale-text">Not for sale</span>
            {:else if $userAccount && !compact}
                <div class="price-actions">
                    <Button 
                        variant="secondary-small" 
                        on:click={() => openModal(FormSell)}
                        size="xs">
                        List for Sale
                    </Button>
                    
                    {#if auctionFeatureLocked && featureLocks.auctions.whitelist.includes($userAccount)}
                        <Button 
                            variant="secondary-small" 
                            on:click={() => openModal(FormAuctionCreate)}
                            size="xs">
                            Start Auction
                        </Button>
                    {/if}
                </div>
            {/if}
        </div>
    {/if}
</div>

<style>
    .price-container {
        width: 100%;
    }

    .price-display {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: var(--space-sm, 8px);
    }

    .price-amount {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: var(--space-xs, 4px);
    }

    .currency-symbol {
        font-weight: var(--font-weight-semibold, 600);
        color: var(--color-text-primary);
        margin-right: var(--space-xs, 4px);
    }

    .amount {
        font-weight: var(--font-weight-bold, 700);
        color: var(--color-text-primary);
        font-size: var(--font-size-sm);
    }

    .usd-price {
        color: var(--color-text-secondary, #666);
        font-size: var(--font-size-xs);
        margin-left: var(--space-xs, 4px);
    }

    .not-for-sale {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .not-for-sale-text {
        color: var(--color-text-secondary, #666);
        font-style: italic;
        font-size: var(--font-size-xs);
    }

    .price-actions {
        display: flex;
        gap: var(--space-sm, 8px);
    }

    /* Compact mode for use in NFT cards */
    .compact .price-display,
    .compact .not-for-sale {
        justify-content: flex-start;
    }

    .compact .amount {
        font-size: var(--font-size-sm);
    }

    .compact .usd-price {
        font-size: calc(var(--font-size-xs) * 0.95);
    }
</style>







