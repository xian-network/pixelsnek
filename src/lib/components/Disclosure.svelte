<script>
  import { slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import Icon from './Icon.svelte'; // Assuming Icon.svelte is in the same directory

  export let title = 'Disclosure Title';
  export let initiallyOpen = false;
  export let duration = 250; // ms for expand/collapse animation

  let isOpen = initiallyOpen;

  // SVG path data for plus and minus icons
  const plusPath = "M12 4.5v15m7.5-7.5h-15"; // Simple plus
  const minusPath = "M4.5 12h15"; // Simple minus

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
    border-radius: 8px; /* Matches the card style in mockup */
    margin-bottom: var(--space-sm);
    border: 1px solid var(--color-border-primary);
  }

  .disclosure-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: var(--space-md);
    background-color: transparent; /* Header itself is transparent, wrapper has bg */
    border: none;
    cursor: pointer;
    text-align: left;
    font-size: var(--font-size-lg); /* "Disclosure L" implies larger text */
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
  }

  .disclosure-header:focus-visible {
    outline: 2px solid var(--color-primary-accent);
    outline-offset: 2px;
    border-radius: 6px; /* Match overall rounding, slightly less than parent */
  }

  .disclosure-title {
    flex-grow: 1;
  }

  .disclosure-icon {
    display: inline-flex;
    align-items: center;
    margin-left: var(--space-md);
    color: var(--color-text-secondary); /* Icon color can be less prominent */
    transition: transform 0.2s ease-in-out;
  }
  
  /* .disclosure.open .disclosure-icon {
    transform: rotate(45deg); // If using a single plus icon that rotates
  } */

  .disclosure-content-wrapper {
    overflow: hidden; /* Important for slide transition */
  }

  .disclosure-content {
    padding: 0 var(--space-md) var(--space-md) var(--space-md); /* Padding around the content, no top padding as header gives space */
    color: var(--color-text-secondary);
    font-size: var(--font-size-base);
    line-height: var(--line-height-relaxed);
  }

  /* Style for light/dark mode based on variables is implicit */
  /* Normal/Hover/Pressed/Disabled states for the header button if desired */
  .disclosure-header:hover {
     background-color: var(--color-button-faded-bg); /* Subtle hover from mockup */
  }
</style> 