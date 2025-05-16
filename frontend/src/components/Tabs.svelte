<script>
  import { createEventDispatcher } from 'svelte';

  export let items = []; 
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
            aria-controls={activeItem && activeItem.id === item.id ? `tabpanel-${item.id}` : undefined} 
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
    <!-- Content is rendered by parent using the activeItem/activeTabId -->
    <slot {activeItem} {activeTabId} />
  </div>
</div>

<style>
  .tabs-container {}
  .tabs-list-wrapper {
    border-bottom: 1px solid var(--color-border-secondary);
    margin-bottom: var(--space-md);
  }
  .tabs-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
  }
  .tab-item {}
  .tab-button {
    font-family: var(--font-family-sans) !important;
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-secondary);
    background-color: transparent;
    border: none;
    padding: var(--space-sm) var(--space-md);
    cursor: pointer;
    position: relative;
    transition: color 0.2s ease-in-out, border-color 0.2s ease-in-out;
    border-bottom: 3px solid transparent;
    margin-bottom: -1px;
    border-radius: 0;
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
    outline: none;
  }
  .tab-button:focus-visible {
    background-color: var(--color-button-faded-bg-hover);
    border-bottom-color: var(--color-primary-accent);
    border-radius: 4px 4px 0 0;
    color: var(--color-primary-accent);
  }
  .tab-button.active:focus-visible {
    background-color: transparent;
  }
  .tab-panel-content {}
  .tab-panel-content:focus-visible {
    outline: 2px solid var(--color-primary-accent);
    outline-offset: 2px;
    border-radius: var(--space-xs);
  }
</style> 