<script>
	// Components
	import PixelBoard from './PixelBoard.svelte'
	import Pallet from './Pallet.svelte'
	import Frames from './Frames.svelte'
	import Preview from './Preview.svelte'
	import ClearButton from './ClearButton.svelte'
	import DeleteButton from './DeleteButton.svelte'
	import CreateButton from "./CreateButton.svelte";
	import RangeSlider from './RangeSlider.svelte'
	import NewFrame from './NewFrame.svelte'
	import SavedFrames from './SavedFrames.svelte'
	import NewButton from './NewButton.svelte'
	import Tools from './Tools.svelte'

	// Misc
	import { frames, frameStore, activeFrame } from '../js/stores'

	let itemCreated = false;

	const handleCreated = () => {
		itemCreated = true
		setTimeout(() => itemCreated = false, 2100)
	}

</script>

<style>
	.designer {
		display: flex;
		flex-direction: column; /* Base direction is column */
		align-items: center; /* Center items horizontally */
		padding: 1rem; /* Add some padding for mobile */
		box-sizing: border-box;
	}

	.main-row {
		display: flex;
		flex-direction: column; /* Stack columns by default (mobile first) */
		width: 100%;
		align-items: center; /* Center columns */
	}

	.info{
		display: flex;
		flex-direction: column; /* Stack preview/slider and buttons */
		align-items: center; /* Center items within info column */
		margin-bottom: 2rem; /* Space below info section on mobile */
		width: 100%; /* Take full width on mobile */
		max-width: 500px; /* Limit max width */
		padding: 0; /* Remove side padding */
	}

	.preview-slider-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 1rem;
	}

	.frames{
		/* Styles for frames container if needed */
		display: flex; /* Use flex for centering */
		justify-content: center;
		align-items: center;
		width: 100%; /* Ensure it takes width */
		margin-bottom: 1rem;
	}

	.buttons{
		background: var(--pure-white);
		width: 100%; /* Full width button box on mobile */
		max-width: 300px; /* Limit width */
		box-sizing: border-box;
	}

	.pallet-board{
		display: flex;
		flex-direction: column; /* Stack canvas/frames and pallet/tools */
		align-items: center; /* Center items */
		width: 100%; /* Take full width */
	}

	.canvas-frames-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 1rem; /* Space below canvas/frames */
		width: 100%; /* Ensure it takes width */
	}

	.pallet-tools-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%; /* Ensure it takes width */
	}

	.shadowbox{
		background: var(--pure-white);
		padding: 10px 15px 1rem; /* Adjust padding */
		margin: 0;
		height: unset;
		border: 1px solid var(--gray-5); /* Use theme border */
		border-radius: 0; /* Consistent pixel style */
		box-shadow: none; /* Consistent pixel style */
		box-sizing: border-box;
	}

	hr{
		border: none;
		border-top: 1px solid var(--gray-5);
		width: 80%; /* Make hr shorter */
		margin: 0.5rem auto; /* Center hr */
	}

	.saved-frames-container {
		width: 100%;
		margin-top: 2rem;
	}

	/* Desktop Styles */
	@media (min-width: 980px) { /* Breakpoint for desktop layout */
		.designer {
			padding: 2rem; /* Restore desktop padding */
		}
		.main-row {
			flex-direction: row; /* Side-by-side layout on desktop */
			align-items: flex-start; /* Align columns to the top */
			justify-content: center; /* Center columns horizontally */
			gap: 2rem; /* Add gap between columns */
		}
		.info{
			flex-direction: column;
			align-items: center;
			margin-bottom: 0; /* Remove bottom margin */
			width: auto; /* Allow natural width */
			max-width: none;
			padding-right: 0; /* Reset padding */
		}
		.preview-slider-container {
			 margin-bottom: 2rem; /* Restore space */
		}
		.buttons {
			width: auto; /* Allow natural width */
			max-width: none;
		}
		.pallet-board{
			flex-direction: row; /* Side-by-side layout for canvas/pallet */
			align-items: flex-start;
			width: auto;
			gap: 1rem; /* Add gap */
		}
		.canvas-frames-container {
			margin-bottom: 0;
			width: auto;
		}
		.pallet-tools-container {
			 width: auto;
		}
		.frames {
			 margin-bottom: 0; /* Reset margin */
		}
		hr {
			width: 100%; /* Full width hr */
			margin: 0.5rem 0; /* Reset margin */
		}
	}
</style>

<svelte:head>
	<title>Pixel Snek NFT Designer!</title>
</svelte:head>

<div class="designer">
	<div class="main-row">
		<div class="info" on:dragover|preventDefault>
			<div class="preview-slider-container">
				<Preview frames={$frames} showWatermark={false}/>
				<RangeSlider />
			</div>

			<div class="buttons shadowbox flex-col">
				<NewButton />
				<hr>
				<ClearButton />
				<DeleteButton />
				<NewFrame />
				<CreateButton on:created={handleCreated}/>
			</div>
		</div>
		<div class="pallet-board">
			<div class="canvas-frames-container">
				<div class="frames">
					<Frames />
				</div>
				<PixelBoard {itemCreated}/>
			</div>
			<div class="pallet-tools-container">
				<Pallet />
				<Tools />
			</div>
		</div>
	</div>
	<div class="saved-frames-container">
		<SavedFrames />
	</div>
</div>