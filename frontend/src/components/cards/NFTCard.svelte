<script>
  import Icon from '../Icon.svelte';
  import Button from '../Button.svelte';
  import FrameCanvas from '../FrameCanvas.svelte';
  import Likes from '../Likes.svelte';
  import FormSell from '../FormSell.svelte';
  import FormBuy from '../FormBuy.svelte';
  import FormAuctionCreate from '../FormAuctionCreate.svelte';
  import { createWatermark } from '../../js/utils.js';
  import { userAccount, tauPrice, showModal } from '../../js/stores.js';
  import { config, featureLocks } from '../../js/config.js';
  import { onMount, onDestroy } from 'svelte';

  // Import owner icon
  import OwnerIcon from '../../../static/img/owner.svg';
  import ArtistIcon from '../../../static/img/artist.svg';

  export let pixels = []; // Array of pixel colors for Frame component
  export let pixelSize = 5; // Default pixel size
  export let frameNum = 0; // For frame selection in animations
  export let frameDuration = 200; // Only used as fallback if thingInfo.speed is not available
  export let title = 'NFT Title';
  export let description = ''; // Description text for the NFT
  export let collectionName = ''; // Optional
  export let creatorAvatarUrl = '';
  export let creatorName = 'Creator Name';
  // The current owner address (should be set to thingInfo.owner by the parent)
  export let ownerName = '';
  export let currentBid = 0;
  export let currencySymbol = 'XIAN';
  export let timeLeft = '00:00:00';
  export let onBidClick = () => {};
  export let onSellClick = () => {};
  export let href = ''; // Link for the whole card or title
  export let thingInfo = null; // Pass the full thingInfo for likes functionality
  export let updateInfo = (updates) => {}; // Callback to update the NFT's info after actions

  // Animation state
  let currentFrame = 1; // Change to 1-indexed for consistency with DisplayFrames
  let animationInterval;
  let isAnimating = false;
  let totalFrames = 0;
  let isHovering = false;
  
  // Set up animation when component mounts
  onMount(() => {
    if (pixels && Array.isArray(pixels) && pixels.length > 1) {
      totalFrames = pixels.length;
      startAnimation();
    }
    return () => stopAnimation(); // Ensure cleanup on destruction
  });
  
  // Clean up on component destruction - keeping this as a safety measure
  onDestroy(() => {
    stopAnimation();
  });
  
  function startAnimation() {
    if (!isAnimating && totalFrames > 1) {
      isAnimating = true;
      // Use thingInfo.speed if available, otherwise fallback to frameDuration prop
      const speed = thingInfo && thingInfo.speed ? Number(thingInfo.speed) : frameDuration;
      
      animationInterval = setInterval(() => {
        // Match the DisplayFrames.svelte logic for frame switching
        if (currentFrame >= totalFrames) {
          currentFrame = 1;
        } else {
          currentFrame += 1;
        }
      }, speed);
    }
  }
  
  function stopAnimation() {
    if (animationInterval) {
      clearInterval(animationInterval);
      animationInterval = null;
      isAnimating = false;
    }
  }
  
  // Start animation on hover, stop when not hovering (optional)
  function handleMouseEnter() {
    isHovering = true;
    if (!isAnimating) {
      startAnimation();
    }
  }
  
  function handleMouseLeave() {
    isHovering = false;
    // Uncomment if you want animation to pause when not hovering
    // stopAnimation();
  }

  // Example icon path (replace if needed)
  const currencyIconPath = "M17.25 6.75a.75.75 0 00-1.5 0v1.5h-1.5a.75.75 0 000 1.5h1.5v1.5a.75.75 0 001.5 0v-1.5h1.5a.75.75 0 000-1.5h-1.5V6.75zM9 6a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM5.25 7.5A.75.75 0 004.5 6A.75.75 0 003.75 7.5v1.5c0 .769.44 1.433 1.086 1.749l-.31 1.24A1.5 1.5 0 006.453 13.5H8.25a.75.75 0 000-1.5H6.453l.233-.932A1.875 1.875 0 007.5 10.5h1.5a.75.75 0 000-1.5h-1.5A1.875 1.875 0 005.25 7.5zm5.25 6a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM11.25 15A.75.75 0 0010.5 13.5A.75.75 0 009.75 15v1.5c0 .769.44 1.433 1.086 1.749l-.31 1.24A1.5 1.5 0 0011.953 21h1.797a.75.75 0 000-1.5h-1.797l.233-.932A1.875 1.875 0 0013.5 18h1.5a.75.75 0 000-1.5h-1.5a1.875 1.875 0 00-2.25-1.5V15z";

  // Basic formatting for bid amount
  $: formattedBid = (() => {
    console.log("NFTCard price debug:", { 
      currentBid, 
      thingInfo: thingInfo ? {
        name: thingInfo.name,
        price: thingInfo.price,
        price_amount: thingInfo.price_amount
      } : null
    });
    
    const num = Number(currentBid);
    if (isNaN(num)) return '0'; // Default for invalid numbers

    let fixedStr = num.toFixed(2);
    if (fixedStr.endsWith('.00')) {
      return fixedStr.slice(0, -3); // Remove .00
    } else if (fixedStr.endsWith('0')) {
      return fixedStr.slice(0, -1); // Remove trailing 0
    }
    return fixedStr;
  })();

  // Calculate USD equivalent
  $: usdPrice = currentBid > 0 ? (currentBid * $tauPrice).toFixed(2) : '0.00';

  $: isForSale = Number(currentBid) > 0;
  
  // Check if current user is the owner
  $: isOwner = $userAccount && ownerName === $userAccount;
  $: auctionFeatureLocked = featureLocks?.auctions?.locked;

  function handleBuyClick(event) {
    event.stopPropagation();
    event.preventDefault();
    if (thingInfo) {
      showModal.set({
        show: true,
        type: "buy", 
        modalData: {
          thingInfo,
          modal: FormBuy,
          updateInfo
        }
      });
    }
  }

  function handleSellClick(event) {
    event.stopPropagation();
    event.preventDefault();

    if (thingInfo) {
      showModal.set({
        show: true,
        type: "sell",
        modalData: {
          thingInfo,
          modal: FormSell,
          updateInfo
        }
      });
    }
  }
  
  function handleAuctionClick(event) {
    event.stopPropagation();
    event.preventDefault();
    
    if (thingInfo) {
      showModal.set({
        show: true,
        type: "auction",
        modalData: {
          thingInfo,
          modal: FormAuctionCreate,
          updateInfo
        }
      });
    }
  }

  // Create watermark for the frame
  $: watermark = createWatermark({ title, creatorName }, $userAccount);
  
  // Calculate the array index (0-based) from the 1-based currentFrame
  $: frameIndex = currentFrame - 1;

  // Helper to truncate addresses
  function truncateAddress(addr) {
    if (!addr || addr.length <= 12) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }

  // Helper to truncate description to 70 chars, not breaking words, add ...
  function truncateDescription(desc) {
    if (!desc) return '';
    if (desc.length <= 70) return desc;
    let truncated = desc.slice(0, 70);
    // If the last character is not a space, backtrack to the last space
    if (desc[70] && desc[70] !== ' ') {
      const lastSpace = truncated.lastIndexOf(' ');
      if (lastSpace > 0) truncated = truncated.slice(0, lastSpace);
    }
    return truncated.trim() + '...';
  }

