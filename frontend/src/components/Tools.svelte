<script>
    import FillButton from './FillButton.svelte'
    import PaintButton from './PaintButton.svelte'
    import BrushSize from './BrushSize.svelte'
</script>

<style>
    .tools-container {
        margin-top: var(--space-md, 16px);
        padding: var(--space-md, 16px);
        background-color: var(--color-background-secondary, #f5f5f5);
        border-radius: var(--border-radius, 8px);
        border: 1px solid var(--color-border-secondary, #e0e0e0);
    }
    
    .tools-row {
        display: flex;
        gap: var(--space-sm, 8px);
        margin-bottom: var(--space-sm, 8px);
    }
</style>

<div class="tools-container">
    <div class="tools-row">
        <PaintButton />
        <FillButton />
    </div>
    <BrushSize />
</div>