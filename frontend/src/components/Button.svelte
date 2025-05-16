<script>
  import { onMount } from 'svelte';
  import Icon from './Icon.svelte';
  import { createEventDispatcher } from 'svelte';

  export let variant = 'primary-m';
  export let href = null;
  export let disabled = false;
  export let onClick = null;
  export let iconLeft = null;
  export let iconRight = null;
  export let iconSize = null;
  export let iconViewBox = '0 0 24 24';
  export let ariaLabel = null;

  let buttonElement;

  const dispatch = createEventDispatcher();

  function handleClick(event) {
    if (disabled) {
      event.preventDefault();
      return;
    }
    if (onClick) {
      onClick(event);
    }
    dispatch('click', event);
    if (buttonElement && typeof buttonElement.blur === 'function') {
      buttonElement.blur();
    }
  }

  // Determine computed icon size based on variant or explicit prop
  $: finalIconSize = iconSize ? iconSize :
    (variant === 'primary-icon' || variant === 'faded-small') ? '1.25em' :
    (variant === 'primary-m' || variant === 'secondary-m' || variant === 'primary-medium' || variant === 'secondary-medium') ? '1.125em' :
    '1em';

  // Corrected Variant classes logic
  $: variantClasses = {
    'primary-m': 'btn-primary-m',
    'primary-medium': 'btn-primary-medium',
    'secondary-m': 'btn-secondary-m',
    'secondary-medium': 'btn-secondary-medium',
    'faded-small': 'btn-faded-small',
    'primary-icon': 'btn-primary-icon',
    'text': 'btn-text',
  };
  // This is the class string that should be used by the button/anchor elements
  $: btnClasses = `btn ${variantClasses[variant] || variantClasses['primary-m']} ${disabled ? 'btn-disabled' : ''}`;

</script>

