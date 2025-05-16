<script>
    import { currentFrame, frameStore, activeFrame } from '../js/stores'
    import { newPixelBoard } from '../js/defaults.js'
    import Button from './Button.svelte'

    const handleClick = () => {
        let wipe = confirm("Wipe current frame?")
        if (wipe) {
            frameStore.update(f => {
                f[$activeFrame].frames[$currentFrame] = newPixelBoard();
                return f
            })
        }
    }
</script>

<Button 
    variant="secondary-medium" 
    on:click={handleClick}
>
    Clear Current Frame
</Button>