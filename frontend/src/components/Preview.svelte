<script>
    import { onMount } from 'svelte'
    import FrameCanvas from './FrameCanvas.svelte'
    import { frameSpeed, userAccount } from '../js/stores.js'
    import { isEmptyFrame, createWatermark } from '../js/utils.js'

    export let frames;
    export let thingInfo = false;
    export let pixelSize = 10
    export let showWatermark = true;
    export let border = false;
    export let solidBorder = false;
    export let solidBorderColor = "";
    export let speed = null
    
    let currentFrame = 1;
    let animationInterval;
    let totalFrames = frames?.length || 0;

    $: animationSpeed = speed || (thingInfo?.speed ? Number(thingInfo.speed) : $frameSpeed);

    onMount(() => {
        if (frames?.length > 1) {
            startAnimation();
        }
        return () => stopAnimation();
    });
    
    function startAnimation() {
        if (frames?.length > 1) {
            animationInterval = setInterval(switchFrames, animationSpeed);
        }
    }
    
    function stopAnimation() {
        if (animationInterval) {
            clearInterval(animationInterval);
            animationInterval = null;
        }
    }

    const switchFrames = () => {
        if (currentFrame >= frames.length) {
            currentFrame = 1;
        } else {
            currentFrame += 1;
        }
    }
</script>

<style>
    .frame-wrapper {
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 100%; /* Create a square aspect ratio */
        background-color: var(--color-background-secondary);
        overflow: hidden;
    }
    
    .frame-content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .preview-frame {
        line-height: 0;
        width: 100%;
        padding : 10px;
    }
    
    .preview-frame.border {
        border: 2px dashed var(--primary);
    }
    
    .preview-frame.solid-border {
        border: 1px solid;
    }
    
    .animation-indicator {
        position: absolute;
        bottom: 8px;
        right: 8px;
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        border-radius: 12px;
        padding: 2px 6px;
        font-size: 10px;
        z-index: 10;
    }
</style>

<div class="frame-wrapper">
    <div class="frame-content">
        <div class="preview-frame">
            <FrameCanvas 
                {pixelSize} 
                pixels={frames[currentFrame - 1]} 
                watermark={showWatermark ? createWatermark(thingInfo, $userAccount) : undefined}
            />
        </div>
    </div>
    
    {#if frames?.length > 1}
        <div class="animation-indicator">
            <span>{currentFrame}/{frames.length}</span>
        </div>
    {/if}
</div>