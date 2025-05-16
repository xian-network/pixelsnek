<script>
    import {getContext, onMount, tick} from 'svelte';

    // Misc
    import {userAccount, showModal} from '../js/stores.js';
    import { config } from '../js/config.js';
    import {createWatermark, formatAccountAddress} from '../js/utils.js';
    import {alreadyLiked, createSnack} from '../js/store-utils.js'

    // Components
    import FormGive from './FormGive.svelte'
    import SalesHistory from './SalesHistory.svelte'
    import FrameCanvas from './FrameCanvas.svelte';
    import Price from './Price.svelte';
    import Likes from './Likes.svelte'
    import OwnerControls from './OwnerControls.svelte'
    import Auction from './Auction.svelte';
    import Button from './Button.svelte';
    // import AuctionBidHistory from './AuctionBidHistory.svelte';

    // Pictures
    import SocialButtons from "./SocialButtons.svelte";
    import { compute_rest_props } from 'svelte/internal';

    const {sendTransaction} = getContext('app_functions')

    export let thingInfo;
    export let auctionInfo;

    //console.log({thingInfo, auctionInfo})
    export let salesHistory;
    export let pixelSize = 17;
    export let updateInfo

    let frames = thingInfo.frames
    let switcher;
    let liked = null;
    let currentFrame = 1;

    onMount(() => {
        if (window.location.hash){
            scrollToHash(window.location.hash.replace("#", "").toUpperCase())
        }
        //console.log(window.location)
        checkAlreadyLiked()
        switcher = setInterval(switchFrames, Number(thingInfo.speed))
        return (() => clearInterval((switcher)))
    })

    async function scrollToHash(hash){
        await tick()
        let elm = document.getElementById(hash)
        if (elm) setTimeout(() => elm.scrollIntoView(), 1);
    }

    const openModal = (modal) => {
        showModal.set({modalData:{thingInfo, modal: modal, updateInfo}, show:true})
    }

    const checkAlreadyLiked = () => {
        if (liked === null && $userAccount) {
            alreadyLiked(thingInfo.uid, localStorage).then(res => {
                //console.log(res)
                liked = res
            })
        }
    }

    const switchFrames = () => {
        if (currentFrame >= frames.length) currentFrame = 1;
        else currentFrame = currentFrame === frames.length ? 1 : currentFrame + 1;
    }

    const like = () => {
        const transaction = {
            methodName: 'like_thing',
            networkType: config.networkType,
            kwargs: {
                uid: thingInfo.uid
            }
        }

        createSnack({
            title: `Liking ${thingInfo.name}`,
            body: "Please approve the Xian Wallet transaction popup.",
            type: "info"
        })

        sendTransaction(transaction)
    }

    userAccount.subscribe(account => checkAlreadyLiked())
</script>