{#if href && !disabled}
  <a
    bind:this={buttonElement}
    {href}
    class={btnClasses}
    role="button"
    aria-disabled={disabled}
    on:click={handleClick}
  >
    {#if iconLeft}
      {#if typeof iconLeft === 'string'}
        <Icon path={iconLeft} size={finalIconSize} viewBox={iconViewBox} class="btn-icon icon-left" />
      {:else}
        <svelte:component this={iconLeft} size={finalIconSize} viewBox={iconViewBox} class="btn-icon icon-left" />
      {/if}
    {/if}
    <slot />
    {#if iconRight}
      {#if typeof iconRight === 'string'}
        <Icon path={iconRight} size={finalIconSize} viewBox={iconViewBox} class="btn-icon icon-right" />
      {:else}
        <svelte:component this={iconRight} size={finalIconSize} viewBox={iconViewBox} class="btn-icon icon-right" />
      {/if}
    {/if}
  </a>
{:else}
  <button
    bind:this={buttonElement}
    type="button"
    {disabled}
    class={btnClasses}
    on:click={handleClick}
  >
    {#if iconLeft}
      {#if typeof iconLeft === 'string'}
        <Icon path={iconLeft} size={finalIconSize} viewBox={iconViewBox} class="btn-icon icon-left" />
      {:else}
        <svelte:component this={iconLeft} size={finalIconSize} viewBox={iconViewBox} class="btn-icon icon-left" />
      {/if}
    {/if}
    <slot />
    {#if iconRight}
      {#if typeof iconRight === 'string'}
        <Icon path={iconRight} size={finalIconSize} viewBox={iconViewBox} class="btn-icon icon-right" />
      {:else}
        <svelte:component this={iconRight} size={finalIconSize} viewBox={iconViewBox} class="btn-icon icon-right" />
      {/if}
    {/if}
  </button>
{/if}

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: var(--space-sm) var(--space-md); /* Default padding, variants will override */
    font-family: var(--font-family-buttons);
    font-weight: var(--font-weight-medium);
    letter-spacing: 0.12em; /* Increased letter spacing for pixel font readability */
    border-radius: 0; /* Removed border radius for pixelated look */
    border: 1px solid transparent;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, color 0.2s ease-in-out, opacity 0.2s ease-in-out, transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    text-decoration: none;
    white-space: nowrap;
    font-size: var(--font-size-base); /* Default, variants will override */
    line-height: 1.2;
  }
  .btn:focus-visible {
    outline: 2px solid var(--color-primary-accent);
    outline-offset: 2px;
  }
  
  /* Base .btn-disabled styling, combined from previous .btn:disabled and .btn-primary:disabled */
  .btn-disabled { 
    background-image: none !important; /* Important to override gradient */
    background-color: var(--color-background-disabled, var(--color-text-disabled)) !important;
    border-color: var(--color-border-disabled, var(--color-text-disabled)) !important;
    color: var(--color-text-on-disabled, var(--color-background-secondary)) !important;
    box-shadow: none !important;
    opacity: 0.65 !important; 
    cursor: not-allowed !important;
    transform: none !important;
  }
  /* Ensure <a> tags styled as buttons also get disabled appearance */
  a.btn.btn-disabled {
    pointer-events: none;
  }

  /* --- Primary Button Styles --- */
  .btn-primary-m {
    background-image: linear-gradient(114deg, var(--color-primary-gradient-start, #00BBFF) -46%, var(--color-primary-gradient-end, #9C42F5) 100%);
    color: var(--color-primary-text, #FFFFFF);
    border: none; /* Primary buttons usually don't have a visible border unless it IS the gradient */
    padding: 18px 28px; /* Specific padding for M size */
    font-size: calc(var(--font-size-base) * 1.1); 
    font-weight: var(--font-weight-semibold); 
    border-radius: 0; /* Removed for pixelated look */
    box-shadow: 0 8px 8px -4px rgba(156, 66, 245, 0.12), 
                0 16px 24px 0 rgba(156, 66, 245, 0.24), 
                0 2px 4px -1px rgba(27, 10, 82, 0.12), 
                0 0 1px 0 rgba(156, 66, 245, 0.24);
  }

  .btn-primary-medium {
    background-image: linear-gradient(114deg, var(--color-primary-gradient-start, #00BBFF) -46%, var(--color-primary-gradient-end, #9C42F5) 100%);
    color: var(--color-primary-text, #FFFFFF);
    border: none;
    padding: var(--space-sm) var(--space-md); /* ADJUSTED vertical padding */
    font-size: 1rem; /* ADJUSTED font size (0.875rem * 1.3) */
    font-weight: var(--font-weight-semibold); 
    border-radius: 0; /* Removed for pixelated look */
    box-shadow: 0 8px 8px -4px rgba(156, 66, 245, 0.12), 
                0 16px 24px 0 rgba(156, 66, 245, 0.24), 
                0 2px 4px -1px rgba(27, 10, 82, 0.12), 
                0 0 1px 0 rgba(156, 66, 245, 0.24);
  }

  .btn-primary-m:hover:not(.btn-disabled),
  .btn-primary-medium:hover:not(.btn-disabled) {
    box-shadow: 0 10px 12px -4px rgba(156, 66, 245, 0.18),
                0 20px 30px 0px rgba(156, 66, 245, 0.30),
                0 3px 6px -1px rgba(27, 10, 82, 0.15),
                0 0 2px 0px rgba(156, 66, 245, 0.30);
    transform: translateY(-1px); 
  }

  .btn-primary-m:active:not(.btn-disabled),
  .btn-primary-medium:active:not(.btn-disabled),
  .btn-primary-m:focus-visible:not(.btn-disabled),
  .btn-primary-medium:focus-visible:not(.btn-disabled) {
    box-shadow: 0 6px 7px -4px rgba(156, 66, 245, 0.10),
                0 12px 20px -2px rgba(156, 66, 245, 0.20),
                0 1px 3px -1px rgba(27, 10, 82, 0.10),
                0 0 1px 0 rgba(156, 66, 245, 0.20);
    transform: translateY(0px); /* Adjusted from -1px for active to be less jumpy or same as base */
  }
  
  /* Removed .btn-primary:disabled as .btn-disabled should handle this now for all variants */
  /* Removed .btn-size-m and .btn-size-medium as their styles are now incorporated into .btn-primary-m etc. */

  /* --- Secondary Button Styles (remain as they were, assumed correct) --- */
  .btn-secondary-m,
  .btn-secondary-medium {
    background-color: var(--color-secondary-button-bg);
    color: var(--color-secondary-button-text, var(--color-text-primary));
    border: 1px solid var(--color-secondary-button-border, rgba(160, 100, 255, 0.5));
    box-shadow: 0 0 0 0 var(--color-secondary-button-glow, rgba(160, 100, 255, 0));
    padding: 18px 28px; 
    font-size: calc(var(--font-size-base) * 1.1);
    font-weight: var(--font-weight-semibold); /* Explicitly set to match primary */
    border-radius: 0; /* Removed for pixelated look */
    transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, color 0.2s ease-in-out, opacity 0.2s ease-in-out, transform 0.15s ease-in-out, box-shadow 0.2s ease-in-out;
  }
  .btn-secondary-m {
    padding: 18px 28px;
    font-size: calc(var(--font-size-base) * 1.1);
    font-weight: var(--font-weight-semibold);
    border-radius: 0; /* Removed for pixelated look */
  }
  .btn-secondary-medium {
    padding: var(--space-sm) var(--space-md); /* ADJUSTED vertical padding */
    font-size: 1.1375rem; /* ADJUSTED font size */
    font-weight: var(--font-weight-semibold);
    border-radius: 0; /* Removed for pixelated look */
  }
  /* ... hover, active, disabled for secondary ... */
  .btn-secondary-m:hover:not(.btn-disabled),
  .btn-secondary-medium:hover:not(.btn-disabled) {
    background-color: var(--color-secondary-button-bg-hover);
    border-color: var(--color-secondary-button-border-hover, rgba(180, 120, 255, 0.8));
    color: var(--color-secondary-button-text-hover, var(--color-text-primary));
    box-shadow: 0 0 8px 2px var(--color-secondary-button-glow-hover, rgba(160, 100, 255, 0.3));
    transform: translateY(-2px);
  }

  .btn-secondary-m:active:not(.btn-disabled),
  .btn-secondary-medium:active:not(.btn-disabled),
  .btn-secondary-m:focus-visible:not(.btn-disabled),
  .btn-secondary-medium:focus-visible:not(.btn-disabled) {
    background-color: var(--color-secondary-button-bg-active);
    border-color: var(--color-secondary-button-border-active, rgba(180, 120, 255, 1));
    color: var(--color-secondary-button-text-active, var(--color-text-primary));
    box-shadow: 0 0 10px 3px var(--color-secondary-button-glow-active, rgba(160, 100, 255, 0.4));
    transform: translateY(0px);
  }
  
  /* .btn-primary-icon, .btn-faded, .btn-text styles remain as they were */
  .btn-primary-icon { 
    background-image: linear-gradient(114deg, var(--color-primary-gradient-start, #00BBFF) -46%, var(--color-primary-gradient-end, #9C42F5) 100%);
    color: var(--color-primary-text, #FFFFFF);
    border: none;
    padding: var(--space-xs); 
    border-radius: 0; /* Removed for pixelated look */
    box-shadow: 0 2px 4px -1px rgba(27, 10, 82, 0.12), 0 0 1px 0 rgba(156, 66, 245, 0.24); 
  }
  .btn-primary-icon:hover:not(.btn-disabled) {
    box-shadow: 0 3px 6px -1px rgba(27, 10, 82, 0.15), 0 0 2px 0px rgba(156, 66, 245, 0.30);
    transform: translateY(-1px);
  }
  .btn-primary-icon:active:not(.btn-disabled),
  .btn-primary-icon:focus-visible:not(.btn-disabled) {
    box-shadow: 0 1px 3px -1px rgba(27, 10, 82, 0.10), 0 0 1px 0 rgba(156, 66, 245, 0.20);
    transform: translateY(0px);
  }
  .btn-primary-icon :global(.btn-icon) {
     margin: 0; 
  }
  .btn-primary-icon span:empty { 
      display: none;
  }

  .btn-faded-small { /* Renamed from .btn-faded and .btn-size-s */
    background-color: var(--color-button-faded-bg, var(--color-background-tertiary));
    color: var(--color-button-faded-icon, var(--color-text-secondary));
    border-color: transparent; /* Or var(--color-border-secondary) if preferred */
    box-shadow: none;
    padding: var(--space-md) var(--space-md);
    font-size: var(--font-size-sm);
    border-radius: 0; /* Removed for pixelated look */
  }
  .btn-faded-small:hover:not(.btn-disabled) {
    background-color: var(--color-button-faded-bg-hover, var(--color-background-secondary-hover));
    color: var(--color-text-primary);
    /* border-color: var(--color-border-input-hover); */ /* Optional: subtle border change */
  }

  .btn-text {
    background-color: transparent;
    color: var(--color-text-link);
    border-color: transparent;
    box-shadow: none;
    padding: var(--space-xs);
    font-weight: var(--font-weight-medium); /* Already on .btn, can be removed if redundant */
  }
  .btn-text:hover:not(.btn-disabled) {
    /* background-color: var(--color-button-faded-bg-hover); */ /* Text buttons usually don't get bg on hover */
    color: var(--color-primary-accent-hover);
    text-decoration: underline;
  }

  :global(.btn > .btn-icon) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
</style> 