</script>

<div class="nft-card {$$props.class || ''}" 
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
>
  {#if thingInfo}
    <div class="likes-button-wrapper">
      <div 
        class="likes-button"
        on:click|stopPropagation={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Likes {thingInfo} width={14} />
      </div>
    </div>
  {/if}
  
  <a href={href || '#'} class="card-link-wrapper" aria-label="View details for {title}">
    <div class="card-image-container">
      {#if pixels && pixels.length > 0}
        <div class="frame-wrapper">
          <FrameCanvas 
            pixels={pixels[frameIndex]} 
            {pixelSize} 
            {watermark}
            style="width: 100%; height: 100%; object-fit: contain;"
          />
          {#if pixels.length > 1}
            <div class="animation-indicator">
              <span>{currentFrame}/{pixels.length}</span>
            </div>
          {/if}
        </div>
      {:else}
        <div class="card-image-placeholder">No Image</div>
      {/if}
    </div>

    <div class="card-content">
      <div class="card-header">
        <h3 class="card-title">{title}</h3>
      </div>
      
      {#if description}
        <div class="card-description">
          <p>{truncateDescription(description)}</p>
        </div>
      {/if}
      
      <div class="card-creator">
        {#if creatorAvatarUrl}
          <img src={creatorAvatarUrl} alt="{creatorName}" class="creator-avatar" loading="lazy" />
        {:else}
          <div class="creator-avatar-placeholder">
            <ArtistIcon width="16" fill="var(--color-text-link)" />
          </div>
        {/if}
        <span class="creator-label">Creator:</span>
        <a class="creator-name creator-link" href={`/profile/${creatorName}`} tabindex="0">{truncateAddress(creatorName)}</a>
      </div>

      {#if ownerName}
      <div class="card-owner">
        <div class="owner-avatar-placeholder">
          <OwnerIcon width="16" fill="var(--color-text-link)" />
        </div>
        <span class="owner-label">Owner:</span>
        <a class="owner-name owner-link" href={`/profile/${ownerName}`} tabindex="0">{truncateAddress(ownerName)}</a>
      </div>
      {/if}

      <div class="price-info">
        {#if isForSale}
          <div class="price-display">
            <span class="price-amount">{formattedBid} {currencySymbol}</span>
            <span class="price-usd">(${usdPrice} USD)</span>
          </div>
        {:else}
          <div class="price-placeholder">
            <span>Not Listed</span>
          </div>
        {/if}
      </div>
    </div>
  </a>
  
  <div class="card-actions">
    {#if isForSale}
      {#if isOwner}
        <!-- Owner sees Set Price button even when NFT is for sale -->
        <Button
          variant="secondary-medium"
          size="xs"
          on:click={handleSellClick}
          class="full-width-button"
        >
          Set Price
        </Button>
      {:else if $userAccount}
        <!-- Non-owners see Buy button -->
        <Button
          variant="secondary-medium"
          size="xs"
          on:click={handleBuyClick}
          class="full-width-button"
        >
          Buy
        </Button>
      {:else}
        <!-- No user account -->
        <Button
          variant="secondary-medium"
          size="xs"
          disabled
          class="full-width-button"
        >
          Connect Wallet to Buy
        </Button>
      {/if}
    {:else}
      {#if isOwner && $userAccount}
        <Button
          variant="secondary-medium"
          size="xs"
          on:click={handleSellClick}
          class="full-width-button"
        >
          List for Sale
        </Button>
      {:else}
        <!-- Non-owner sees Unlisted button -->
        <Button
          variant="secondary-medium"
          size="xs"
          disabled
          class="full-width-button"
        >
          Unlisted
        </Button>
      {/if}
    {/if}
  </div>
</div>

<style>
  .nft-card {
    background-color: var(--color-background-primary);
    border: 1px solid var(--color-border-secondary);
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: none; /* Remove default shadow */
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    max-width: 300px; /* Reduce max width */
    width: 100%;
    margin: 0 auto; /* Center the card */
    position: relative;
  }

  .nft-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 24px 0 rgba(128, 90, 255, 0.6);
    border-color: var(--color-border-primary);
  }

  .card-link-wrapper {
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
  .card-link-wrapper:focus-visible {
     outline: 2px solid var(--color-primary-accent);
     outline-offset: 2px;
     border-radius: 12px;
  }

  .card-image-container {
    position: relative;
    width: 100%;
    padding-top: 100%;
    background: var(--color-background-primary);
    border-radius: 16px 16px 0 0;
    overflow: hidden;
  }

  .card-image-placeholder {
     position: absolute;
     top: 0; left: 0; width: 100%; height: 100%;
     display: flex; justify-content: center; align-items: center;
     color: var(--color-text-tertiary);
  }

  .card-content {
    padding: var(--space-sm); /* Reduce padding */
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--space-xs);
  }

  .card-title {
    font-size: var(--font-size-md); /* Reduce font size */
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    margin: 0;
    /* Allow title to wrap if needed */
  }

  .card-collection {
    font-size: var(--font-size-xs); /* Reduce font size */
    color: var(--color-text-secondary);
    margin: 0 0 var(--space-xs) 0;
  }

  .card-creator, .card-owner {
    display: flex;
    align-items: center;
    margin-bottom: var(--space-xs);
    gap: var(--space-xs);
  }

  .creator-avatar, .creator-avatar-placeholder,
  .owner-avatar-placeholder {
    width: 20px;
    height: 20px;
    border-radius: 0;
    margin-right: var(--space-xs);
    object-fit: cover;
    background-color: var(--color-background-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-link); /* This sets the color for SVG icons that inherit color */
  }

  .creator-label, .owner-label {
    font-size: var(--font-size-xs);
    color: var(--color-text-tertiary);
    font-weight: var(--font-weight-semibold);
  }

  .creator-name, .owner-name {
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  /* Price info styling */
  .price-info {
    margin-top: var(--space-sm);
    padding: var(--space-xs) 0;
    border-top: 1px solid var(--color-border-secondary);
    height: 44px; /* Fixed height for price section */
    display: flex;
    align-items: center;
  }
  
  .price-display, .price-placeholder {
    width: 100%;
    display: flex;
    align-items: baseline;
    gap: var(--space-xs);
  }
  
  .price-placeholder {
    color: var(--color-text-tertiary);
    font-style: italic;
    font-size: var(--font-size-sm);
  }
  
  .price-amount {
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
    font-size: var(--font-size-md);
  }
  
  .price-usd {
    font-size: var(--font-size-xs);
    color: var(--color-text-tertiary);
  }

  .card-actions {
    padding: var(--space-sm);
    border-top: 1px solid var(--color-border-secondary);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .full-width-button {
    width: 100%;
    max-width: 200px;
    margin: 0 auto;
    display: block;
  }

  .avatar-wrapper {
    width: 24px;
    height: 24px;
    border-radius: 0; /* Removed for pixelated look */
    overflow: hidden;
    background-color: var(--color-background-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .frame-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-background-secondary);
    /* padding: var(--space-xs); */
  }

  :global(canvas) {
    width: 100% !important;
    height: 100% !important;
    object-fit: contain;
    image-rendering: pixelated;
  }

  .creator-link, .owner-link {
    color: inherit;
    text-decoration: none;
    cursor: pointer;
    transition: text-decoration 0.15s;
  }
  
  .creator-link:hover, .creator-link:focus,
  .owner-link:hover, .owner-link:focus {
    text-decoration: underline;
    color: var(--color-text-link);
  }

  .likes-button-wrapper {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 100;
    opacity: 1 !important;
    visibility: visible !important;
    display: block !important;
    pointer-events: auto !important;
  }
  
  .likes-button {
    min-width: unset;
    padding: 6px 10px;
    border-radius: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: none;
    display: flex !important;
    align-items: center;
    justify-content: center;
    opacity: 1 !important;
    visibility: visible !important;
    color: white;
    cursor: pointer;
  }
  
  .likes-button :global(.flex-row) {
    margin: 0;
    padding: 0;
    align-items: center;
  }
  
  .likes-button :global(.show-mobile) {
    display: none !important; 
  }
  
  .likes-button :global(.icon) {
    padding: 0;
    margin-right: 4px;
    position: static;
    display: flex;
    align-items: center;
  }
  
  .likes-button :global(h2) {
    margin: 0;
    padding: 0;
    font-size: 14px;
    line-height: 1;
    font-weight: normal;
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

  .button-group {
    display: flex;
    width: 100%;
    max-width: 200px;
    gap: 8px;
    margin: 0 auto;
  }
  
  .button-group .sell-button,
  .button-group .auction-button {
    flex: 1;
  }

  /* This ensures SVGs inside the avatar placeholders use the theme color */
  :global(.creator-avatar-placeholder svg path),
  :global(.owner-avatar-placeholder svg path) {
    fill: var(--color-text-link);
  }

  .card-description {
    margin-bottom: var(--space-sm);
    color: var(--color-text-secondary);
    font-size: var(--font-size-xs);
    max-height: 60px;
    min-height: 60px;
    height: 60px;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: flex-start;
    text-overflow: ellipsis;
  }
  
  .card-description p {
    margin: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    display: block;
  }

  /* Add responsive styles at the end of the style block */
  @media (max-width: 992px) {
    .nft-card {
      max-width: 360px; /* Slightly wider on tablets */
    }
  }

  @media (max-width: 768px) {
    .nft-card {
      max-width: 90%; /* Take up most of the container width on mobile */
    }
  }

  @media (max-width: 480px) {
    .nft-card {
      max-width: 100%; /* Full width on small mobile */
    }
    
    .card-content {
      padding: var(--space-xs, 8px); /* Reduce padding to fit more content */
    }
  }
</style> 