<script>
    import { frameSpeed, frameStore } from '../js/stores.js'
    import { onMount } from 'svelte'

    $: speed = $frameSpeed

    onMount(() => {
/*
        let lsSpeed = localStorage.getItem('frameSpeed')
        if (lsSpeed) frameSpeed.set(lsSpeed)
        else frameSpeed.set(1000)
*/
        return (() => {
            //if ($frameSpeed) localStorage.setItem('frameSpeed', $frameSpeed)
        })
    })

    const handleInput = (e) => {
        frameStore.update(currentValue => {
            currentValue[$frameStore.active].speed = e.target.valueAsNumber
            return currentValue
        })
    }

</script>

<div class="slider-container">
    <label class="slider-label">Animation Speed <strong>{speed}ms</strong></label>
    <input
        bind:value={speed}
        on:input={handleInput}
        type="range"
        min="100"
        max="2000"
        class="slider">
</div>

<style>
    .slider-container {
        margin: var(--space-md, 16px) 0;
        padding: var(--space-sm, 8px) var(--space-md, 16px);
        background-color: var(--color-background-secondary, #f5f5f5);
        border-radius: var(--border-radius, 8px);
        border: 1px solid var(--color-border-secondary, #e0e0e0);
    }
    
    .slider-label {
        display: block;
        margin-bottom: var(--space-xs, 4px);
        font-size: var(--font-size-sm, 0.875rem);
        color: var(--color-text-primary);
    }

    .slider-label > strong {
        font-size: 1.1em;
        font-weight: var(--font-weight-bold, 700);
        color: var(--color-primary, var(--primary));
    }
    
    .slider {
        width: 100%;
        height: 8px;
        -webkit-appearance: none;
        appearance: none;
        background: var(--color-background-tertiary, #f0f0f0);
        border-radius: 4px;
        outline: none;
    }
    
    .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--color-primary, var(--primary));
        cursor: pointer;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    
    .slider::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--color-primary, var(--primary));
        cursor: pointer;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
</style>