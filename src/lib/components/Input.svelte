<script>
  import Icon from './Icon.svelte'; // Assuming Icon component is in the same directory

  export let type = 'text'; // text, password, email, search, etc.
  export let value = ''; // Bindable value
  export let placeholder = '';
  export let disabled = false;
  export let readonly = false;
  export let label = ''; // Optional visible label
  export let id = label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substring(2,7)}` : `input-${Math.random().toString(36).substring(2,7)}`;
  
  export let iconLeft = '';   // SVG path data for left icon
  export let iconRight = '';  // SVG path data for right icon
  export let iconSize = '1.25em'; // Default size for icons in input, e.g., 20px if base font is 16px
  export let iconViewBox = '0 0 24 24';
  export let onIconLeftClick = null; // Optional click handler for left icon
  export let onIconRightClick = null; // Optional click handler for right icon

  let focused = false;

  function handleIconClick(event, handler) {
    if (handler && typeof handler === 'function') {
      handler(event);
    }
  }
</script>

<div class="input-wrapper {$$props.class || ''}" class:focused class:disabled class:readonly>
  {#if label}
    <label for={id} class="input-label">{label}</label>
  {/if}
  <div class="input-field-container">
    {#if iconLeft}
      <span 
        class="input-icon icon-left"
        class:clickable={onIconLeftClick}
        on:click={(e) => handleIconClick(e, onIconLeftClick)}
        on:keydown={(e) => e.key === 'Enter' && handleIconClick(e, onIconLeftClick)}
        role={onIconLeftClick ? 'button' : undefined}
        tabindex={onIconLeftClick ? 0 : -1}
      >
        <Icon path={iconLeft} size={iconSize} viewBox={iconViewBox} />
      </span>
    {/if}
    <input
      {type}
      {id}
      bind:value
      {placeholder}
      {disabled}
      {readonly}
      on:focus={() => focused = true}
      on:blur={() => focused = false}
      class="input-field"
      aria-label={label ? undefined : placeholder || 'Input field'}
    />
    {#if iconRight}
      <span 
        class="input-icon icon-right"
        class:clickable={onIconRightClick}
        on:click={(e) => handleIconClick(e, onIconRightClick)}
        on:keydown={(e) => e.key === 'Enter' && handleIconClick(e, onIconRightClick)}
        role={onIconRightClick ? 'button' : undefined}
        tabindex={onIconRightClick ? 0 : -1}
      >
        <Icon path={iconRight} size={iconSize} viewBox={iconViewBox} />
      </span>
    {/if}
  </div>
  <!-- {#if error} <p class="input-error">{error}</p> {/if} -->
  <!-- {#if hint} <p class="input-hint">{hint}</p> {/if} -->
</div>

<style>
  .input-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%; /* Default to full width, can be overridden by parent */
  }

  .input-label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-xs);
    display: block;
  }

  .input-field-container {
    position: relative;
    display: flex;
    align-items: center;
    background-color: var(--color-background-secondary);
    border: 1px solid var(--color-border-primary);
    border-radius: 8px; /* From search bar in mockup */
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    padding: 0 var(--space-sm); /* Horizontal padding inside container */
  }

  .input-field {
    flex-grow: 1;
    padding: var(--space-sm) 0; /* Vertical padding for input, horizontal handled by container */
    font-size: var(--font-size-base);
    color: var(--color-text-primary);
    background-color: transparent;
    border: none;
    outline: none;
    width: 100%; /* Ensure it takes up available space */
  }

  .input-field::placeholder {
    color: var(--color-text-placeholder);
    opacity: 1; /* Browsers have different defaults */
  }

  .input-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-tertiary);
  }
  .input-icon.icon-left {
    padding-right: var(--space-sm);
  }
  .input-icon.icon-right {
    padding-left: var(--space-sm);
  }
  .input-icon.clickable {
    cursor: pointer;
  }
  .input-icon.clickable:hover {
    color: var(--color-primary-accent);
  }

  /* States */
  .input-wrapper.focused .input-field-container {
    border-color: var(--color-primary-accent);
    box-shadow: 0 0 0 2px var(--color-primary-accent-hover); /* Focus ring, adjust color as needed */
  }

  .input-wrapper.disabled .input-field-container {
    background-color: var(--color-border-secondary); /* More subdued background */
    opacity: 0.7;
  }
  .input-wrapper.disabled .input-field {
    cursor: not-allowed;
  }
  .input-wrapper.readonly .input-field-container {
    background-color: var(--color-background-tertiary);
  }

  /* Styling for different input types if needed, e.g., search */
  /* input[type="search"]::-webkit-search-decoration, */
  /* input[type="search"]::-webkit-search-cancel-button, */
  /* input[type="search"]::-webkit-search-results-button, */
  /* input[type="search"]::-webkit-search-results-decoration {
    -webkit-appearance:none;
  } */

</style> 