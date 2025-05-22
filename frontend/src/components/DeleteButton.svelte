<script>
    import { currentFrame, frameStore } from '../js/stores'
    import { newPixelFrame } from '../js/defaults'
    import Button from './Button.svelte'

    const handleClick = () => {
        let deleteFrame = confirm("Delete this frame?");
        if (deleteFrame) {
            frameStore.snapshot();
            frameStore.update(state => {
                const active = state.active;
                const frames = [...state.frames];
                const currentFrameIdx = $currentFrame;
                const project = { ...frames[active] };

                if (project.frames.length === 1) {
                    // Reset to a new frame if only one remains
                    project.frames = [Array(625).fill("B")];
                } else {
                    project.frames = project.frames.slice();
                    project.frames.splice(currentFrameIdx, 1);
                }

                frames[active] = project;
                // Update currentFrame index
                currentFrame.set(currentFrameIdx > 0 ? currentFrameIdx - 1 : 0);

                return { ...state, frames };
            });
        }
    }
</script>

<Button 
    variant="secondary-medium" 
    on:click={handleClick}
>
    Delete Current Frame
</Button>