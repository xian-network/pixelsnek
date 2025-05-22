<script>
    import { tick }  from 'svelte'
    import { frames, currentFrame, frameStore } from '../js/stores'
    import { config } from '../js/config'
    import Button from './Button.svelte'
    import RoundAdd24Px2Icon from '../icons/RoundAdd24Px2Icon.svelte'

    const addFrame = async () => {
        if ($frames.length < config.totalFrames + 1) {
            frameStore.snapshot();
            frameStore.update(state => {
                const frames = [...state.frames];
                const active = state.active;
                const currentFrameSet = frames[active];
                const newFramesArr = [
                    ...currentFrameSet.frames,
                    Array.from(currentFrameSet.frames[currentFrameSet.frames.length - 1])
                ];
                frames[active] = { ...currentFrameSet, frames: newFramesArr };
                return { ...state, frames };
            });
            await tick()
            currentFrame.set($frames.length - 1)
        }
    }
</script>

<Button 
    variant="primary-icon" 
    on:click={addFrame}
    iconLeft={RoundAdd24Px2Icon}
    size="sm"
    aria-label="Add new frame" 
/>
