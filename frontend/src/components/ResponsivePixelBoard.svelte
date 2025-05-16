<script>
    import PixelBoard from './PixelBoard.svelte';
    import { config } from '../js/config';
    import { onMount, afterUpdate } from 'svelte';
    
    // Props
    export let itemCreated = false;
    
    // Responsive state
    let container;
    let pixelSize = 20; // Default size
    let boardSize = 0;
    let maxBoardSize = 500; // Default max size
    
    /**
     * Calculate the appropriate pixel size based on container dimensions
     */
    function calculatePixelSize() {
        if (!container) return;
        
        // Get container dimensions
        const rect = container.getBoundingClientRect();
        
        // Get available space (account for padding and ensure proper sizing)
        const availableWidth = rect.width - 20;
        // Don't limit height so severely - use 90% of viewport height if needed
        const availableHeight = window.innerHeight * 0.9;
        
        // Calculate maximum square board size that fits
        maxBoardSize = Math.min(availableWidth, availableHeight);
        
        // Ensure board size is divisible by grid size for clean rendering
        boardSize = Math.floor(maxBoardSize / config.frameWidth) * config.frameWidth;
        
        // Calculate pixel size
        pixelSize = boardSize / config.frameWidth;
        
        // Ensure minimum size for touch usability
        pixelSize = Math.max(pixelSize, 12);
    }
    
    // Initialize and handle window resizing
    onMount(() => {
        calculatePixelSize();
        window.addEventListener('resize', calculatePixelSize);
        return () => window.removeEventListener('resize', calculatePixelSize);
    });
    
    afterUpdate(calculatePixelSize);
</script>

<div class="responsive-pixel-board-wrapper" bind:this={container}>
    <div class="pixel-grid-container" 
         style="width: {boardSize}px; height: {boardSize}px;">
        <PixelBoard {itemCreated} pixelSize={pixelSize.toString()} />
    </div>
</div>

<style>
    .responsive-pixel-board-wrapper {
        width: 100%;
        min-height: 350px;
        height: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: visible;
        padding: var(--space-sm, 8px);
        margin-bottom: var(--space-md, 16px);
    }
    
    .pixel-grid-container {
        display: block;
        touch-action: none; /* Prevent browser handling of touch gestures */
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border-radius: var(--border-radius-sm, 4px);
        background-color: var(--color-background-primary);
        border: 1px solid var(--color-border-secondary, #e0e0e0);
    }
    
    /* Adjust sizing for larger screens */
    @media (min-width: 768px) {
        .responsive-pixel-board-wrapper {
            min-height: 450px;
        }
    }
    
    /* Adjust sizing for very large screens */
    @media (min-width: 1280px) {
        .responsive-pixel-board-wrapper {
            min-height: 550px;
        }
    }
</style> 