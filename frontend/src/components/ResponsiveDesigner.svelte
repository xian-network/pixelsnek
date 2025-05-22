<script>
	// Components
	import ResponsivePixelBoard from './ResponsivePixelBoard.svelte'
	import ResponsivePallet from './ResponsivePallet.svelte'
	import ResponsiveFrames from './ResponsiveFrames.svelte'
	import ResponsiveTools from './ResponsiveTools.svelte'
	import Preview from './Preview.svelte'
	import ClearButton from './ClearButton.svelte'
	import DeleteButton from './DeleteButton.svelte'
	import CreateButton from "./CreateButton.svelte";
	import RangeSlider from './RangeSlider.svelte'
	import NewFrame from './NewFrame.svelte'
	import SavedFrames from './SavedFrames.svelte'
	import NewButton from './NewButton.svelte'
	import Button from './Button.svelte'
    
    // Icons
    import RoundPerson24PxCopy3Icon from '../icons/RoundPerson24PxCopy3Icon.svelte';
    import AlbumIcon from '../icons/AlbumIcon.svelte';
    import CreditCardIcon from '../icons/CreditCardIcon.svelte';
    import PlayIcon from '../icons/PlayIcon.svelte';
    import SearchIcon from '../icons/SearchIcon.svelte';

	// Misc
	import { frames, frameStore } from '../js/stores'
    import { onMount } from 'svelte';

	// State for created animation
    let itemCreated = false;
	const handleCreated = () => {
		itemCreated = true
		setTimeout(() => itemCreated = false, 2100)
	}

    // Panel state management
    let activePanel = null;
    let isPanelActive = false;
    
    function setActivePanel(panel) {
        if (activePanel === panel) {
            // Toggle off if already active
            activePanel = null;
            isPanelActive = false;
        } else {
            activePanel = panel;
            isPanelActive = true;
        }
    }

    // Check window size to auto-adjust layout for tablets/desktops
    let isDesktop = false;
    
    function checkWindowSize() {
        isDesktop = window.innerWidth >= 768;
        if (isDesktop) {
            isPanelActive = true;
        }
    }
    
    onMount(() => {
        checkWindowSize();
        window.addEventListener('resize', checkWindowSize);
        
        return () => {
            window.removeEventListener('resize', checkWindowSize);
        };
    });
</script>

