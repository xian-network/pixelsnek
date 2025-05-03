<script>
	import {onMount} from 'svelte'
	import {letter_to_color, color_to_letter} from '../js/utils'
	import CreatedWithLove from "./CreatedWithLove.svelte";

	export let fontSize = 8;
	export let subtitle = true;
	export let showFullLogo = false;

	$: framesColor = undefined;
	onMount(() => {
		framesColor = letter_to_color['G'];
		const colorTimer = setInterval(changeColor, 1000)
		return () => {
			clearInterval(colorTimer)
		}
	})

	const changeColor = () => {
		let currIndex = Object.keys(color_to_letter).indexOf(framesColor)
		let nextIndex = currIndex + 1
		let nextColor = Object.keys(color_to_letter)[nextIndex]
		if (!nextColor) framesColor = letter_to_color['G']
		else framesColor = nextColor
	}

</script>

<style>
    .title-container {
        /* Base styles for the container */
        display: flex;
        flex-direction: row;
        align-items: center; /* Vertically align items if needed */
        justify-content: center;
        min-width: max-content;
        /* Base font size set by prop */
        font-size: var(--base-font-size, 8em); /* Use CSS variable */
        transition: font-size 0.3s ease-out; /* Smooth transition */
    }
    .top-margin{
        margin-top: 3rem;
    }
    span{
        position: relative;
        transition: color 1s ease-in-out ;
        z-index: 1;
    }
    strong {
        position: relative;
        color: var(--primary);
        z-index: 1;
    }
    .right-margin{
        margin-right: 10px;
    }
    .subtitle {
        margin: -4rem 0 0;
        position: relative;
        right: -42px;
        /* font-size: 0.2em; Relative to container font-size */
        padding-top: 1rem;
        text-align: center; /* Center subtitle */
        width: 100%; /* Ensure it takes width for centering */
        color: var(--primary-dark);
        font-weight: 600;
    }
    img{
        position: relative;
        /* Adjust size relative to font size */
        width: 1.5em; /* Use em for relative sizing */
        height: auto;
        margin-right: 0.1em;
    }

    /* Responsive adjustments */
    @media (max-width: 767px) { /* Breakpoint for mobile */
        .title-container {
            /* Reduce font size significantly on mobile */
            font-size: var(--base-font-size-mobile, 4em);
        }
        .subtitle {
            margin: -2rem 0 0; /* Adjust subtitle margin */
            right: 0; /* Reset horizontal offset */
            /* font-size: 0.25em; Adjust relative size if needed */
        }
        .top-margin {
             margin-top: 1.5rem; /* Reduce top margin */
        }
    }
    @media (max-width: 480px) { /* Smaller mobile */
        .title-container {
             font-size: var(--base-font-size-small-mobile, 3em);
        }
         .subtitle {
            margin: -1.5rem 0 0;
        }
    }
</style>

<!-- Use CSS variables to pass font size -->
<div class="title-container flex-row" 
     style={`--base-font-size: ${fontSize}em; --base-font-size-mobile: ${fontSize > 4 ? 4 : fontSize}em; --base-font-size-small-mobile: ${fontSize > 3 ? 3 : fontSize}em;`} 
     class:top-margin={showFullLogo}>
    {#if showFullLogo}<img src="./img/PIXELSNEK-FULL.png" alt="pixel snek full logo"/>{/if}
    <strong class:right-margin={showFullLogo}>Pixel</strong>
    <span style={`color: ${framesColor};`}>Snek</span>
</div>

{#if subtitle}
    <p class="subtitle">
        On-chain NFT Pixel Animations created by YOU!
    </p>
{/if}