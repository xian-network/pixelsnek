<script>
    // MISC
    import { newPixelFrame } from '../js/defaults'
    import { frameStore } from '../js/stores'
    import Button from './Button.svelte'

    const handleClick = () => {
        frameStore.snapshot();
        frameStore.update(state => {
            const newFrame = newPixelFrame();
            const frames = [newFrame, ...state.frames];
            // Set active to 0 (the new project)
            return { ...state, frames, active: 0 };
        });
    }
</script>

<Button 
    variant="primary-medium" 
    on:click={handleClick}
>
    NEW
</Button>