<style>
    .designer-responsive {
        display: flex;
        flex-direction: column;
        height: 100vh;
        position: relative;
        max-width: 100vw;
        overflow: hidden;
    }
    
    .main-area {
        flex-grow: 1;
        overflow-x: hidden;
        overflow-y: auto;
        padding: var(--space-sm, 8px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding-bottom: 70px;
        min-height: 60vh;
    }
    
    .bottom-nav {
        display: flex;
        justify-content: space-around;
        background: var(--color-background-primary);
        padding: var(--space-xs, 4px) 0;
        border-top: 1px solid var(--color-border-secondary);
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 10;
        height: 56px;
    }
    
    .nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--color-text-secondary);
        background: transparent;
        border: none;
        padding: var(--space-xxs, 2px) var(--space-xs, 4px);
        border-radius: var(--border-radius, 8px);
        cursor: pointer;
        transition: all 0.2s ease;
        flex: 1;
    }
    
    .nav-item.active {
        color: var(--color-primary);
        background-color: var(--color-primary-transparent, rgba(128, 90, 255, 0.1));
    }
    
    .nav-item span {
        font-size: var(--font-size-xs, 0.75rem);
        margin-top: var(--space-xxs, 2px);
    }
    
    .panel-container {
        position: fixed;
        bottom: 56px; /* Height of bottom nav */
        left: 0;
        right: 0;
        transform: translateY(100%);
        transition: transform 0.3s ease;
        background: var(--color-background-primary);
        border-top-left-radius: var(--border-radius, 8px);
        border-top-right-radius: var(--border-radius, 8px);
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
        z-index: 9;
        max-height: 60vh;
        overflow-y: auto;
        padding: var(--space-md, 16px);
    }
    
    .panel-container.active {
        transform: translateY(0);
    }
    
    .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-sm, 8px);
        padding-bottom: var(--space-xs, 4px);
        border-bottom: 1px solid var(--color-border-secondary);
    }
    
    .panel-title {
        font-size: var(--font-size-lg, 1.25rem);
        font-weight: var(--font-weight-medium, 500);
        color: var(--color-text-primary);
        margin: 0;
    }
    
    .close-button {
        background: transparent;
        border: none;
        color: var(--color-text-secondary);
        cursor: pointer;
        padding: var(--space-xxs, 2px);
    }
    
    .panel {
        padding-bottom: var(--space-md, 16px);
    }

    .mini-preview {
        position: absolute;
        top: var(--space-sm, 8px);
        right: var(--space-sm, 8px);
        width: 80px;
        height: 80px;
        background: var(--color-background-secondary);
        border-radius: var(--border-radius, 8px);
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 8;
    }
    
    .mini-preview:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    
    .expand-preview {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 56px;
        background: rgba(0, 0, 0, 0.8);
        z-index: 20;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .buttons-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-sm, 8px);
    }
    
    .saved-container {
        overflow-y: auto;
        max-height: 50vh;
    }

    .preview-container {
        width: 100%;
        padding: var(--space-sm, 8px);
        background-color: var(--color-background-secondary, #f5f5f5);
        border-radius: var(--border-radius, 8px);
        border: 1px solid var(--color-border-secondary, #e0e0e0);
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: var(--space-md, 16px);
    }
    
    /* Tablet and desktop styles */
    @media (min-width: 768px) {
        .designer-responsive {
            flex-direction: row;
            height: calc(100vh - 56px); /* Adjust height to avoid full-screen scroll */
        }
        
        .main-area {
            flex: 1 1 60%;
            padding: var(--space-md, 16px);
            padding-bottom: var(--space-md, 16px); /* Reset padding bottom */
            overflow: auto;
        }
        
        .bottom-nav {
            display: none;
        }
        
        .panel-container {
            position: relative;
            transform: none !important;
            flex: 0 0 350px;
            max-height: 100%;
            height: 100%;
            border-left: 1px solid var(--color-border-secondary);
            border-radius: 0;
            bottom: 0;
            overflow-y: auto;
        }
        
        .panel-header {
            position: sticky;
            top: 0;
            background: var(--color-background-primary);
            z-index: 1;
            padding-top: var(--space-sm, 8px);
        }
        
        .panel-close {
            display: none;
        }
        
        .panel-tabs {
            display: flex;
            margin-bottom: var(--space-md, 16px);
        }
        
        .panel-tab {
            padding: var(--space-xs, 4px) var(--space-sm, 8px);
            cursor: pointer;
            border-bottom: 2px solid transparent;
            margin-right: var(--space-sm, 8px);
            color: var(--color-text-secondary);
        }
        
        .panel-tab.active {
            border-bottom-color: var(--color-primary);
            color: var(--color-primary);
        }
        
        .mini-preview {
            width: 120px;
            height: 120px;
            position: static;
            margin: 0 auto var(--space-md, 16px);
        }
    }
    
    /* Larger desktop styles */
    @media (min-width: 1024px) {
        .designer-responsive {
            padding: var(--space-lg, 24px);
            height: calc(100vh - 64px); /* Account for potential header */
        }
        
        .main-area {
            flex: 1 1 70%;
        }
        
        .panel-container {
            flex: 0 0 400px;
        }
    }
</style>

<svelte:head>
	<title>Pixel Snek NFT Designer</title>
</svelte:head>

<div class="designer-responsive">
    <div class="main-area">
        <ResponsivePixelBoard {itemCreated}/>
        
        <!-- Mini preview visible on desktop or when not in preview panel -->
        {#if isDesktop || (activePanel !== 'preview' && !isPanelActive)}
            <div class="mini-preview" on:click={() => setActivePanel('preview')}>
                <Preview frames={$frames} showWatermark={false} pixelSize={3}/>
            </div>
        {/if}
    </div>
    
    <!-- Bottom Navigation (mobile only) -->
    {#if !isDesktop}
        <nav class="bottom-nav">
            <button class="nav-item" class:active={activePanel === 'draw' || !activePanel} on:click={() => setActivePanel('draw')}>
                <CreditCardIcon size="1.25em" />
                <span>Draw</span>
            </button>
            <button class="nav-item" class:active={activePanel === 'colors'} on:click={() => setActivePanel('colors')}>
                <SearchIcon size="1.25em" />
                <span>Colors</span>
            </button>
            <button class="nav-item" class:active={activePanel === 'frames'} on:click={() => setActivePanel('frames')}>
                <AlbumIcon size="1.25em" />
                <span>Frames</span>
            </button>
            <button class="nav-item" class:active={activePanel === 'preview'} on:click={() => setActivePanel('preview')}>
                <PlayIcon size="1.25em" />
                <span>Preview</span>
            </button>
            <button class="nav-item" class:active={activePanel === 'tools'} on:click={() => setActivePanel('tools')}>
                <RoundPerson24PxCopy3Icon size="1.25em" />
                <span>Tools</span>
            </button>
        </nav>
    {/if}
    
    <!-- Panels (slide up on mobile, side panels on desktop) -->
    <div class="panel-container" class:active={isPanelActive || isDesktop}>
        {#if isDesktop}
            <!-- Desktop panel tabs -->
            <div class="panel-tabs">
                <div class="panel-tab" class:active={activePanel === 'colors' || !activePanel} on:click={() => activePanel = 'colors'}>
                    Colors
                </div>
                <div class="panel-tab" class:active={activePanel === 'frames'} on:click={() => activePanel = 'frames'}>
                    Frames
                </div>
                <div class="panel-tab" class:active={activePanel === 'tools'} on:click={() => activePanel = 'tools'}>
                    Tools
                </div>
                <div class="panel-tab" class:active={activePanel === 'preview'} on:click={() => activePanel = 'preview'}>
                    Preview
                </div>
            </div>
        {:else}
            <!-- Mobile panel header -->
            <div class="panel-header">
                {#if activePanel === 'colors'}
                    <h2 class="panel-title">Color Palette</h2>
                {:else if activePanel === 'frames'}
                    <h2 class="panel-title">Animation Frames</h2>
                {:else if activePanel === 'preview'}
                    <h2 class="panel-title">Preview Animation</h2>
                {:else if activePanel === 'tools'}
                    <h2 class="panel-title">Tools & Actions</h2>
                {/if}
                <button class="close-button" on:click={() => setActivePanel(null)}>
                    <span>×</span>
                </button>
            </div>
        {/if}
        
        <!-- Panel Content based on active panel -->
        {#if activePanel === 'colors' || (!activePanel && isDesktop)}
            <div class="panel">
                <ResponsivePallet />
            </div>
        {:else if activePanel === 'frames'}
            <div class="panel">
                <ResponsiveFrames />
                {#if isDesktop}
                    <SavedFrames />
                {/if}
            </div>
        {:else if activePanel === 'preview'}
            <div class="panel">
                <div class="preview-container">
                    <Preview frames={$frames} showWatermark={false} pixelSize={8}/>
                    <RangeSlider />
                </div>
                
                {#if !isDesktop}
                    <SavedFrames />
                {/if}
            </div>
        {:else if activePanel === 'tools'}
            <div class="panel">
                <ResponsiveTools />
                
                <div style="margin-top: var(--space-lg, 24px);">
                    <h3>Actions</h3>
                    <div class="buttons-grid">
                        <NewButton />
                        <ClearButton />
                        <DeleteButton />
                        <NewFrame />
                    </div>
                    <div style="margin-top: var(--space-md, 16px);">
                        <CreateButton on:created={handleCreated}/>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div> 