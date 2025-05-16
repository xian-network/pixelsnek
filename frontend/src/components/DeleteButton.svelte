<script>
    import { currentFrame, frameStore, activeFrame } from '../js/stores'
    import { newPixelFrame } from '../js/defaults'
    import Button from './Button.svelte'

    const handleClick = () => {
        let deleteFrame = confirm("Delete this frame?")
        if(deleteFrame){
            frameStore.update(f => {
                if (f[$activeFrame].frames.length === 1) f = [newPixelFrame()];
                else f[$activeFrame].frames.splice($currentFrame, 1)
                currentFrame.set($currentFrame > 0 ? $currentFrame - 1 : 0 )
                return f
            })
        }

    }
</script>

<Button 
    variant="secondary-medium" 
    on:click={handleClick}
>
    Delete Current Frame
</Button>