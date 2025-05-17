<script>
	import {onMount} from 'svelte'
	import {letter_to_color, color_to_letter, formatAccountAddress, decodeFrames} from '../js/utils'
	import CreatedWithLove from "./CreatedWithLove.svelte";
	import Button from "./Button.svelte";
	import { goto } from '@sapper/app';
	import FrameCanvas from './FrameCanvas.svelte';
	import { getThingByUid } from "../js/graphqlQueries";
	import { fetchThings } from "../js/processGraphql.js";

	export let fontSize = 8;
	export let subtitle = true;
	export let showFullLogo = false;

	// Featured NFT IDs
	const featuredNftIds = [
		"de21a6ea9bf10899e4da797b949d329b50dda110bd73ccc37754800f356b3f28", // Original
		"fadd15a208a0b8e548852fea22b70f597713f25573ba4143dfc2fc72c86ca4c6",
		"79aba644d2cdf4e2600b710212a829d87b7133387238dc00242561f11a9f1311",
		"57385ea42919e947122a40fc6c435a9cdc0da40b5a8531e46b6dce9640e5585b",
		"0f8034c2dd981ecf56ee147eef95723613fd9a0b498040c512b36431a6178f60",
		"fd18bb09d75c69c66b50a3f82f4d613dd412287e32daba3c548839fa60a8d175",
		"4d65cbbcb32d5d92b4ac7bab9dd44ba07301c49d6b03af90f0c17f621813c4fb",
		"32dada72454b23fefdecef528b0696ecadf4c9abe3d05f70da6679f5d96295c7",
		"911640eaa7c092e0f58c1036ae2dd1c471b54cb9323d80db6f7bc0b013a7197a",
		"ac856cb30c911ef734115bc1a080392ddfa34e65364a284ec7e3cd37b7c44dc7"
	];
	
	// Randomly select a featured NFT ID
	const randomIndex = Math.floor(Math.random() * featuredNftIds.length);
	const frameId = featuredNftIds[randomIndex];
	
	let framesColor = undefined;
	let thingInfo = null;
	let frames = [];
	let currentFrame = 1;
	let switcher;
	
	onMount(async () => {
		framesColor = letter_to_color['G'];
		const colorTimer = setInterval(changeColor, 1000);
		
		// Fetch frame data using GraphQL
		try {
			const data = await fetchThings(getThingByUid(frameId));
			if (data && data.length > 0) {
				thingInfo = data[0];
				frames = decodeFrames(thingInfo.thing);
				// Start frame animation
				switcher = setInterval(switchFrames, Number(thingInfo.speed));
			}
		} catch (error) {
			console.error("Error fetching frame:", error);
		}
		
		return () => {
			clearInterval(colorTimer);
			if (switcher) clearInterval(switcher);
		}
	})

	const changeColor = () => {
		let currIndex = Object.keys(color_to_letter).indexOf(framesColor)
		let nextIndex = currIndex + 1
		let nextColor = Object.keys(color_to_letter)[nextIndex]
		if (!nextColor) framesColor = letter_to_color['G']
		else framesColor = nextColor
	}
	
	const switchFrames = () => {
		if (currentFrame >= frames.length) currentFrame = 1;
		else currentFrame = currentFrame === frames.length ? 1 : currentFrame + 1;
	}
	
	const createNew = () => {
		goto('/create');
	}
	
	const viewFeaturedNFT = () => {
		goto(`/frames/${frameId}`);
	}
	
	const viewCreatorProfile = (e, address) => {
		e.stopPropagation(); // Prevent the card click from triggering
		goto(`/profile/${address}`);
	}
</script>

