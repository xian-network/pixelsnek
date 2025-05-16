<script>
    import FillButton from './FillButton.svelte';
    import PaintButton from './PaintButton.svelte';
    import BrushSize from './BrushSize.svelte';
    import { onMount, afterUpdate } from 'svelte';
    
    // Responsive state
    let container;
    
    function adjustLayout() {
        if (!container) return;
        
        // Get container width
        const containerWidth = container.getBoundingClientRect().width;
        
        // Additional responsive adjustments could be added here
    }
    
    onMount(() => {
        adjustLayout();
        window.addEventListener('resize', adjustLayout);
        return () => window.removeEventListener('resize', adjustLayout);
    });
    
    afterUpdate(adjustLayout);
</script>

<div class="responsive-tools-container" bind:this={container}>
    <div class="tools-section">
        <h3 class="section-title">Drawing Tools</h3>
        <div class="tools-row">
            <PaintButton />
            <FillButton />
        </div>
        <BrushSize />
    </div>
</div>

<style>
    .responsive-tools-container {
        width: 100%;
        padding: var(--space-sm, 8px);
        background-color: var(--color-background-secondary, #f5f5f5);
        border-radius: var(--border-radius, 8px);
        border: 1px solid var(--color-border-secondary, #e0e0e0);
    }
    
    .tools-section {
        margin-bottom: var(--space-md, 16px);
    }
    
    .section-title {
        font-size: var(--font-size-md, 1rem);
        font-weight: var(--font-weight-medium, 500);
        color: var(--color-text-primary);
        margin-top: 0;
        margin-bottom: var(--space-xs, 4px);
        padding-bottom: var(--space-xxs, 2px);
        border-bottom: 1px solid var(--color-border-tertiary, #eaeaea);
    }
    
    .tools-row {
        display: flex;
        gap: var(--space-sm, 8px);
        margin-bottom: var(--space-sm, 8px);
        flex-wrap: wrap;
    }
    
    @media (min-width: 768px) {
        .responsive-tools-container {
            padding: var(--space-md, 16px);
        }
    }
</style> 