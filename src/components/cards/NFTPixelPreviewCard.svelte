<script>
  export let pixels = []; // Array of pixel colors, similar to Frame.svelte
  export let pixelSize = 5; // Default pixel size
  export let title = ''; // Optional title displayed below or on hover
  export let linkUrl = '#'; // URL the card links to
</script>

<a href={linkUrl} class="nft-pixel-preview-card {$$props.class || ''}" aria-label={title || 'NFT Pixel Art Preview'}>
  <div class="preview-container">
    <div class="pixel-board"
         style={`grid-template-columns: repeat(16, ${pixelSize}px); grid-template-rows: repeat(16, ${pixelSize}px);`}>
      {#each pixels as pixel}
        <div class="pixel" style={`background: ${pixel}`} />
      {/each}
    </div>
    
    {#if title}
      <div class="preview-title-overlay">{title}</div>
    {/if}
  </div>
</a>

<style>
  .nft-pixel-preview-card {
    display: block;
    border-radius: 0; /* Keeping with pixelated aesthetic */
    overflow: hidden;
    background-color: var(--color-background-tertiary);
    border: 1px solid var(--color-border-secondary);
    transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
    text-decoration: none;
    font-family: 'Medodica', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  .nft-pixel-preview-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
    border-color: var(--color-border-primary);
  }
  
  .nft-pixel-preview-card:focus-visible {
    outline: 2px solid var(--color-primary-accent);
    outline-offset: 2px;
  }

  .preview-container {
    width: 100%;
    padding-top: 100%; /* Square aspect ratio */
    position: relative;
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

  .preview-title-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    padding: var(--space-xs) var(--space-sm);
    font-size: var(--font-size-xs);
    text-align: center;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .nft-pixel-preview-card:hover .preview-title-overlay {
    opacity: 1;
  }
</style> 