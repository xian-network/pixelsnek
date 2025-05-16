<script>
  import { createEventDispatcher } from 'svelte';

  export let type = 'text';
  export let value = ''; 
  export let placeholder = '';
  export let disabled = false;
  export let readonly = false;
  export let label = ''; 
  export let id = label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substring(2,7)}` : `input-${Math.random().toString(36).substring(2,7)}`;
  
  const dispatch = createEventDispatcher();
  let focused = false;

  function handleInput(event) {
    dispatch('input', event.target.value);
  }
</script>

<div class="input-wrapper {$$props.class || ''}" class:focused class:disabled class:readonly>
  {#if label}
    <label for={id} class="input-label">{label}</label>
  {/if}
  <div class="input-field-container">
    <span class="input-icon icon-left">
      <slot name="icon-left"></slot>
    </span>
    <input
      {type}
      {id}
      value={value}
      {placeholder}
      {disabled}
      {readonly}
      on:input={handleInput}
      on:focus={() => focused = true}
      on:blur={() => focused = false}
      on:keydown
      class="input-field"
      aria-label={label ? undefined : placeholder || 'Input field'}
    />
    <span class="input-icon icon-right">
       <slot name="icon-right"></slot>
    </span>
  </div>
</div>

<style>
  .input-wrapper {
    position: relative;
    width: 100%;
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
    border: 1px solid var(--color-border-secondary);
    border-radius: 8px;
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out;
    padding: 0 var(--space-sm);
    /* Always show a subtle shadow like the focus state */
    box-shadow: 0 0 0 1px var(--color-focus-shadow);
  }
  .input-field {
    width: 100%;
    padding: var(--space-md);
    background-color: transparent;
    border: none;
    outline: none;
    border-radius: 0;
    font-size: var(--font-size-base);
    color: var(--color-text-primary);
  }
  .input-field::placeholder {
    color: var(--color-text-placeholder);
    opacity: 1;
  }
  .input-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-tertiary);
  }
  .icon-left:has(> :not(slot)) { padding-right: var(--space-sm); }
  .icon-right:has(> :not(slot)) { padding-left: var(--space-sm); }
  .input-field-container:has(.icon-left > :not(slot)) .input-field { padding-left: 0; }
  .input-field-container:has(.icon-right > :not(slot)) .input-field { padding-right: 0; }
  .input-icon:has(button, a, [role="button"]) {
    cursor: pointer;
  }
  .input-icon:has(button, a, [role="button"]:hover) {
    color: var(--color-primary-accent);
  }
  .input-wrapper.focused .input-field-container {
    border-color: var(--color-primary-accent);
    box-shadow: 0 0 0 2px var(--color-primary-transparent);
    background-color: rgba(128, 90, 255, 0.05); /* Light purple background */
  }
  .input-wrapper.disabled .input-field-container {
    opacity: 0.7;
    box-shadow: none;
    border-color: var(--color-border-secondary);
  }
  .input-wrapper.disabled .input-field {
    cursor: not-allowed;
  }
  .input-wrapper.readonly .input-field-container {
    background-color: var(--color-background-tertiary);
    box-shadow: none;
  }
</style> 