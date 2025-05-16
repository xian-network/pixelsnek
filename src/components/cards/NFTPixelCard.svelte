<script>
  import Icon from '../Icon.svelte';
  import Button from '../Button.svelte';

  // Similar NFT props as the existing NFTCard
  export let pixels = []; // Array of pixel colors, similar to Frame.svelte
  export let pixelSize = 5; // Default pixel size
  export let title = 'NFT Title';
  export let collectionName = ''; // Optional
  export let creatorAvatarUrl = '';
  export let creatorName = 'Creator Name';
  export let currentBid = 0;
  export let currencySymbol = 'XIAN';
  export let timeLeft = '00:00:00';
  export let onBidClick = () => {};
  export let onInfoClick = null; // Optional info click handler
  export let href = ''; // Link for the whole card or title

  // Example icon path (replace if needed)
  const currencyIconPath = "M17.25 6.75a.75.75 0 00-1.5 0v1.5h-1.5a.75.75 0 000 1.5h1.5v1.5a.75.75 0 001.5 0v-1.5h1.5a.75.75 0 000-1.5h-1.5V6.75zM9 6a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM5.25 7.5A.75.75 0 004.5 6A.75.75 0 003.75 7.5v1.5c0 .769.44 1.433 1.086 1.749l-.31 1.24A1.5 1.5 0 006.453 13.5H8.25a.75.75 0 000-1.5H6.453l.233-.932A1.875 1.875 0 007.5 10.5h1.5a.75.75 0 000-1.5h-1.5A1.875 1.875 0 005.25 7.5zm5.25 6a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM11.25 15A.75.75 0 0010.5 13.5A.75.75 0 009.75 15v1.5c0 .769.44 1.433 1.086 1.749l-.31 1.24A1.5 1.5 0 0011.953 21h1.797a.75.75 0 000-1.5h-1.797l.233-.932A1.875 1.875 0 0013.5 18h1.5a.75.75 0 000-1.5h-1.5a1.875 1.875 0 00-2.25-1.5V15z";
  const infoIconPath = "M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z";

  // Basic formatting for bid amount (can be improved)
  $: formattedBid = currentBid.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 });

  function handleBidClick(event) {
      event.stopPropagation();
      event.preventDefault(); 
      onBidClick(event);
  }

  function handleInfoClick(event) {
      event.stopPropagation();
      event.preventDefault(); 
      if (onInfoClick) {
        onInfoClick(event);
      }
  }
</script>

<div class="nft-card {$$props.class || ''}">
  <a href={href || '#'} class="card-link-wrapper" aria-label="View details for {title}">
    <div class="card-image-container">
      <div class="pixel-board"
           style={`grid-template-columns: repeat(16, ${pixelSize}px); grid-template-rows: repeat(16, ${pixelSize}px);`}>
        {#each pixels as pixel}
          <div class="pixel" style={`background: ${pixel}`} />
        {/each}
      </div>
    </div>

    <div class="card-content">
      <div class="card-header">
        <h3 class="card-title">{title}</h3>
        {#if onInfoClick}
          <button type="button" class="info-button" on:click={handleInfoClick} aria-label="More info about {title}">
            <Icon path={infoIconPath} size="1.25em" />
          </button>
        {/if}
      </div>
      {#if collectionName}
        <p class="card-collection">{collectionName}</p>
      {/if}
      
      <div class="card-creator">
        {#if creatorAvatarUrl}
          <img src={creatorAvatarUrl} alt="{creatorName}" class="creator-avatar" loading="lazy" />
        {:else}
          <div class="creator-avatar-placeholder"></div>
        {/if}
        <span class="creator-name">{creatorName}</span>
      </div>

      <div class="card-details">
        <div class="detail-item bid-item">
          <span class="detail-label">Current Bid</span>
          <span class="detail-value bid-value">
            <Icon path={currencyIconPath} size="1em" />
            {formattedBid} {currencySymbol}
          </span>
        </div>
        <div class="detail-item time-item">
          <span class="detail-label">Ending In</span>
          <span class="detail-value time-value">{timeLeft}</span>
        </div>
      </div>
    </div>
  </a>
  
  <div class="card-actions">
     <Button variant="primary-m" class="bid-button" on:click={handleBidClick}>Bid</Button>
  </div>
</div>

<style>
  .nft-card {
    background-color: var(--color-background-primary);
    border: 1px solid var(--color-border-secondary);
    border-radius: 0; /* Removed for pixelated look */
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-md);
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    max-width: 100%;
    width: 100%;
    font-family: 'Medodica', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  .nft-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
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
    width: 100%;
    padding-top: 100%; /* Creates a perfect square */
    position: relative;
    overflow: hidden;
    border-radius: 0; /* Removed for pixelated look */
    background-color: var(--color-background-secondary);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Pixel grid styling from Frame.svelte */
  .pixel-board {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: grid;
    width: max-content;
    border: 2px solid var(--color-border-secondary);
  }

  .pixel {
    width: 100%;
    height: 100%;
  }

  .card-content {
    padding: var(--space-md);
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
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    margin: 0;
  }

  .info-button {
    background: none;
    border: none;
    padding: 0;
    margin-left: var(--space-sm);
    color: var(--color-text-tertiary);
    cursor: pointer;
    flex-shrink: 0;
  }
  
  .info-button:hover {
    color: var(--color-text-primary);
  }
   
  .info-button:focus-visible {
     outline: 2px solid var(--color-primary-accent);
     outline-offset: 1px;
     border-radius: 50%;
  }

  .card-collection {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin: 0 0 var(--space-sm) 0;
  }

  .card-creator {
    display: flex;
    align-items: center;
    margin-bottom: var(--space-md);
  }

  .creator-avatar, .creator-avatar-placeholder {
    width: 24px;
    height: 24px;
    border-radius: 0; /* Removed for pixelated look */
    margin-right: var(--space-xs);
    object-fit: cover;
    background-color: var(--color-background-tertiary);
  }

  .creator-name {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto; /* Push details and actions to bottom */
    padding-top: var(--space-sm);
    border-top: 1px solid var(--color-border-secondary);
    gap: var(--space-md);
  }

  .detail-item {
    display: flex;
    flex-direction: column;
  }

  .detail-label {
    font-size: var(--font-size-xs);
    color: var(--color-text-tertiary);
    margin-bottom: 2px;
    text-transform: uppercase;
  }

  .detail-value {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-primary);
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }

  .card-actions {
    padding: 0 var(--space-md) var(--space-md);
  }

  .bid-button {
    width: 100%;
  }
</style> 