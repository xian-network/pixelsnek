<script>
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import Icon from './Icon.svelte';

  export let items = []; // Array of objects: [{ id: '1', label: 'Item One' }, { id: '2', label: 'Item Two' }]
  export let selectedId = null; // ID of the selected item
  export let placeholder = 'Select an option';
  export let duration = 200; // ms for open/close animation
  export let id = `dropdown-${Math.random().toString(36).substring(2,9)}`;

  const dispatch = createEventDispatcher();
  let isOpen = false;
  let dropdownElement;

  const chevronDownPath = "M19.5 8.25l-7.5 7.5-7.5-7.5"; // Example chevron down

  $: selectedItem = items.find(item => item.id === selectedId);
  $: displayLabel = selectedItem ? selectedItem.label : placeholder;

  function toggleDropdown() {
    isOpen = !isOpen;
  }

  function selectItem(item) {
    selectedId = item.id;
    isOpen = false;
    dispatch('select', { id: item.id, item: item });
  }

  function handleClickOutside(event) {
    if (dropdownElement && !dropdownElement.contains(event.target)) {
      isOpen = false;
    }
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside, true);
  });

  onDestroy(() => {
    document.removeEventListener('click', handleClickOutside, true);
  });

</script>

<div class="dropdown {$$props.class || ''}" bind:this={dropdownElement}>
  <button 
    type="button" 
    class="dropdown-toggle"
    class:open={isOpen}
    aria-haspopup="listbox"
    aria-expanded={isOpen}
    aria-controls="{id}-listbox"
    on:click={toggleDropdown}
  >
    <span class="dropdown-label">{displayLabel}</span>
    <span class="dropdown-icon" class:open={isOpen}>
      <Icon path={chevronDownPath} size="1em" viewBox="0 0 24 24" />
    </span>
  </button>

  {#if isOpen}
    <ul 
      class="dropdown-menu"
      role="listbox"
      id="{id}-listbox"
      aria-label={placeholder}
      tabindex="-1" 
      transition:fly={{ y: -10, duration: duration, easing: quintOut }}
    >
      {#each items as item (item.id)}
        <li 
          role="option"
          aria-selected={item.id === selectedId}
          class="dropdown-item"
          class:selected={item.id === selectedId}
          on:click={() => selectItem(item)}
          on:keydown={(e) => e.key === 'Enter' && selectItem(item)}
          tabindex="0"
        >
          {item.label}
        </li>
      {:else}
        <li class="dropdown-item empty">No options available</li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .dropdown {
    position: relative;
    display: inline-block; /* Or block if it should take full width by default */
    min-width: 200px; /* Example min-width, adjust as per design */
  }

  .dropdown-toggle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: var(--space-sm) var(--space-md); /* "Faded M" implies medium padding */
    background-color: var(--color-button-faded-bg);
    border: 1px solid var(--color-border-primary);
    border-radius: 6px;
    font-size: var(--font-size-base);
    color: var(--color-text-primary);
    text-align: left;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease;
  }

  .dropdown-toggle:hover {
    background-color: var(--color-button-faded-bg-hover);
    border-color: var(--color-border-secondary);
  }

  .dropdown-toggle:focus-visible, .dropdown-toggle.open {
    outline: none;
    border-color: var(--color-primary-accent);
    box-shadow: 0 0 0 2px var(--color-primary-accent-hover);
  }

  .dropdown-label {
    flex-grow: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dropdown-icon {
    margin-left: var(--space-sm);
    transition: transform 0.2s ease-in-out;
    color: var(--color-text-tertiary);
  }
  .dropdown-icon.open {
    transform: rotate(180deg);
  }

  .dropdown-menu {
    position: absolute;
    top: calc(100% + var(--space-xs)); /* Position below the toggle */
    left: 0;
    right: 0;
    background-color: var(--color-background-primary);
    border: 1px solid var(--color-border-secondary);
    border-radius: 6px;
    box-shadow: var(--shadow-lg);
    list-style: none;
    padding: var(--space-xs) 0;
    margin: 0;
    z-index: 1000; /* Ensure it's above other content */
    max-height: 200px; /* Example max height */
    overflow-y: auto;
  }

  .dropdown-item {
    padding: var(--space-sm) var(--space-md);
    font-size: var(--font-size-base);
    color: var(--color-text-primary);
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dropdown-item:hover, .dropdown-item:focus-visible {
    background-color: var(--color-button-faded-bg-hover);
    color: var(--color-primary-accent);
    outline: none;
  }

  .dropdown-item.selected {
    font-weight: var(--font-weight-semibold);
    color: var(--color-primary-accent);
    background-color: var(--color-button-faded-bg); /* Subtle background for selected */
  }
  
  .dropdown-item.empty {
    color: var(--color-text-tertiary);
    cursor: default;
  }
</style> 