<script>
  import { onMount } from 'svelte';
  import Icon from './Icon.svelte'; // Import the Icon component

  export let variant = 'primary-m'; // primary-m, primary-medium, primary-icon, faded-small, text
  export let size = ''; // sm, md, lg (can also be inferred from variant sometimes)
  export let href = '';
  export let disabled = false;
  export let onClick = () => {};
  export let fontFamily = 'melodica'; // Default to melodica font

  export let iconLeft = '';   // SVG path data for left icon
  export let iconRight = '';  // SVG path data for right icon
  export let iconSize = '1em'; // Size for icons within the button, can be overridden
  export let iconViewBox = '0 0 24 24'; // Default viewBox for icons

  let buttonElement;
  let finalVariant = variant;
  let finalSize = size;

  // Some variants might imply a size or specific styling
  // Mapping variants from mockups to internal classes for clarity
  const variantMap = {
    'primary-m': { base: 'btn-primary', sizeClass: 'btn-size-m' },
    'primary-medium': { base: 'btn-primary', sizeClass: 'btn-size-medium' }, // Assuming this is a distinct style/size
    'primary-icon': { base: 'btn-primary btn-primary-icon', sizeClass: 'btn-size-icon' }, // Combined base classes for icon variant
    'faded-small': { base: 'btn-faded', sizeClass: 'btn-size-s' },
    'text': { base: 'btn-text', sizeClass: 'btn-size-text' }, // Usually size is intrinsic or a separate prop
  };

  $: currentVariantStyle = variantMap[finalVariant] || variantMap['primary-m'];
  $: computedClasses = `${currentVariantStyle.base} ${finalSize || currentVariantStyle.sizeClass || ''}`;
  
  // Generate font style string
  // $: fontStyle = fontFamily === 'melodica' 
  //   ? "font-family: 'Medodica', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;" 
  //   : fontFamily === 'raster' 
  //   ? "font-family: 'Raster Forge', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important; letter-spacing: 0.12em !important;" 
  //   : "";

  function handleClick(event) {
    if (!disabled) {
      onClick(event);
      if (buttonElement && typeof buttonElement.blur === 'function') {
        buttonElement.blur(); // Remove focus after click for non-navigational buttons
      }
    }
  }

  onMount(() => {
    // Example: if variant is 'primary-icon', ensure size is appropriate or set a default
    if (variant === 'primary-icon' && !size) {
      finalSize = variantMap['primary-icon'].sizeClass;
    }
    // If only icons are present, and no text in slot, button might need specific padding adjustments or min-size
    // This can be handled by specific variant styles like btn-primary-icon or by checking slot content if Svelte allows easily
  });

</script>

