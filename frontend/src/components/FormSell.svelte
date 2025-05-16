<script>
    import { getContext, onMount } from 'svelte'

	// Misc
	import { frames, showModal, stampRatio, currency } from '../js/stores.js'
	import { toBigNumber, stringToFixed, buildExplorerLink } from '../js/utils.js'
	import { createSnack, closeModel } from '../js/store-utils.js'
	import { config, stampLimits } from '../js/config.js';

	// Components
	import Preview from './Preview.svelte'
	import Button from './Button.svelte'
	import Input from './Input.svelte'

	let inputElm;
	let inputValue = '0'; // Initialize with default value

    const { sendTransaction } = getContext('app_functions')

	const updateInfo = $showModal.modalData.updateInfo
	const currentSellPrice = $showModal.modalData.thingInfo['price_amount']
    const thingName = $showModal.modalData.thingInfo['name']
	const royalty_percent = $showModal.modalData.thingInfo['royalty_percent']
	const thingInfo = $showModal.modalData.thingInfo

	const sellTxStamps_to_xian = toBigNumber(stampLimits[config.masterContract].sell_thing).dividedBy($stampRatio)


	$: price = toBigNumber(inputValue || "0")
	$: royaltyAmount = toBigNumber(price).multipliedBy(royalty_percent / 100)
	$: netAmount = toBigNumber(price).minus(royaltyAmount)
	$: isOwner = thingInfo.owner === thingInfo.creator
	$: buttonDisabled = sellTxStamps_to_xian.isGreaterThan($currency) || price.isLessThanOrEqualTo(0) || price.isEqualTo(currentSellPrice)
	$: buttonText = sellTxStamps_to_xian.isGreaterThan($currency) ? `Insufficient ${config.currencySymbol}`: "List NFT!"

	onMount(() => {
		// Set initial value when component mounts
		inputValue = stringToFixed(currentSellPrice || 0, 8);
		price = toBigNumber(inputValue);
	})

    const sell = () => {
		const _price = price;
		const transaction = {
			methodName: 'sell_thing',
			networkType: config.networkType,
			kwargs: {
				uid: $showModal.modalData.thingInfo.uid,
				amount: {"__fixed__": _price.toString()}
			},
			stampLimit: stampLimits[config.masterContract].sell_thing
		}

		sendTransaction(transaction, handleSellTx)
        closeModel()
    }

	const handleSellTx = (txResults) => {
        if (txResults.status === 0) {
        	updateInfo({
				"price_amount": price,
        	})
			createSnack({
				title: `Listed!`,
				body: `${thingName} now listed for ${price} ${config.currencySymbol}.`,
				type: "info",
				link: buildExplorerLink(txResults.cometbft_hash)
			})
			updateInfo({
				"price_amount": price,
			})
		} else {
			createSnack({
				title: `Error!`,
				body: `Failed to list ${thingName}.`,
				type: "error",
				link: buildExplorerLink(txResults.cometbft_hash)
			})
		}
    }

	const handleInput = (e) => {
		let validateValue = e.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1')
		if (validateValue !== e) {
			inputValue = validateValue;
		} else {
			let value = toBigNumber(e);
			if (value.isNaN()) value = toBigNumber("0");
			value = toBigNumber(stringToFixed(value, 8));
			inputValue = stringToFixed(value, 8);
			price = value;
		}
	}

	// Handle input changes from Input component
	const handleInputChange = (event) => {
		handleInput(event.detail);
	}
</script>

