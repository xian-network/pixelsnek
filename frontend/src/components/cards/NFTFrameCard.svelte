<script>
  import { onMount, onDestroy } from 'svelte';
  import Icon from '../Icon.svelte';
  import Button from '../Button.svelte';
  import Frame from '../Frame.svelte';

  // Props for the NFT data
  export let pixels = []; // Array of pixel colors for Frame component
  export let pixelSize = 5; // Default pixel size
  export let frameNum = 0; // For frame selection in animations
  export let title = '';
  export let collectionName = ''; // Optional
  export let creatorName = '';
  export let currentBid = 0;
  export let currencySymbol = 'XIAN';
  export let timeLeft = '00:00:00';
  export let href = ''; // Link for the whole card or title
  export let onBidClick = () => {};
  export let onInfoClick = () => {};

  let currentFrame = 0;
  let animationInterval;
  let parsedPixels = [];

  $: {
    console.log('NFTFrameCard received pixels:', pixels);
    if (Array.isArray(pixels)) {
      parsedPixels = pixels;
      console.log('Parsed pixels:', parsedPixels);
    } else {
      console.warn('Invalid pixels data:', pixels);
      parsedPixels = [];
    }
  }

  onMount(() => {
    console.log('NFTFrameCard mounted');
    if (parsedPixels.length > 1) {
      animationInterval = setInterval(() => {
        currentFrame = (currentFrame + 1) % parsedPixels.length;
      }, 1000);
    }
  });

  onDestroy(() => {
    if (animationInterval) {
      clearInterval(animationInterval);
    }
  });

  // Basic formatting for bid amount
  $: formattedBid = currentBid.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 });

  // Example icon path (replace if needed)
  const currencyIconPath = "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z";
  const infoIconPath = "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z";

  function handleBidClick(event) {
    event.stopPropagation();
    if (typeof onBidClick === 'function') {
      onBidClick();
    }
  }

  function handleInfoClick(event) {
    event.stopPropagation();
    if (typeof onInfoClick === 'function') {
      onInfoClick();
    }
  }

  function formatBidAmount(amount) {
    // Convert string to number if needed
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return numAmount.toFixed(2);
  }
</script>

<div class="nft-card" on:click={() => window.location.href = href}>
  <div class="frame-container">
    <Frame
      pixels={parsedPixels[currentFrame]}
      pixelSize={pixelSize}
      frameNum={currentFrame}
    />
  </div>
  
  <div class="info">
    <div class="title">{title}</div>
    <div class="collection">{collectionName}</div>
    <div class="creator">by {creatorName}</div>
    
    <div class="bid-info">
      <div class="current-bid">
        <span class="label">Current Bid</span>
        <span class="amount">{formatBidAmount(currentBid)} {currencySymbol}</span>
      </div>
      <div class="time-left">
        <span class="label">Time Left</span>
        <span class="time">{timeLeft}</span>
      </div>
    </div>
    
    <div class="actions">
      <Button
        variant="primary"
        size="sm"
        on:click={handleBidClick}
      >
        Place Bid
      </Button>
      <Button
        variant="secondary"
        size="sm"
        on:click={handleInfoClick}
      >
        <Icon name="info" />
      </Button>
    </div>
  </div>
</div>

<style>
  .nft-card {
    background: var(--color-background-alt);
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.2s;
    cursor: pointer;
  }

  .nft-card:hover {
    transform: translateY(-4px);
  }

  .frame-container {
    width: 100%;
    aspect-ratio: 1;
    background: var(--color-background);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .info {
    padding: 16px;
  }

  .title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .collection {
    color: var(--color-text-secondary);
    font-size: 0.9rem;
    margin-bottom: 2px;
  }

  .creator {
    color: var(--color-text-secondary);
    font-size: 0.9rem;
    margin-bottom: 16px;
  }

  .bid-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .current-bid, .time-left {
    display: flex;
    flex-direction: column;
  }

  .label {
    color: var(--color-text-secondary);
    font-size: 0.8rem;
    margin-bottom: 4px;
  }

  .amount {
    font-weight: 600;
  }

  .time {
    color: var(--color-accent);
  }

  .actions {
    display: flex;
    gap: 8px;
  }
</style> 