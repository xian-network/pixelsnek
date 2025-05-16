<script>
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import Icon from './Icon.svelte';

  export let isOpen = false; // Controlled externally
  export let title = ''; // Optional modal title
  export let duration = 250; // Animation duration
  export let showCloseButton = true;
  export let closeOnEscape = true;
  export let closeOnClickOutside = true;
  export let id = `modal-${Math.random().toString(36).substring(2,9)}`;

  const dispatch = createEventDispatcher();
  let modalElement;
  let previouslyFocusedElement;

  const closeIconPath = "M6 18L18 6M6 6l12 12"; // Simple X icon

  function closeModal() {
    isOpen = false;
    dispatch('close');
  }

  function handleKeydown(event) {
    if (!isOpen) return;

    if (event.key === 'Escape' && closeOnEscape) {
      closeModal();
      return;
    }
    
    if (event.key === 'Tab' && modalElement) {
      const focusableElements = Array.from(
        modalElement.querySelectorAll(
          'a[href]:not([disabled]), button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), details:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter(el => el.offsetParent !== null); // Check if visible

      if (!focusableElements.length) {
        event.preventDefault(); // Prevent tabbing out if no focusable elements
        return;
      }

      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) { // Shift + Tab
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          event.preventDefault();
        }
      } else { // Tab
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          event.preventDefault();
        }
      }
    }
  }

  function handleClickOnOverlay(event) {
    // Ensure click is directly on the overlay, not on modal content
    if (isOpen && closeOnClickOutside && event.target === event.currentTarget) {
      closeModal();
    }
  }
  
  // Reactive statement for when isOpen changes
  $: if (typeof document !== 'undefined') { // Ensure document exists (for SSR safety)
    if (isOpen) {
      previouslyFocusedElement = document.activeElement;
      document.addEventListener('keydown', handleKeydown);
      // Delay focus to allow for transitions and rendering
      setTimeout(() => {
        if (modalElement) {
          const firstFocusable = modalElement.querySelector(
            'a[href]:not([disabled]), button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), details:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );
          if (firstFocusable) {
            firstFocusable.focus();
          } else {
            modalElement.focus(); // Fallback to focusing the modal container itself
          }
        }
      }, 0);
    } else {
      document.removeEventListener('keydown', handleKeydown);
      if (previouslyFocusedElement) {
        previouslyFocusedElement.focus();
        previouslyFocusedElement = null;
      }
    }
  }

  onDestroy(() => {
    // Cleanup listener if component is destroyed while modal is open
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', handleKeydown);
    }
    // Potentially restore focus if needed and `previouslyFocusedElement` is still set
    // but usually handled by the reactive block when isOpen becomes false.
  });

</script>

{#if isOpen}
  <div 
    class="modal-overlay {$$props.overlayClass || ''}"
    transition:fade={{ duration: duration / 1.5, easing: quintOut }}
    on:click={handleClickOnOverlay}
  >
    <div 
      class="modal-content {$$props.class || ''}"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? `${id}-title` : undefined}
      aria-describedby={$$slots.default ? `${id}-description` : undefined}
      bind:this={modalElement}
      tabindex="-1"
      transition:fly={{ y: 30, duration: duration, easing: quintOut }}
    >
      {#if title || showCloseButton}
        <header class="modal-header">
          {#if title}
            <h2 class="modal-title" id="{id}-title"><slot name="title">{title}</slot></h2>
          {/if}
          {#if showCloseButton}
            <button type="button" class="modal-close-button" on:click={closeModal} aria-label="Close modal">
              <Icon path={closeIconPath} size="1.25em" viewBox="0 0 24 24" />
            </button>
          {/if}
        </header>
      {/if}

      <main class="modal-body" id={$$slots.default ? `${id}-description` : undefined}>
        <slot />
      </main>

      {#if $$slots.footer}
        <footer class="modal-footer">
          <slot name="footer" />
        </footer>
      {/if}
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: var(--color-background-overlay);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000; /* High z-index */
    padding: var(--space-md); /* Ensure modal doesn't touch screen edges */
  }

  .modal-content {
    background-color: var(--color-background-primary);
    border-radius: 12px; /* Softer, larger radius */
    box-shadow: var(--shadow-lg);
    padding: var(--space-lg) var(--space-xl); /* More generous padding */
    min-width: 320px; 
    max-width: 600px; /* Default max width */
    width: 100%; /* Responsive within max-width */
    max-height: calc(100vh - (var(--space-md) * 2)); /* Max height considering overlay padding */
    overflow-y: auto; 
    display: flex;
    flex-direction: column;
  }
  .modal-content:focus {
    outline: none;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: var(--space-md);
    margin-bottom: var(--space-lg); /* More space after header */
    border-bottom: 1px solid var(--color-border-secondary);
    flex-shrink: 0; /* Prevent header from shrinking */
  }
  .modal-header:empty {
      display: none;
  }
  /* If only title is present and no close button through prop */
  .modal-header > .modal-title:only-child {
    /* Potentially adjust if no close button is there and title takes full width */
  }

  .modal-title {
    font-size: var(--font-size-xl); /* e.g. 24px */
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    margin: 0;
    flex-grow: 1;
  }

  .modal-close-button {
    background: none;
    border: none;
    padding: var(--space-xs);
    margin-left: var(--space-md);
    cursor: pointer;
    color: var(--color-text-tertiary);
    line-height: 1;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .modal-close-button:hover {
    color: var(--color-text-primary);
    background-color: var(--color-button-faded-bg-hover);
  }
  .modal-close-button:focus-visible {
    outline: 2px solid var(--color-primary-accent);
    outline-offset: 1px;
  }

  .modal-body {
    flex-grow: 1;
    margin-bottom: var(--space-lg); /* Consistent large spacing */
    overflow-y: auto; /* If body itself needs to scroll independently of modal content max-height */
    min-height: 50px; /* Ensure body has some min height */
  }
  .modal-body:last-child {
      margin-bottom: 0; 
  }

  .modal-footer {
    padding-top: var(--space-md);
    margin-top: auto; 
    border-top: 1px solid var(--color-border-secondary);
    display: flex;
    justify-content: flex-end; 
    gap: var(--space-sm);
    flex-shrink: 0; /* Prevent footer from shrinking */
  }
</style> 