<div class="modal-container">
	<div class="preview-section">
		{#if $showModal.modalData.thingInfo}
			<Preview 
				frames={$showModal.modalData.thingInfo.frames} 
				pixelSize={15}
				thingInfo={$showModal.modalData.thingInfo}
				border={false}
			/>
		{/if}
	</div>

	<div class="form-section">
		<form id="sell" on:submit|preventDefault={sell}>
			<h3 class="form-title">List NFT for Sale</h3>
			
			<div class="input-group">
				<label for="price">NFT Price</label>
				<div class="price-input">
					<Input 
						id="price" 
						type="number"
						value={inputValue}
						step="0.1" 
						required 
						on:input={handleInputChange} 
						placeholder={`Enter ${config.currencySymbol} amount`}
					/>
				</div>
			</div>

			<div class="info-section">
				<div class="info-item">
					<span class="info-label">Transaction Cost</span>
					<span class="info-value">{`${stringToFixed(sellTxStamps_to_xian, 4)} ${config.currencySymbol}`}</span>
				</div>

				{#if isOwner}
					<div class="info-item">
						<span class="info-label">Royalty Percentage</span>
						<span class="info-value">{royalty_percent}%</span>
					</div>

					<div class="info-item">
						<span class="info-label">Royalty Amount</span>
						<span class="info-value">{`${stringToFixed(royaltyAmount, 4)} ${config.currencySymbol}`}</span>
					</div>

					<div class="info-item highlight">
						<span class="info-label">You Receive</span>
						<span class="info-value">{`${stringToFixed(netAmount, 4)} ${config.currencySymbol}`}</span>
					</div>
				{/if}
			</div>

			<div class="button-container">
				<Button
					variant="primary"
					disabled={buttonDisabled}
					on:click={sell}
					class="action-button"
				>
					{buttonText}
				</Button>
			</div>
		</form>
	</div>
</div>

<style>
	.modal-container {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		width: 100%;
		max-width: 500px;
		margin: 0 auto;
		padding : 20px;
	}

	@media (min-width: 650px) {
		.modal-container {
			flex-direction: row;
			align-items: stretch; /* Changed to stretch to make equal heights */
			max-width: 800px;
		}

		.preview-section {
			flex: 0 0 40%; /* Reduce the size to 40% */
			max-width: 40%;
		}

		.form-section {
			flex: 0 0 58%; /* Slightly less than 60% to account for gap */
			max-width: 58%;
		}
	}

	.preview-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 0;
		border-radius: var(--border-radius);
		background-color: var(--color-background-secondary);
		width: 100%;
		overflow: hidden;
		border: 1px solid var(--color-border-secondary);
		aspect-ratio: 1/1; /* Ensure it's square */
	}

	/* Match Preview styling to NFTCard frame wrapper */
	.preview-section :global(.frame-wrapper) {
		width: 100%;
		height: 100%;
	}

	.preview-section :global(canvas) {
		width: 100% !important;
		height: 100% !important;
		object-fit: contain;
		image-rendering: pixelated;
	}

	.form-section {
		flex: 1;
		width: 100%;
	}

	.form-title {
		font-size: var(--font-size-xl);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		margin-top: 0;
		margin-bottom: var(--space-md);
		padding-bottom: var(--space-sm);
		border-bottom: 1px solid var(--color-border-secondary);
	}

	label {
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-secondary);
		margin-bottom: var(--space-xs);
		display: block;
	}

	.input-group {
		margin-bottom: var(--space-md);
	}

	.info-section {
		margin-top: var(--space-lg);
		padding: var(--space-md);
		border-radius: var(--border-radius);
		background-color: var(--color-background-secondary);
		border: 1px solid var(--color-border-secondary); /* Match NFTCard border */
	}

	.info-item {
		display: flex;
		justify-content: space-between;
		margin-bottom: var(--space-xs);
	}

	.info-label {
		color: var(--color-text-secondary);
		font-size: var(--font-size-sm);
	}

	.info-value {
		color: var(--color-text-primary);
		font-weight: var(--font-weight-medium);
		font-size: var(--font-size-sm);
	}

	.highlight {
		font-weight: var(--font-weight-semibold);
		padding-top: var(--space-sm);
		margin-top: var(--space-sm);
		border-top: 1px solid var(--color-border-secondary);
	}

	.highlight .info-label,
	.highlight .info-value {
		font-size: var(--font-size-md);
		color: var(--color-text-primary);
	}

	.button-container {
		margin-top: var(--space-lg);
		display: flex;
		justify-content: center;
	}

	.action-button {
		width: 100%;
		max-width: 200px;
	}
</style>