{#if href && !disabled}
  <a
    bind:this={buttonElement}
    {href}
    class="btn {computedClasses} {$$props.class || ''}"
    role="button"
    aria-disabled={disabled}
    on:click={handleClick}
  >
    {#if iconLeft}
      <Icon path={iconLeft} size={iconSize} viewBox={iconViewBox} class="btn-icon icon-left" />
    {/if}
    <slot />
    {#if iconRight}
      <Icon path={iconRight} size={iconSize} viewBox={iconViewBox} class="btn-icon icon-right" />
    {/if}
  </a>
{:else}
  <button
    bind:this={buttonElement}
    type="button"
    {disabled}
    class="btn {computedClasses} {$$props.class || ''}"
    on:click={handleClick}
    style={fontStyle}
  >
    {#if iconLeft}
      <Icon path={iconLeft} size={iconSize} viewBox={iconViewBox} class="btn-icon icon-left" />
    {/if}
    <slot />
    {#if iconRight}
      <Icon path={iconRight} size={iconSize} viewBox={iconViewBox} class="btn-icon icon-right" />
    {/if}
  </button>
{/if}

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: var(--font-weight-medium);
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    border: 1px solid transparent; /* Base border */
    user-select: none;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    text-decoration: none; /* For <a> tags styled as buttons */
    white-space: nowrap; /* Prevent text wrapping */
  }

  .btn:focus-visible {
    outline: 2px solid var(--color-primary-accent); /* Generic focus, can be customized per variant */
    outline-offset: 2px;
  }

  .btn:disabled,
  .btn[aria-disabled="true"] {
    opacity: 0.65;
    cursor: not-allowed;
    box-shadow: none;
  }

  /* -- Variant: Primary -- */
  .btn-primary {
    background-color: var(--color-primary-accent);
    color: var(--color-text-on-accent);
    border-color: var(--color-primary-accent);
    box-shadow: var(--shadow-sm);
  }
  .btn-primary:hover:not(:disabled):not([aria-disabled="true"]) {
    background-color: var(--color-primary-accent-hover);
    border-color: var(--color-primary-accent-hover);
    box-shadow: var(--shadow-md);
  }
  .btn-primary:active:not(:disabled):not([aria-disabled="true"]), /* For click */
  .btn-primary:focus-visible:not(:disabled):not([aria-disabled="true"]) {
    background-color: var(--color-primary-accent-pressed);
    border-color: var(--color-primary-accent-pressed);
    box-shadow: var(--shadow-md);
    /* Consider a more distinct focus ring for primary buttons if needed */
  }
  .btn-primary:disabled,
  .btn-primary[aria-disabled="true"] {
    background-color: var(--color-text-disabled); /* More specific disabled for primary */
    border-color: var(--color-text-disabled);
    color: var(--color-background-secondary);
  }

  /* -- Sizes for Primary Buttons (examples from mockups) -- */
  /* 00 Primary M */
  .btn-size-m {
    padding: var(--space-sm) var(--space-lg); /* e.g. 8px 24px */
    font-size: var(--font-size-base); /* 16px */
    border-radius: 8px; /* Mockup seems to have rounded corners */
  }

  /* 01 Primary Medium */
  .btn-size-medium {
    padding: var(--space-xs) var(--space-md); /* e.g. 4px 16px */
    font-size: var(--font-size-sm); /* 14px */
    border-radius: 6px;
    /* This seems to be a smaller, less padded primary button based on the name */
    /* Adjust if the visual is significantly different from primary-m */
  }

  /* -- Variant: Primary Icon -- */
  /* Uses .btn-primary for colors, but has specific sizing and padding for icon-only */
  .btn-primary-icon {
    /* Inherits most from .btn-primary if not overridden */
    /* Typically square or round, padding adjusted for icon */
  }
  .btn-size-icon {
    padding: var(--space-sm); /* e.g. 8px, adjust as needed for square feel */
    line-height: 1; /* Ensure icon is centered if it has intrinsic line height */
    border-radius: 6px; /* Or var(--border-radius-round) if we define one */
  }
  /* Ensure icon slots in icon buttons fill space or are sized correctly */
  :global(.btn-primary-icon > svg) {
    width: var(--font-size-lg); /* e.g. 20px */
    height: var(--font-size-lg);
  }

  /* -- Variant: Faded -- */
  .btn-faded {
    background-color: var(--color-button-faded-bg);
    color: var(--color-button-faded-icon); /* Text color for faded buttons */
    border-color: transparent; /* Or a very subtle border if needed: var(--color-border-secondary) */
    box-shadow: none;
  }
  .btn-faded:hover:not(:disabled):not([aria-disabled="true"]) {
    background-color: var(--color-button-faded-bg-hover);
    color: var(--color-text-primary); /* Icon/text might get darker on hover */
    box-shadow: var(--shadow-sm);
  }
  .btn-faded:active:not(:disabled):not([aria-disabled="true"]), 
  .btn-faded:focus-visible:not(:disabled):not([aria-disabled="true"]) {
    background-color: var(--color-button-faded-bg-pressed);
    box-shadow: var(--shadow-sm);
    /* Consider a specific focus ring for faded buttons */
  }
  .btn-faded:disabled,
  .btn-faded[aria-disabled="true"] {
    background-color: var(--color-button-faded-bg);
    /* Disabled state might need specific color for icon/text if it differs from normal */
  }

  /* -- Size for Faded Buttons (03 Faded Small) -- */
  .btn-size-s {
    padding: var(--space-xs); /* e.g. 4px, for small, often icon-only faded buttons */
    font-size: var(--font-size-sm); /* If it contains text */
    border-radius: 6px;
    line-height: 1;
  }
  :global(.btn-faded.btn-size-s > svg) {
    width: var(--font-size-md); /* e.g. 18px */
    height: var(--font-size-md);
  }


  /* -- Variant: Text -- */
  .btn-text {
    background-color: transparent;
    color: var(--color-text-link); /* Or a specific text button color */
    border-color: transparent;
    box-shadow: none;
    padding: var(--space-xs) var(--space-sm); /* Minimal padding */ 
  }
  .btn-text:hover:not(:disabled):not([aria-disabled="true"]) {
    background-color: var(--color-button-faded-bg-hover); /* Subtle background on hover */
    color: var(--color-primary-accent-hover);
    text-decoration: none; /* Usually text buttons don't underline like links */
  }
  .btn-text:active:not(:disabled):not([aria-disabled="true"]), 
  .btn-text:focus-visible:not(:disabled):not([aria-disabled="true"]) {
    background-color: var(--color-button-faded-bg-pressed);
    color: var(--color-primary-accent-pressed);
    /* Consider a specific focus ring */
  }
  .btn-text.btn-size-text {
    font-size: var(--font-size-base); /* From mockup: 16 M 80 - M likely medium weight */
    font-weight: var(--font-weight-medium);
    /* line-height: var(--line-height-normal); */ /* Line height might be important if it aligns with other text */
    /* The "80" might refer to opacity or a color variant, needs clarification or interpretation */
    /* Assuming standard opacity unless disabled */
  }

  /* Styling for slots (icons) - very basic, relies on SVG size mostly */
  :global(.btn > svg) {
    display: inline-block;
    vertical-align: middle;
  }
  :global(.btn > .icon-left) {
    margin-right: var(--space-sm);
  }
  :global(.btn > .icon-right) {
    margin-left: var(--space-sm);
  }

  /* Refined styling for icons within buttons */
  :global(.btn > .btn-icon) {
    display: inline-flex; /* Changed from inline-block to align better with flex context of button */
    align-items: center; /* Ensure vertical alignment */
    justify-content: center; /* Ensure horizontal alignment */
    /* SVG specific size might be controlled by Icon component props or direct CSS */
  }
  
  :global(.btn > .icon-left:not(:only-child)) { /* Apply margin only if there is text/slot content */
    margin-right: var(--space-sm);
  }
  :global(.btn > .icon-right:not(:only-child)) { /* Apply margin only if there is text/slot content */
    margin-left: var(--space-sm);
  }

  /* For icon-only buttons (where default slot is empty) */
  /* We can make padding more square for btn-primary-icon for example */
  .btn-primary-icon.btn-size-icon {
    padding: var(--space-sm); /* Example: 8px for a small square icon button */
  }
  /* Ensure icon slots in icon buttons fill space or are sized correctly */
  :global(.btn-primary-icon.btn-size-icon > .btn-icon) {
    /* width: var(--font-size-lg); 
    height: var(--font-size-lg); 
    The Icon component's size prop should handle this, but we can enforce if needed */
  }

</style> 