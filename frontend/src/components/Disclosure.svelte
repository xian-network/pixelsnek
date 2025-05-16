<script>
  import { slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import Icon from './Icon.svelte'; 

  export let title = 'Disclosure Title';
  export let initiallyOpen = false;
  export let duration = 250;

  let isOpen = initiallyOpen;

  const plusPath = "M12 4.5v15m7.5-7.5h-15";
  const minusPath = "M4.5 12h15";

  function toggleOpen() {
    isOpen = !isOpen;
  }
</script>

<div class="disclosure {$$props.class || ''}" class:open={isOpen}>
  <button 
    type="button"
    class="disclosure-header"
    aria-expanded={isOpen}
    aria-controls="disclosure-content-{title.replace(/\s+/g, '-').toLowerCase()}"
    on:click={toggleOpen}
  >
    <span class="disclosure-title">
      <slot name="title">{title}</slot>
    </span>
    <span class="disclosure-icon">
      <Icon path={isOpen ? minusPath : plusPath} size="1.25em" viewBox="0 0 24 24" />
    </span>
  </button>

  {#if isOpen}
    <div 
      class="disclosure-content-wrapper"
      transition:slide={{ duration: duration, easing: quintOut }}
    >
      <div 
        class="disclosure-content"
        role="region"
        id="disclosure-content-{title.replace(/\s+/g, '-').toLowerCase()}"
      >
        <slot />
      </div>
    </div>
  {/if}
</div>

<style>
  .disclosure {
    background-color: var(--color-background-secondary);
    border-radius: 8px;
    margin-bottom: var(--space-sm);
    border: 1px solid var(--color-border-primary);
  }
  .disclosure-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: var(--space-md);
    background-color: transparent;
    border: none;
    cursor: pointer;
    text-align: left;
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
  }
  .disclosure-header:focus-visible {
    outline: 2px solid var(--color-primary-accent);
    outline-offset: 2px;
    border-radius: 6px;
  }
  .disclosure-title {
    flex-grow: 1;
  }
  .disclosure-icon {
    display: inline-flex;
    align-items: center;
    margin-left: var(--space-md);
    color: var(--color-text-secondary);
    transition: transform 0.2s ease-in-out;
  }
  .disclosure-content-wrapper {
    overflow: hidden;
  }
  .disclosure-content {
    padding: 0 var(--space-md) var(--space-md) var(--space-md);
    color: var(--color-text-secondary);
    font-size: var(--font-size-base);
    line-height: var(--line-height-relaxed);
  }
  .disclosure-header:hover {
     background-color: var(--color-button-faded-bg);
  }
</style> 