<div class="nft-detail-page">
    <h1 class="nft-title">{thingInfo.name}</h1>
    
    <div class="nft-content">
        <div class="nft-preview-section">
            <div class="nft-frame-container">
                <a rel="prefetch noopener noreferrer" href="{'gif/'+ thingInfo.uid + '.gif'}" target="_blank" class="frame-link">
                    {#if frames.length >= currentFrame}
                        <FrameCanvas {pixelSize} pixels={frames[currentFrame - 1]} id={thingInfo.id} watermark={createWatermark(thingInfo, $userAccount)} />
                    {/if}
                    {#if frames.length > 1}
                        <div class="animation-indicator">
                            <span>{currentFrame}/{frames.length}</span>
                        </div>
                    {/if}
                </a>
            </div>
            
            <div class="nft-actions">
                <div class="action-row">
                    <div class="likes-container">
                        <Likes {thingInfo}/>
                    </div>
                    <div class="price-container">
                        <Price {thingInfo} {updateInfo}/>
                    </div>
                </div>
                
                <!-- <div class="owner-controls">
                    <OwnerControls {thingInfo} owner="" />
                </div> -->
            </div>
        </div>
        
        <div class="nft-details-section">
            <div class="details-card">
                <div class="detail-item">
                    <span class="detail-label">Name</span>
                    <span class="detail-value">{thingInfo.name}</span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label">Description</span>
                    <p class="detail-value description">{thingInfo.description}</p>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label">ID</span>
                    <span class="detail-value">{formatAccountAddress(thingInfo.uid, 8, 4)}</span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label">Current Owner</span>
                    <a href="{`/profile/${thingInfo.owner}`}" class="detail-value link">
                        {formatAccountAddress(thingInfo.owner, 8, 4)}
                    </a>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label">Creator</span>
                    <a href="{`/profile/${thingInfo.creator}`}" class="detail-value link">
                        {formatAccountAddress(thingInfo.creator, 8, 4)}
                    </a>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label">Date Created</span>
                    <span class="detail-value">{new Date(thingInfo.created).toLocaleString()}</span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label">Frame Speed</span>
                    <span class="detail-value">{thingInfo.speed}ms</span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label">Number of Frames</span>
                    <span class="detail-value">{thingInfo.num_of_frames}</span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label">Current Price</span>
                    <div class="detail-value price-value">
                        <Price {thingInfo} {updateInfo}/>
                    </div>
                </div>
                
                {#if thingInfo['price_amount'] > 0 && thingInfo['price_hold'] !== ""}
                    <div class="detail-item">
                        <span class="detail-label">Hold Status</span>
                        <span class="detail-value">Currently held for buyer: {thingInfo['price_hold']}</span>
                    </div>
                {/if}
                
                {#if thingInfo.owner === $userAccount}
                    <div class="gift-button-container">
                        <Button variant="primary" on:click={() => openModal(FormGive)}>
                            Gift This NFT
                        </Button>
                    </div>
                {/if}
                
                <div class="social-buttons-container">
                    <SocialButtons {thingInfo}/>
                </div>
            </div>
        </div>
    </div>
    
    {#if auctionInfo}
        <div class="auction-section" id="AUCTION">
            <h2 class="section-title">Active Auction</h2>
            <div class="auction-container">
                <Auction {auctionInfo} {thingInfo} showInfo={false}/>
            </div>
        </div>
    {/if}
    
    <div class="sales-history-section">
        <!-- <SalesHistory {salesHistory}/> -->
    </div>
</div>

<style>
    .nft-detail-page {
        margin: 0 auto;
        max-width: 1200px;
    }
    
    .nft-title {
        font-size: 3rem;
        font-weight: var(--font-weight-bold, 700);
        color: var(--color-text-primary);
        text-align: center;
        margin: 2rem 0;
        line-height: 1.2;
    }
    
    .nft-content {
        display: grid;
        grid-template-columns: 1fr;
        gap: var(--space-xl, 24px);
    }
    
    @media (min-width: 992px) {
        .nft-content {
            grid-template-columns: 1fr 1fr;
        }
    }
    
    .nft-preview-section {
        display: flex;
        flex-direction: column;
        gap: var(--space-md, 12px);
    }
    
    .nft-frame-container {
        position: relative;
        border-radius: var(--border-radius, 8px);
        overflow: hidden;
        background-color: var(--color-background-secondary, #f5f5f5);
        border: 1px solid var(--color-border-secondary, #e0e0e0);
    }
    
    .frame-link {
        display: block;
        line-height: 0;
    }
    
    .animation-indicator {
        position: absolute;
        bottom: 8px;
        right: 8px;
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        border-radius: 12px;
        padding: 2px 6px;
        font-size: 10px;
        z-index: 10;
    }
    
    .nft-actions {
        display: flex;
        flex-direction: column;
        gap: var(--space-md, 12px);
    }
    
    .action-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--space-sm, 8px) 0;
        border-bottom: 1px solid var(--color-border-secondary, #e0e0e0);
    }
    
    .nft-details-section {
        display: flex;
        flex-direction: column;
        gap: var(--space-md, 12px);
    }
    
    .details-card {
        background-color: var(--color-background-secondary, #f5f5f5);
        border-radius: var(--border-radius, 8px);
        padding: var(--space-lg, 16px);
        border: 1px solid var(--color-border-secondary, #e0e0e0);
    }
    
    .detail-item {
        display: flex;
        flex-direction: column;
        gap: var(--space-xs, 4px);
        margin-bottom: var(--space-md, 12px);
        padding-bottom: var(--space-md, 12px);
        border-bottom: 1px solid var(--color-border-secondary, #e0e0e0);
    }
    
    .detail-item:last-of-type {
        border-bottom: none;
        margin-bottom: 0;
    }
    
    .detail-label {
        font-size: var(--font-size-sm, 0.875rem);
        font-weight: var(--font-weight-semibold, 600);
        color: var(--color-text-secondary, #666);
    }
    
    .detail-value {
        font-size: var(--font-size-base, 1rem);
        color: var(--color-text-primary, #333);
        word-break: break-word;
        line-height: 1.5;
    }
    
    .description {
        margin: 0;
        white-space: pre-line;
    }
    
    .price-value {
        display: flex;
        align-items: center;
    }
    
    .link {
        color: var(--color-primary);
        text-decoration: none;
        transition: color 0.2s ease;
    }
    
    .link:hover {
        color: var(--color-primary-dark);
        text-decoration: underline;
    }
    
    .gift-button-container {
        margin: var(--space-md, 12px) 0;
        display: flex;
        justify-content: center;
    }
    
    .social-buttons-container {
        margin-top: var(--space-md, 12px);
        display: flex;
        justify-content: center;
    }
    
    .auction-section {
        margin-top: var(--space-xl, 24px);
        padding-top: var(--space-xl, 24px);
        border-top: 1px solid var(--color-border-secondary, #e0e0e0);
    }
    
    .section-title {
        font-size: var(--font-size-2xl, 1.5rem);
        font-weight: var(--font-weight-semibold, 600);
        color: var(--color-text-primary);
        margin-bottom: var(--space-md, 12px);
        text-align: center;
    }
    
    .auction-container {
        background-color: var(--color-background-secondary, #f5f5f5);
        border-radius: var(--border-radius, 8px);
        padding: var(--space-lg, 16px);
        border: 1px solid var(--color-border-secondary, #e0e0e0);
        display: flex;
        justify-content: center;
    }
    
    .sales-history-section {
        margin-top: var(--space-xl, 24px);
    }
    
    /* Fix for FrameCanvas to ensure it fills container */
    :global(.nft-frame-container canvas) {
        width: 100% !important;
        height: auto !important;
        max-width: 100%;
        display: block;
    }
</style>