<style>
	.title-container {
		display: flex;
		flex-wrap: wrap;
		margin: 2rem 0;
	}
	
	.left-column {
		flex: 0 0 55%;
		padding-right: 2rem;
	}
	
	.right-column {
		flex: 0 0 45%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.title {
		font-size: 3.5rem;
		font-weight: bold;
		margin-bottom: 1.5rem;
		color: var(--color-text-primary);
		line-height: 1.2;
	}
	
	.blurb {
		font-size: 1.2rem;
		margin-bottom: 2rem;
		line-height: 1.5;
		color: var(--color-text-secondary);
	}
	
	.create-button {
		margin-top: 1rem;
	}
	
	.nft-card {
		width: 100%;
		max-width: 400px;
		border-radius: 12px;
		overflow: hidden;
		background-color: var(--color-background-primary);
		border: 1px solid var(--color-border-secondary);
		box-shadow: 0 4px 24px 0 rgba(128, 90, 255, 0.6);
		transition: transform 0.2s ease, box-shadow 0.3s ease;
		cursor: pointer;
	}
	
	.nft-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 8px 32px 0 rgba(128, 90, 255, 0.8);
		border-color: var(--color-border-primary);
	}
	
	.frame-container {
		width: 100%;
		position: relative;
		background-color: var(--color-background-secondary);
		padding: 10px;
	}
	
	.nft-info {
		padding: 1.5rem;
	}
	
	.nft-title {
		font-size: 1.5rem;
		font-weight: bold;
		margin-bottom: 0.5rem;
		color: var(--color-text-primary);
	}
	
	.nft-description {
		font-size: 1rem;
		color: var(--color-text-secondary);
		margin-bottom: 1rem;
		line-height: 1.4;
	}
	
	.nft-creator {
		display: flex;
		align-items: center;
		font-size: 0.9rem;
		color: var(--color-text-tertiary);
	}
	
	.creator-icon {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background-color: var(--color-primary-accent);
		color: var(--color-text-on-accent);
		margin-right: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.creator-link {
		color: var(--color-text-link);
		text-decoration: none;
		cursor: pointer;
	}
	
	.creator-link:hover {
		text-decoration: underline;
	}
	
	.animation-indicator {
		position: absolute;
		bottom: 10px;
		right: 10px;
		background-color: rgba(0,0,0,0.5);
		color: white;
		padding: 4px 8px;
		border-radius: 4px;
		font-size: 0.8rem;
	}
	
	.logo-container {
		display: flex;
		align-items: center;
		margin-bottom: 1rem;
	}
	
	strong {
		position: relative;
		color: var(--primary);
		z-index: 1;
	}
	
	span.logo-text {
		position: relative;
		transition: color 1s ease-in-out;
		z-index: 1;
	}
	
	.featured-badge {
		background-color: var(--color-primary-accent, #8A42D8);
		color: var(--color-text-on-accent, #FFFFFF);
		padding: 0.3rem 0.8rem;
		border-radius: 4px;
		font-size: 0.8rem;
		font-weight: bold;
		position: absolute;
		top: 10px;
		left: 10px;
		z-index: 2;
	}
	
	/* Responsive styles */
	@media (max-width: 992px) {
		.title-container {
			flex-direction: column;
		}
		
		.left-column, .right-column {
			flex: 0 0 100%;
			padding-right: 0;
		}
		
		.left-column {
			margin-bottom: 2rem;
			text-align: center;
		}
		
		.title {
			font-size: 3rem;
		}
		
		.create-button {
			margin: 1rem auto;
			display: block;
		}
	}
	
	@media (max-width: 768px) {
		.title {
			font-size: 2.5rem;
		}
		
		.blurb {
			font-size: 1.1rem;
		}
		
		.nft-card {
			max-width: 350px;
		}
	}
	
	@media (max-width: 480px) {
		.title {
			font-size: 2rem;
		}
		
		.blurb {
			font-size: 1rem;
		}
		
		.nft-info {
			padding: 1rem;
		}
		
		.nft-title {
			font-size: 1.2rem;
		}
	}
</style>

<div class="title-container">
	<div class="left-column">
		<h1 class="title">Create Your Own NFT Pixel Animations</h1>
		
		<p class="blurb">
			Design unique pixel art animations and mint them as NFTs on the Xian blockchain. 
			Own your creations, trade with others, and build your collection in this 
			decentralized art marketplace.
		</p>
		
		<Button variant="primary" on:click={createNew} class="create-button">
			Create Your NFT
		</Button>
	</div>
	
	<div class="right-column">
		{#if frames.length > 0 && thingInfo}
			<div class="nft-card" on:click={viewFeaturedNFT}>
				<div class="frame-container">
					<span class="featured-badge">Featured</span>
					<FrameCanvas pixelSize={17} pixels={frames[currentFrame - 1]} id={thingInfo.uid} />
					{#if frames.length > 1}
						<div class="animation-indicator">
							<span>{currentFrame}/{frames.length}</span>
						</div>
					{/if}
				</div>
				
				<div class="nft-info">
					<h2 class="nft-title">{thingInfo.name}</h2>
					<p class="nft-description">{thingInfo.description}</p>
					<div class="nft-creator">
						<div class="creator-icon">C</div>
						<span>Created by 
							<a href={`/profile/${thingInfo.creator}`} class="creator-link" on:click={(e) => viewCreatorProfile(e, thingInfo.creator)}>
								{formatAccountAddress(thingInfo.creator, 8, 4)}
							</a>
						</span>
					</div>
				</div>
			</div>
		{:else}
			<div class="nft-card" style="min-height: 400px;">
				<div style="display: flex; justify-content: center; align-items: center; height: 300px;">
					<p>Loading featured NFT...</p>
				</div>
			</div>
		{/if}
	</div>
</div>