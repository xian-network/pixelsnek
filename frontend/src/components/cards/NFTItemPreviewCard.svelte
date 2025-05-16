<script>
  export let imageUrl = '';
  export let title = ''; // Optional title displayed below or on hover
  export let linkUrl = '#'; // URL the card links to
</script>

<a href={linkUrl} class="nft-preview-card {$$props.class || ''}" aria-label={title || 'NFT Preview'}>
  <div class="preview-image-container">
    {#if imageUrl}
      <img src={imageUrl} alt={title || 'NFT Image'} class="preview-image" loading="lazy" />
    {:else}
      <div class="preview-image-placeholder">?</div>
    {/if}
    <!-- Optional: Overlay title on hover -->
    <!-- {#if title}
      <div class="preview-title-overlay">{title}</div>
    {/if} -->
  </div>
  {#if title}
    <!-- Optional: Title below image -->
    <!-- <h4 class="preview-title">{title}</h4> -->
  {/if}
</a>

<style>
  .nft-preview-card {
    display: block;
    border-radius: 8px;
    overflow: hidden;
    background-color: var(--color-background-tertiary);
    border: 1px solid transparent; /* Start transparent */
    transition: transform 0.2s ease-out, box-shadow 0.2s ease-out, border-color 0.2s ease-out;
    text-decoration: none;
  }

  .nft-preview-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
    border-color: var(--color-border-secondary);
  }
   .nft-preview-card:focus-visible {
     outline: 2px solid var(--color-primary-accent);
     outline-offset: 2px;
   }

  .preview-image-container {
    width: 100%;
    padding-top: 100%; /* Square aspect ratio */
    position: relative;
  }

  .preview-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .preview-image-placeholder {
     position: absolute;
     top: 0; left: 0; width: 100%; height: 100%;
     display: flex; justify-content: center; align-items: center;
     color: var(--color-text-tertiary);
     font-size: var(--font-size-xl);
  }

  /* Example: Title below image (Uncomment if desired) */
  /*
  .preview-title {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    padding: var(--space-xs) var(--space-sm);
    margin: 0;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  */

  /* Example: Overlay title (Uncomment if desired) */
  /*
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
  .nft-preview-card:hover .preview-title-overlay {
    opacity: 1;
  }
  */
</style> 