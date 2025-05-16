<script>
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import Icon from './Icon.svelte';

  export let isOpen = false;
  export let title = '';
  export let duration = 250;
  export let showCloseButton = true;
  export let closeOnEscape = true;
  export let closeOnClickOutside = true;
  export let id = `modal-${Math.random().toString(36).substring(2,9)}`;

  const dispatch = createEventDispatcher();
  let modalElement;
  let previouslyFocusedElement;

  const closeIconPath = "M6 18L18 6M6 6l12 12";

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
      ).filter(el => el.offsetParent !== null);

      if (!focusableElements.length) {
        event.preventDefault();
        return;
      }

      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          event.preventDefault();
        }
      } else { 
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          event.preventDefault();
        }
      }
    }
  }

  function handleClickOnOverlay(event) {
    if (isOpen && closeOnClickOutside && event.target === event.currentTarget) {
      closeModal();
    }
  }
  
  $: if (typeof document !== 'undefined') { 
    if (isOpen) {
      previouslyFocusedElement = document.activeElement;
      document.addEventListener('keydown', handleKeydown);
      setTimeout(() => {
        if (modalElement) {
          const firstFocusable = modalElement.querySelector(
            'a[href]:not([disabled]), button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), details:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );
          if (firstFocusable) {
            firstFocusable.focus();
          } else {
            modalElement.focus();
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
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', handleKeydown);
    }
  });

</script>

{#if isOpen}
  <div 
    class="modal-overlay {$$props.overlayClass || ''}"
    transition:fade={{ duration: duration / 1.5, easing: quintOut }}
    on:click={handleClickOnOverlay}
  >
    <div 
      class="modal-container {$$props.class || ''}"
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
              <span class="modal-close-x" aria-hidden="true">X</span>
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
    z-index: 10000;
    padding: var(--space-md);
  }
  .modal-container {
    background-color: var(--color-background-primary);
    width: 95%;
    max-width: 600px;
    max-height: 90vh;
    border-radius: 0;
    box-shadow: var(--shadow-lg);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }
  .modal-content:focus {
    outline: none;
  }
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* padding-bottom: var(--space-md);
    margin-bottom: var(--space-lg); */
    /* border-bottom: 1px solid var(--color-border-secondary); */
    flex-shrink: 0;
  }
  .modal-header:empty {
      display: none;
  }
  .modal-title {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    margin: 0;
    flex-grow: 1;
  }
  .modal-close-button {
    position: absolute;
    top: var(--space-sm);
    right: var(--space-sm);
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background-color: var(--color-background-tertiary);
    color: var(--color-text-primary);
    cursor: pointer;
    border-radius: 0;
    opacity: 0.7;
    transition: opacity 0.2s ease;
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
    margin-bottom: var(--space-lg);
    overflow-y: auto;
    min-height: 50px;
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
    flex-shrink: 0;
  }
  .modal-close-x {
    font-size: 1.5em;
    font-weight: 900;
    line-height: 1;
    font-family: var(--font-family-melodica), 'Medodica', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Oxygen, Ubuntu, sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    pointer-events: none;
    height: 100%;
    width: 100%;
    text-align: center;
    vertical-align: middle;
    position: relative;
    top: 0.5px;
  }
</style>
