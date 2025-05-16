<script>
    import { currentColor } from '../js/stores';
    import { color_to_letter, letter_to_color } from '../js/utils.js';
    import { onMount, afterUpdate } from 'svelte';

    $: pallet = makePallet();

    // Responsive variables
    let container;
    let colorSize = 30; // Default size
    let columnsCount = 5; // Default columns

    // Calculate grid layout based on available width
    function calculateLayout() {
        if (!container) return;

        const containerWidth = container.getBoundingClientRect().width;
        
        // Adjust color size based on container width
        if (containerWidth < 200) {
            colorSize = 24;
            columnsCount = 4;
        } else if (containerWidth < 300) {
            colorSize = 28;
            columnsCount = 5;
        } else if (containerWidth < 400) {
            colorSize = 32;
            columnsCount = 6;
        } else {
            colorSize = 36;
            columnsCount = 8;
        }
    }

    onMount(() => {
        calculateLayout();
        window.addEventListener('resize', calculateLayout);
        return () => window.removeEventListener('resize', calculateLayout);
    });

    afterUpdate(calculateLayout);

    const makePallet = () => {
        let colors = JSON.parse(JSON.stringify(color_to_letter));
        delete colors['#ffffff00'];
        delete colors['#ffffff'];
        return colors;
    };

    const changeCurrentColor = (index, letter) => {
        currentColor.update(curr => {
            curr[index] = letter;
            return curr;
        });
    };

    const changePrimary = (e, letter) => {
        changeCurrentColor(0, letter);
    };
    
    const changeSecondary = (e, letter) => {
        changeCurrentColor(1, letter);
    };
</script>

<div class="responsive-pallet-container" bind:this={container}>
    <div class="selected-colors">
        <div
            class="selected-color"
            style={`background: ${letter_to_color[$currentColor[0]]}`}
            on:contextmenu|preventDefault={e => changeSecondary(e, $currentColor[0])}
        >
            {$currentColor[0] === "A" ? "X" : ""}
            <span class="color-label">L</span>
        </div>
        <div
            class="selected-color"
            style={`background: ${letter_to_color[$currentColor[1]]}`}
            on:click={e => changePrimary(e, $currentColor[1])}
        >
            {$currentColor[1] === "A" ? "X" : ""}
            <span class="color-label">R</span>
        </div>
    </div>
    
    <div class="top-pallet">
        <div 
            class="color"
            style={`width: ${colorSize}px; height: ${colorSize}px; background: #ffffff00`}
            on:click={e => changePrimary(e, color_to_letter['#ffffff00'])}
            on:contextmenu|preventDefault={e => changeSecondary(e, color_to_letter['#ffffff00'])}
        >
            X
        </div>
        <div 
            class="color"
            style={`width: ${colorSize}px; height: ${colorSize}px; background: #ffffff`}
            on:click={e => changePrimary(e, color_to_letter['#ffffff'])}
            on:contextmenu|preventDefault={e => changeSecondary(e, color_to_letter['#ffffff'])}
        ></div>
    </div>

    <div class="color-grid" style={`grid-template-columns: repeat(${columnsCount}, ${colorSize}px)`}>
        {#each Object.keys(pallet) as color}
            <div
                class="color"
                style={`width: ${colorSize}px; height: ${colorSize}px; background: ${color}`}
                on:click={e => changePrimary(e, color_to_letter[color])}
                on:contextmenu|preventDefault={e => changeSecondary(e, color_to_letter[color])}
            >
                {#if color === '#ffffff00'} X {/if}
            </div>
        {/each}
    </div>
</div>

<style>
    .responsive-pallet-container {
        width: 100%;
        padding: var(--space-sm, 8px);
        background-color: var(--color-background-secondary, #f5f5f5);
        border-radius: var(--border-radius, 8px);
        border: 1px solid var(--color-border-secondary, #e0e0e0);
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    .selected-colors {
        display: grid;
        grid-template-columns: 46px 46px;
        grid-template-rows: 46px;
        gap: var(--space-xs, 4px);
        margin-bottom: var(--space-md, 16px);
        padding: var(--space-sm, 8px);
        border: 1px dashed var(--color-primary, var(--primary));
        border-radius: var(--border-radius-sm, 4px);
        background-color: var(--color-background-tertiary, #f9f9f9);
    }
    
    .selected-color {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--color-border-secondary, #afafaf);
        border-radius: var(--border-radius-sm, 4px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        font-weight: bold;
        color: var(--color-text-tertiary, darkgray);
    }
    
    .color-label {
        position: absolute;
        top: -10px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.7em;
        background-color: var(--color-background-primary, white);
        padding: 0 4px;
        border-radius: 10px;
        border: 1px solid var(--color-border-secondary, #e0e0e0);
        color: var(--color-primary, var(--primary));
    }
    
    .top-pallet {
        display: flex;
        gap: var(--space-xxs, 2px);
        margin-bottom: var(--space-xs, 4px);
    }
    
    .color-grid {
        display: grid;
        gap: var(--space-xxs, 2px);
        justify-content: center;
        width: fit-content;
    }
    
    .color {
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid var(--color-border-secondary, #e0e0e0);
        border-radius: var(--border-radius-sm, 4px);
        cursor: pointer;
        font-weight: bold;
        color: var(--color-text-tertiary, darkgray);
        transition: transform 0.15s ease;
    }
    
    .color:hover {
        transform: translateY(-2px);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        z-index: 1;
    }
    
    @media (min-width: 768px) {
        .responsive-pallet-container {
            padding: var(--space-md, 16px);
        }
    }
</style> 