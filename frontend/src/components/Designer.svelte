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
		flex-direction: column;
		max-width: 1100px;
		margin: 0 auto;
		padding: var(--space-md, 16px);
	}
	.info{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: end;
		margin-bottom: 2rem;
		padding: 0 20px;
	}
	.frames{
		justify-content: center;
		align-items: center;
	}
	.buttons{
		background: var(--color-background-primary);
		width: unset;
		display: flex;
		flex-direction: column;
		gap: var(--space-md, 16px);
	}
	.pallet-board{
		align-items: flex-start;
	}
	.shadowbox{
		background: var(--color-background-primary);
		padding: var(--space-md, 16px) var(--space-lg, 24px) 1rem;
		margin: 0;
		height: unset;
		border-radius: var(--border-radius, 8px);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}
	hr{
		color: var(--color-border-primary, #e0e0e0);
		width: 100%;
		margin: var(--space-sm, 8px) 0;
	}

	@media (min-width: 980px) {
		.designer {
			flex-direction: column;
		}
		.info{
			flex-direction: column;
			align-items: center;
			padding-right: 3rem;
			margin-bottom: 0;
		}
		.frames{
			flex-grow: 1;
		}
		.shadowbox{
			justify-content: space-evenly;
			border: 1px solid var(--color-border-secondary, #afafaf);
		}
	}
</style>

<svelte:head>
	<title>Pixel Snek NFT Designer!</title>
</svelte:head>

<div class="designer">
	<div class="flex-row">
		<div class="info flex-col" on:drap|preventDefault>
			<div class="flex-col">
				<Preview frames={$frames} showWatermark={false}/>
				<RangeSlider />
			</div>

			<div class="flex-col buttons shadowbox">
				<NewButton />
				<hr>
				<ClearButton />
				<DeleteButton />
				<NewFrame />
				<CreateButton on:created={handleCreated}/>
			</div>
		</div>
		<div class="flex-row pallet-board">
			<div class="flex-col">
				<Frames />
				<PixelBoard {itemCreated}/>
			</div>
			<div class="flex-col">
				<Pallet />
				<Tools />
			</div>
		</div>
	</div>
	<div>
		<SavedFrames />
	</div>
</div>