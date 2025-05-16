<script>
  import { createEventDispatcher } from 'svelte';

  export let items = []; // Array of objects: [{ id: '1', label: 'Tab One', ...anyOtherData }, { id: '2', label: 'Tab Two' }]
  export let activeTabId = items.length > 0 ? items[0].id : null;

  const dispatch = createEventDispatcher();

  function setActiveTab(itemId) {
    if (activeTabId !== itemId) {
      activeTabId = itemId;
      dispatch('tabChange', { id: itemId, item: items.find(i => i.id === itemId) });
    }
  }

  $: activeItem = items.find(i => i.id === activeTabId) || (items.length > 0 ? items[0] : null);

</script>

<div class="tabs-container {$$props.class || ''}">
  <div class="tabs-list-wrapper">
    <ul class="tabs-list" role="tablist">
      {#each items as item (item.id)}
        <li class="tab-item" role="presentation">
          <button 
            type="button"
            role="tab"
            id="tab-{item.id}"
            aria-selected={activeTabId === item.id}
            aria-controls={activeTabId === item.id ? `tabpanel-${item.id}` : undefined} 
            class="tab-button"
            class:active={activeTabId === item.id}
            on:click={() => setActiveTab(item.id)}
            tabindex={activeTabId === item.id ? 0 : -1}
          >
            {item.label}
          </button>
        </li>
      {/each}
    </ul>
  </div>
  
  <div 
    class="tab-panel-content"
    role="tabpanel"
    id={activeItem ? `tabpanel-${activeItem.id}` : undefined}
    aria-labelledby={activeItem ? `tab-${activeItem.id}` : undefined}
    tabindex="0"
  >
    <slot {activeItem} {activeTabId} />
  </div>
</div>

<style>
  .tabs-container {
    /* Container for the whole tabs component */
  }

  .tabs-list-wrapper {
    /* Wrapper for the tab buttons list, useful for styling like bottom border */
    border-bottom: 1px solid var(--color-border-secondary); /* Faded line as per "Phantom S" style */
    margin-bottom: var(--space-md);
  }

  .tabs-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
  }

  .tab-item {
    /* No margin needed here if buttons handle their own padding and visual separation */
  }

  .tab-button {
    font-family: inherit;
    font-size: var(--font-size-base); /* Mockup: 01 Tabs Faded/Phantom S implies standard text size */
    font-weight: var(--font-weight-medium);
    color: var(--color-text-secondary);
    background-color: transparent;
    border: none;
    padding: var(--space-sm) var(--space-md);
    cursor: pointer;
    position: relative;
    transition: color 0.2s ease-in-out, border-color 0.2s ease-in-out;
    border-bottom: 3px solid transparent; /* Thickness for the active indicator */
    margin-bottom: -1px; /* Overlap with wrapper border to make indicator appear seamless */
    border-radius: 0; /* Ensure no button radius interferes with bottom line */
  }

  .tab-button:hover:not(.active) {
    color: var(--color-text-primary);
  }

  .tab-button.active {
    color: var(--color-primary-accent);
    border-bottom-color: var(--color-primary-accent);
    font-weight: var(--font-weight-semibold);
  }

  .tab-button:focus {
    outline: none; /* Remove default outline */
  }

  .tab-button:focus-visible {
    /* For better visibility on focus, let's add a subtle background or ring inside the button */
    background-color: var(--color-button-faded-bg-hover);
    border-bottom-color: var(--color-primary-accent); /* Keep indicator if active or becoming active */
    border-radius: 4px 4px 0 0; /* Rounded top corners for focus on the tab itself */
    color: var(--color-primary-accent);
  }
  .tab-button.active:focus-visible {
    background-color: transparent; /* Active tab focus might just rely on its active state */
     /* Or a very subtle inner ring: outline: 1px solid var(--color-primary-accent); outline-offset: -3px; */
  }

  .tab-panel-content {
    /* padding: var(--space-md) 0; */ /* Content padding is up to the slot consumer */
    /* No specific styling here as it's just a container for slotted content */
  }
  .tab-panel-content:focus-visible {
    outline: 2px solid var(--color-primary-accent);
    outline-offset: 2px;
    border-radius: var(--space-xs);
  }
</style> 