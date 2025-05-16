<script>
    // MISC
    import { newPixelFrame } from '../js/defaults'
    import { frameStore, activeFrame } from '../js/stores'
    import Button from './Button.svelte'

    const handleClick = () => {
        frameStore.update(currentValue => {
            let newList = currentValue.unshift(newPixelFrame())
            activeFrame.set(0)
            return currentValue
        })
    }
</script>

<Button 
    variant="primary-medium" 
    on:click={handleClick}
>
    NEW
</Button>