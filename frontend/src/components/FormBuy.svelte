<script>
    import { getContext } from 'svelte'

	// Misc
	import { showModal, currency, userAccount, approvalAmount, stampRatio } from '../js/stores.js'
	import { toBigNumber, stringToFixed, buildExplorerLink } from '../js/utils.js'
	import { createSnack, checkForApproval, closeModel } from '../js/store-utils.js'
	import { config, stampLimits } from '../js/config.js'

	// Components
	import Preview from './Preview.svelte'
	import Button from './Button.svelte'
	import Input from './Input.svelte'

    const { sendTransaction } = getContext('app_functions')

	const updateInfo = $showModal.modalData.updateInfo

	const uid = $showModal.modalData.thingInfo.uid
	const price = toBigNumber($showModal.modalData.thingInfo['price_amount'])
	const approvalTxStamps_to_xian = price.isGreaterThan(toBigNumber($approvalAmount[config.masterContract])) ? toBigNumber(stampLimits.currency.approve).dividedBy($stampRatio) : toBigNumber(0)
	const buyTxStamps_to_xian = toBigNumber(stampLimits[config.masterContract].buy_thing).dividedBy($stampRatio)
	const total_tx_fees = approvalTxStamps_to_xian.plus(buyTxStamps_to_xian)
	const total_xian_to_buy = price.plus(total_tx_fees)
	const thingName = $showModal.modalData.thingInfo['name']
	const thingInfo = $showModal.modalData.thingInfo

    const buy = () => {
		const transaction = {
			methodName: 'buy_thing',
			// networkType: config.networkType,
			kwargs: {
				uid
			}
		}

		sendTransaction(transaction, handleBuyTx)
		closeModel()
    }

	const approveBuy = () => {
		const transaction = {
			contractName: 'currency',
			methodName: 'approve',
			// networkType: config.networkType,
			kwargs: {
				amount: {"__fixed__": "100000000"},
				to: config.masterContract
			}
		}

		sendTransaction(transaction, handleApproveTx)
		closeModel()
	}

	const checkPrice = () => {
    	if (total_xian_to_buy.isGreaterThan($currency)){
			createSnack({
                title: `Insufficient ${config.currencySymbol}`,
                body: `
                	You need ${stringToFixed(total_xian_to_buy, 4)} ${config.currencySymbol} to buy this.
                	 ${stringToFixed(price, 4)} ${config.currencySymbol} plus ${stringToFixed(total_tx_fees, 4)} ${config.currencySymbol} for tx fees.`,
                type: "error"
            })
		}else{
    		approveAndSend();
		}
	}

	const approveAndSend = async () => {
		checkForApproval(config.masterContract).then((value) => {
			console.log(value)
			if (value < price){
				approveBuy();
			}else{
				buy();
			}
		})
	}

	const handleApproveTx = (txResults) => {
        if (txResults.status === 0) {
        	buy()
        }
		buy()
    }

	const handleBuyTx = (txResults) => {
        if (txResults.status === 0) {
        	updateInfo({
				owner: $userAccount,
				"price_amount": "0",
        	})
			createSnack({
				title: `Purchased!`,
				body: `You are now the proud owner of ${thingName}.`,
				type: "info",
				link: buildExplorerLink(txResults.cometbft_hash)
			})
			updateInfo({
				owner: $userAccount,
				"price_amount": "0",
			})
		} else {
			createSnack({
				title: `Error!`,
				body: `Failed to purchase ${thingName}.`,
				type: "error",
				link: buildExplorerLink(txResults.cometbft_hash)
			})
		}
    }

	const buttonText = total_xian_to_buy.isGreaterThan($currency) ? 
		`Insufficient ${config.currencySymbol}` :
		`Buy For ${stringToFixed(total_xian_to_buy, 4)} ${config.currencySymbol}`;
	
	const buttonDisabled = total_xian_to_buy.isGreaterThan($currency);
</script>

<div class="modal-container">
	<div class="preview-section">
		{#if thingInfo}
			<Preview 
				frames={thingInfo.frames} 
				pixelSize={15}
				{thingInfo}
				border={false}
			/>
		{/if}
	</div>

	<div class="form-section">
		<form id="buy" on:submit|preventDefault={checkPrice}>
			<h3 class="form-title">Purchase NFT</h3>
			
			<div class="nft-details">
				<div class="input-group">
					<label for="name">Name</label>
					<Input id="name" type="text" value={thingInfo.name} readonly />
				</div>
				
				<div class="input-group">
					<label for="description">Description</label>
					<div class="description-container">
						<p class="description-text">{thingInfo.description}</p>
					</div>
				</div>
			</div>

			<div class="info-section">
				<div class="info-item">
					<span class="info-label">NFT Price</span>
					<span class="info-value">{`${stringToFixed(price, 4)} ${config.currencySymbol}`}</span>
				</div>
				
				<div class="info-item">
					<span class="info-label">Transaction Cost</span>
					<span class="info-value">{`${stringToFixed(total_tx_fees, 4)} ${config.currencySymbol}`}</span>
				</div>

				<div class="info-item highlight">
					<span class="info-label">Total Cost</span>
					<span class="info-value">{`${stringToFixed(total_xian_to_buy, 4)} ${config.currencySymbol}`}</span>
				</div>
			</div>

			<div class="button-container">
				<Button
					variant="primary"
					disabled={buttonDisabled}
					on:click={checkPrice}
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
		padding: 20px;
	}

	@media (min-width: 650px) {
		.modal-container {
			flex-direction: row;
			align-items: stretch;
			max-width: 800px;
		}

		.preview-section {
			flex: 0 0 40%;
			max-width: 40%;
		}

		.form-section {
			flex: 0 0 58%;
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
		aspect-ratio: 1/1;
	}

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

	.description-container {
		background-color: var(--color-background-secondary);
		border: 1px solid var(--color-border-secondary);
		border-radius: var(--border-radius);
		padding: var(--space-md);
		max-height: 120px;
		overflow-y: auto;
	}

	.description-text {
		margin: 0;
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		line-height: 1.5;
	}

	.info-section {
		margin-top: var(--space-lg);
		padding: var(--space-md);
		border-radius: var(--border-radius);
		background-color: var(--color-background-secondary);
		border: 1px solid var(--color-border-secondary);
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