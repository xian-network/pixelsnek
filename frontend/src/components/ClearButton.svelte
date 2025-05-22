<script>
    import { currentFrame, frameStore } from '../js/stores'
    import { newPixelBoard } from '../js/defaults.js'
    import Button from './Button.svelte'

    const handleClick = () => {
        let wipe = confirm("Wipe current frame?");
        if (wipe) {
            frameStore.snapshot();
            frameStore.update(state => {
                const active = state.active;
                const frames = [...state.frames];
                const currentFrameIdx = $currentFrame;
                const project = { ...frames[active] };

                project.frames = project.frames.slice();
                project.frames[currentFrameIdx] = newPixelBoard();

                frames[active] = project;

                return { ...state, frames };
            });
        }
    }
</script>

<Button 
    variant="secondary-medium" 
    on:click={handleClick}
>
    Clear Current Frame
</Button>