<script>
    import { writable} from 'svelte/store';
    import { fade } from 'svelte/transition';
    // Components
    import Preview from './Preview.svelte'
    import Button from './Button.svelte'

    // MISC
    import { frameStore } from '../js/stores'

    let copied = writable({})

    const handleLoad = (index) => {
        frameStore.setActive(index)
    }

    const handleDelete = (index) => {
        let deleteFrame = confirm("Delete this saved Artwork?")
        if(deleteFrame){
            let newIndex = index  - 1
            if (newIndex < 0 ) newIndex = 0
            frameStore.setActive(newIndex)
            frameStore.delete(index)
        }
    }

    const handlePaste = () => {
        navigator.clipboard.readText()
        .then(text => {
            try {
                let frameData = JSON.parse(text)
                frameStore.add(frameData)
            }catch(e){
                console.log(e)
            }
        });
    }
    const handleCopy = (index) => {
        navigator.clipboard.writeText(JSON.stringify($frameStore.frames[index]))
        copied.update(currstore => {
            currstore[index] = true
            return currstore
        })
        setTimeout(() => {
            copied.update(currstore => {
                delete currstore[index]
                return currstore
            })
        }, 1500)
    }

</script>

<style>
    .saved-container {
        padding: 0 var(--space-lg, 28px);
        max-width: 1100px;
        margin: 0 auto;
    }
    
    .section-title {
        margin-top: var(--space-xl, 3rem);
        color: var(--color-text-primary);
        font-size: var(--font-size-xl, 1.5rem);
        font-weight: var(--font-weight-semibold, 600);
    }
    
    hr {
        border: 0;
        height: 1px;
        background-color: var(--color-border-primary, #e0e0e0);
        margin: var(--space-md, 16px) 0;
    }
    
    .saved-item {
        padding: var(--space-xs, 4px) var(--space-md, 16px);
        margin: var(--space-xs, 4px) 0;
        display: flex;
        border-radius: var(--border-radius, 8px);
        border: 1px solid var(--color-border-secondary, #e0e0e0);
        background-color: var(--color-background-primary);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        transition: all 0.2s ease;
        align-items: center;
    }
    
    .saved-item.current {
        background-color: var(--color-primary, var(--primary));
        border-color: var(--color-primary-dark, var(--primary-dark));
        box-shadow: 0 4px 12px rgba(128, 90, 255, 0.2);
    }
    
    .button-container {
        display: flex;
        gap: var(--space-xs, 4px);
        align-items: center;
        margin-top: var(--space-md, 16px);
    }
    
    .item-details {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        margin-left: var(--space-md, 16px);
    }
    
    .info-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .info-column p {
        margin: 0;
        color: var(--color-text-secondary, var(--primary-dark));
        font-weight: 300;
    }
    
    .info-column p strong {
        color: var(--color-primary, var(--primary));
        font-weight: var(--font-weight-medium, 500);
    }
    
    .current .info-column p {
        color: rgba(255, 255, 255, 0.8);
    }
    
    .current .info-column p strong {
        color: white;
    }
    
    .action-buttons {
        display: flex;
        gap: var(--space-xs, 4px);
        flex-wrap: wrap;
        justify-content: flex-end;
    }
    
    .paste-button-container {
        margin: var(--space-md, 16px) 0 var(--space-sm, 8px);
    }
    
    .copy-button-container {
        position: relative;
    }
    
    .copy-success-indicator {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--color-success, #4CAF50);
        border-radius: var(--border-radius, 8px);
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        z-index: 1;
    }
    
    :global(.preview-root), :global(.preview) {
        margin: 0 !important;
        padding: 0 !important;
    }
</style>

<div class="saved-container">
    <h2 class="section-title">Saved Projects</h2>
    <hr>
    
    <div class="paste-button-container">
        <Button 
            variant="primary-medium"
            on:click={handlePaste}
        >
            Paste from clipboard
        </Button>
    </div>
    
    {#each $frameStore.frames as frameInfo, index}
        <div class="saved-item" class:current={$frameStore.active === index}>
            <Preview frames={frameInfo.frames} speed={frameInfo.speed} showWatermark={false} pixelSize={3} border={false}/>
            
            <div class="item-details">
                <div class="info-row">
                    <div class="info-column">
                        <p>Started: <strong>{new Date(frameInfo.created).toLocaleString()}</strong></p>
                        <p>Number of Frames: <strong>{frameInfo.frames.length}</strong></p>
                        <p>Frame Speed: <strong>{frameInfo.speed}ms</strong></p>
                    </div>
                    
                    <div class="action-buttons">
                        <Button 
                            variant="secondary-medium"
                            on:click={() => handleDelete(index)}
                            size="sm"
                        >
                            Delete
                        </Button>
                        
                        <div class="copy-button-container">
                            <Button 
                                variant="secondary-medium"
                                on:click={() => handleCopy(index)}
                                size="sm"
                            >
                                Copy
                            </Button>
                            {#if $copied[index]}
                                <div class="copy-success-indicator" transition:fade>
                                    Copied!
                                </div>
                            {/if}
                        </div>
                        
                        {#if $frameStore.active !== index}
                            <Button 
                                variant="primary-medium"
                                on:click={() => handleLoad(index)}
                                size="sm"
                            >
                                Load
                            </Button>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    {/each}
</div>