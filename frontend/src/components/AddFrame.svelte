<script>
    import { tick }  from 'svelte'
    import { frames, currentFrame, frameStore, activeFrame } from '../js/stores'
    import { config } from '../js/config'
    import Button from './Button.svelte'
    import RoundAdd24Px2Icon from '../icons/RoundAdd24Px2Icon.svelte'

    const addFrame = async () => {
        if ($frames.length < config.totalFrames + 1) {
            frameStore.update(f => {
                f[$activeFrame].frames.push(Array.from(f[$activeFrame].frames[f[$activeFrame].frames.length - 1]));
                return f
            })
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
