<script>
    import { getContext } from 'svelte'
	import { goto } from '@sapper/app';
	import Input from './Input.svelte';
	import Button from './Button.svelte';

    //MISC
	import { frames, frameSpeed, showModal, frameStore, activeFrame } from '../js/stores.js'
	import { serializeFrames, nameTaken, buildExplorerLink } from '../js/utils.js'
	import { createSnack, closeModel } from '../js/store-utils.js'
	import { config, stampLimits } from '../js/config.js';

    // Components
	import Preview from './Preview.svelte'

    const { sendTransaction } = getContext('app_functions')

	let name = "";
	let desc = "";
	let royaltyPercent = 5;
	let formElm;

	const created = $showModal.modalData.created

    const upload = () => {
    	const thing_string = serializeFrames($frames)

		const transaction = {
			methodName: 'create_thing',
			// networkType: config.networkType,
			kwargs: {
				thing_string,
				description: desc,
				name: name,
				meta: {
					speed: parseInt($frameSpeed),
					num_of_frames: $frames.length,
					royalty_percent: royaltyPercent
				}
			},
			stampLimit: 130 + (stampLimits[config.masterContract].per_frame_stamps * $frames.length)
		}
		sendTransaction(transaction, handleCreateTx)
		closeModel()
    }

	const checkName = async (e) => {
		if (await nameTaken(name)) e.target.setCustomValidity("Name already taken")
		else {
			e.target.setCustomValidity("")
		}
		e.target.reportValidity()
	}

	const handleCreateTx = (txResults) => {
        if (txResults.status === 0) {
			console.log({ txResults })
        	created()
			createSnack({
				title: `Created!`,
				body: `${name} is now on the blockchain.`,
				type: "info",
				link: buildExplorerLink(txResults.cometbft_hash)
			})

			const oldIndex = $activeFrame
			let newIndex = oldIndex  - 1
            if (newIndex < 0 ) newIndex = 0
            activeFrame.set(newIndex)

            frameStore.update(currentValue => {
                currentValue.splice(oldIndex, 1)
                return currentValue
            })
			let stateChange = txResults.state.find(f => f.key.includes(':names:'))
			if (stateChange && stateChange.value) redirect(stateChange.value, window.location.href)
		} else {
			createSnack({
				title: `Error!`,
				body: `Failed to create ${name}.`,
				type: "error",
				link: buildExplorerLink(txResults.cometbft_hash)
			})
		}
    }

    const redirect = (uid, location) =>  {
    	let maxChecks = 30
		let checks = 0
    	const checkForThing = async () => {
    		if (window.location.href !== location) return
    		checks = checks + 1
    		let res = await fetch(`./frames/${uid}.json`).then(res => res.json())
			if (res.thingInfo === null) {
				if (checks < maxChecks)setTimeout(checkForThing, 1000)
			}else {
				if (window.location.href === location) goto(`/frames/${uid}`)
			}
		}
		checkForThing()
	}
</script>

<style>
	.form-create-container {
		max-width: 480px;
		margin: 0 auto;
		background: var(--color-background-primary);
		border-radius: var(--border-radius, 12px);
		box-shadow: 0 2px 16px rgba(0,0,0,0.08);
		padding: var(--space-xl, 32px) var(--space-lg, 24px);
		display: flex;
		flex-direction: column;
		gap: var(--space-lg, 24px);
	}
	.preview-row {
		text-align: center;
		margin-bottom: var(--space-lg, 24px);
	}
	.royalty-row {
		display: flex;
		align-items: center;
		gap: var(--space-md, 16px);
		margin-bottom: var(--space-md, 16px);
	}
	.royalty-label {
		font-weight: 600;
		flex: 1;
	}
	.royalty-value {
		font-size: 1.25em;
		font-weight: bold;
		color: var(--primary-dark);
		min-width: 2.5em;
		text-align: right;
	}
	.slider {
		width: 100%;
		margin-top: 0.5rem;
	}
	.mint-btn-row {
		display: flex;
		justify-content: center;
		margin-top: var(--space-lg, 24px);
	}
	.outlined{
		color: var(--color-white-primary-tint);

	}
	.button:disabled {
		/* background: var(--primary-dark);
		color: var(--gray-2); */
		opacity: 0.5 !important;
	}
	textarea{
		resize: none;
	}

	label{
		font-weight: 600;
	}

	input[type="text"], textarea{
		margin-bottom: 1.5rem;
	}

    strong{
        font-size: 2em;
        font-weight: bold;
        color: var(--primary-dark);
		margin: 0 0 0.5rem;
    	align-self: center;
    }
	input[type="range"]::-webkit-slider-runnable-track {
		height: 10px;
		background: var(--color-white-primary-tint);
	}

	input[type="range"]::-webkit-slider-thumb {
	  height: 22px;
	  width: 22px;
	  border-radius: 99px;
	  background: var(--primary-dark);
	  cursor: pointer;
	  -webkit-appearance: none;
	  margin-top: -7px;
	}

</style>

<div class="form-create-container">
	<div class="preview-row">
		<Preview frames={$frames} pixelSize={15} showWatermark={false}/>
	</div>
	<form id="create" class="flex-col" on:submit|preventDefault={upload} bind:this={formElm} autocomplete="off">
		<Input label="Name your Artwork" placeholder="Name" required bind:value={name} on:blur={checkName} maxLength={32} />
		<Input label="Describe your creation" type="textarea" rows="6" maxLength={128} placeholder="(max 128 chars)" required bind:value={desc} />
		<div class="royalty-row">
			<span class="royalty-label">Collect royalties on each sale!</span>
			<span class="royalty-value">{royaltyPercent}%</span>
		</div>
		<input
			id="royalty"
			class="slider"
			bind:value={royaltyPercent}
			type="range"
			min="0"
			max="100"
		/>
		<div class="mint-btn-row">
			<Button type="submit" variant="primary-medium" disabled={name === '' || desc === ''}>
				Mint NFT!
			</Button>
		</div>
	</form>
</div>
