<script>
    import { frames, currentFrame, totalPixels } from '../js/stores';
    import { emptyFrame } from '../js/utils';
    import { config } from '../js/config';
    import FrameCanvas from './FrameCanvas.svelte';
    import AddFrame from './AddFrame.svelte';
    import MoveFrameButton from './MoveFrameButton.svelte';
    import Button from './Button.svelte';
    import { onMount, afterUpdate } from 'svelte';

    // Responsive state
    let container;
    let pixelSize = 2;
    let frameSize = 50; // Default frame size
    let gridSize;
    
    // Calculate appropriate frame size based on container width
    function calculateFrameSize() {
        if (!container) return;
        
        const containerWidth = container.getBoundingClientRect().width;
        
        // Adjust frame size based on container width
        if (containerWidth < 250) {
            frameSize = 45; // Small mobile view
        } else if (containerWidth < 400) {
            frameSize = 60; // Mobile view
        } else if (containerWidth < 600) {
            frameSize = 70; // Tablet view
        } else {
            frameSize = 80; // Desktop view
        }
        
        // Calculate pixel size based on frame size
        pixelSize = frameSize / config.frameWidth;
    }

    onMount(() => {
        calculateFrameSize();
        window.addEventListener('resize', calculateFrameSize);
        return () => window.removeEventListener('resize', calculateFrameSize);
    });

    afterUpdate(calculateFrameSize);

    const close = (frameNum) => {
        frames.update(f => {
            if (f.length === 1) f = [emptyFrame($totalPixels)];
            else f.splice(frameNum, 1);
            currentFrame.set($currentFrame > 0 ? frameNum - 1 : 0);
            return f;
        });
    };
</script>

<div class="responsive-frames-container" bind:this={container}>
    <div class="frames-header">
        <span class="frame-count">Animation Frames <strong>{$frames.length}</strong></span>
    </div>
    
    <div class="frames-grid">
        {#each $frames as pixels, index}
            <div class="frame-item" class:selected={$currentFrame === index}>
                <div class="frame-number">{index + 1}</div>
                
                <div class="frame-content">
                    {#if $currentFrame === index}
                        <div class="move-button left">
                            <MoveFrameButton direction="left" width="15px" {index}/>
                        </div>
                    {/if}
                    
                    <div 
                        class="frame-canvas"
                        on:click={() => currentFrame.set(index)}
                        style={`width: ${frameSize}px; height: ${frameSize}px;`}
                    >
                        <FrameCanvas {pixels} pixelSize={pixelSize}/>
                    </div>
                    
                    {#if $currentFrame === index}
                        <div class="move-button right">
                            <MoveFrameButton direction="right" width="15px" {index}/>
                        </div>
                    {/if}
                </div>
            </div>
        {/each}
        
        {#if $frames.length < 8}
            <div class="frame-item add-frame">
                <div class="frame-canvas add-button" style={`width: ${frameSize}px; height: ${frameSize}px;`}>
                    <AddFrame />
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .responsive-frames-container {
        width: 100%;
        background-color: var(--color-background-secondary, #f5f5f5);
        border-radius: var(--border-radius, 8px);
        padding: var(--space-sm, 8px);
        border: 1px solid var(--color-border-secondary, #e0e0e0);
    }
    
    .frames-header {
        margin-bottom: var(--space-sm, 8px);
        display: flex;
        align-items: center;
    }
    
    .frame-count {
        font-size: var(--font-size-sm, 0.875rem);
        color: var(--color-text-primary);
        line-height: 1.5;
    }
    
    .frame-count strong {
        color: var(--color-primary);
        font-size: var(--font-size-md, 1rem);
        margin-left: var(--space-xs, 4px);
        font-weight: var(--font-weight-bold, 700);
    }
    
    .frames-grid {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-sm, 8px);
        align-items: center;
        justify-content: center;
    }
    
    .frame-item {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    .frame-number {
        position: absolute;
        top: -8px;
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--color-background-primary);
        color: var(--color-text-secondary);
        font-size: var(--font-size-xs, 0.75rem);
        font-weight: var(--font-weight-medium, 500);
        padding: 2px 6px;
        border-radius: 12px;
        z-index: 2;
        border: 1px solid var(--color-border-secondary);
        min-width: 20px;
        text-align: center;
    }
    
    .frame-content {
        display: flex;
        align-items: center;
    }
    
    .frame-canvas {
        line-height: 0;
        border: 2px solid var(--color-border-secondary, #e0e0e0);
        border-radius: var(--border-radius-sm, 4px);
        transition: all 0.2s ease-in-out;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        background-color: var(--color-background-primary);
        cursor: pointer;
        overflow: hidden;
    }
    
    .selected .frame-canvas {
        border-color: var(--color-primary);
        box-shadow: 0 4px 8px rgba(128, 90, 255, 0.2);
    }
    
    .move-button {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .move-button.left {
        margin-right: var(--space-xxs, 2px);
    }
    
    .move-button.right {
        margin-left: var(--space-xxs, 2px);
    }
    
    .add-button {
        border: 1px dashed var(--color-primary);
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        background-color: var(--color-background-tertiary, #f9f9f9);
    }

    /* Adjust layout for different screen sizes */
    @media (min-width: 576px) {
        .frames-grid {
            justify-content: flex-start;
        }
    }
    
    @media (min-width: 768px) {
        .responsive-frames-container {
            padding: var(--space-md, 16px);
        }
    }
</style> 