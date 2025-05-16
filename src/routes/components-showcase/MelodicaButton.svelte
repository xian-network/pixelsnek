<script>
  import Button from '../../lib/components/Button.svelte';
  export let variant = 'primary-m';
  export let href = '';
  export let disabled = false;
  export let onClick = () => {};
  export let iconLeft = '';
  export let iconRight = '';
  export let iconSize = '1em';
</script>

{#if href && !disabled}
  <a
    {href}
    class="melodica-btn btn-{variant} {disabled ? 'disabled' : ''} {$$props.class || ''}"
    role="button"
    aria-disabled={disabled}
    on:click={onClick}
    style="font-family: 'Medodica', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;"
  >
    <slot />
  </a>
{:else}
  <button
    type="button"
    {disabled}
    class="melodica-btn btn-{variant} {disabled ? 'disabled' : ''} {$$props.class || ''}"
    on:click={onClick}
    style="font-family: 'Medodica', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;"
  >
    <slot />
  </button>
{/if}

<style>
  .melodica-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: var(--font-weight-medium);
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    border: 1px solid transparent;
    user-select: none;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
    text-decoration: none;
    white-space: nowrap;
    font-family: 'Medodica', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
  }

  /* Primary button style */
  .btn-primary-m, .btn-primary-medium {
    background-color: var(--color-primary-accent);
    color: var(--color-text-on-accent);
    border-color: var(--color-primary-accent);
    box-shadow: var(--shadow-sm);
    padding: var(--space-sm) var(--space-lg);
    font-size: var(--font-size-base);
    border-radius: 8px;
  }

  .btn-primary-m:hover:not(.disabled), .btn-primary-medium:hover:not(.disabled) {
    background-color: var(--color-primary-accent-hover);
    border-color: var(--color-primary-accent-hover);
    box-shadow: var(--shadow-md);
  }

  /* Text button style */
  .btn-text {
    background-color: transparent;
    color: var(--color-text-link);
    border-color: transparent;
    box-shadow: none;
    padding: var(--space-xs) var(--space-sm);
  }

  .disabled {
    opacity: 0.65;
    cursor: not-allowed;
    box-shadow: none;
  }
</style> 