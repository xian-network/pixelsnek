<script>
    // MISC
    import { currentFrame, frameStore, activeFrame } from '../js/stores'
    import { newPixelFrame } from '../js/defaults'
    import Button from './Button.svelte'

    const reset = () => {
        let wipe = confirm("Wipe project and start again?")
        if (wipe){
            currentFrame.set(0)
            frameStore.update(currentValue => {
                currentValue[$activeFrame] = newPixelFrame()
                return currentValue

            })
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