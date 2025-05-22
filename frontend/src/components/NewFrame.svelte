<script>
    // MISC
    import { currentFrame, frameStore } from '../js/stores'
    import { newPixelFrame } from '../js/defaults'
    import Button from './Button.svelte'

    const reset = () => {
        let wipe = confirm("Wipe project and start again?");
        if (wipe) {
            currentFrame.set(0);
            frameStore.snapshot();
            frameStore.update(state => {
                const active = state.active;
                const frames = [...state.frames];
                frames[active] = newPixelFrame();
                return { ...state, frames };
            });
        }
    }
</script>

<style>
</style>

<Button 
    variant="secondary-medium" 
    on:click={reset}
>
    Start Over
</Button>