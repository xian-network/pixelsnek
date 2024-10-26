<!-- /frontend/src/routes/_layout.svelte -->

<script>
	// TODO - Royalties displayed on buy page
	// TODO - Backup Warning for Wallet connection
	// TODO - disclaimer when creating NFT
	// TODO - disclaimer when buying NFT
	// TODO - disclaimer when selling NFT

	import { onMount, beforeUpdate, setContext } from "svelte";

	// Components
	import Nav from "../components/Nav.svelte";
	import XianWalletUtils from "../js/xian-dapp-utils";
	import Snackbar from "../components/Snackbar.svelte";
	import Modal from "../components/Modal.svelte";
	import CreatedWithLove from "../components/CreatedWithLove.svelte";
	import AuctionUpdates from "../components/AuctionUpdates.svelte";

	// Misc
	import { approvalRequest } from "../js/wallet_approval";
	import { config, stampLimits } from "../js/config.js";
	import {
		walletInfo,
		showModal,
		userAccount,
		stampRatio,
		currency,
		tabHidden,
		tauPrice,
		walletInstalled,
		txnInProgress
	} from "../js/stores.js";
	import { stringToFixed, toBigNumber } from "../js/utils.js";
	import {
		processTxResults,
		createSnack,
		refreshTAUBalance,
		checkForApproval,
	} from "../js/store-utils.js";
	import { TransactionResultHandler } from "../js/transaction_result_handler";
	// import * as socketservice from '../js/socketservice'

	export let segment;

	let xdu;
	// let xduWalletInstalled = false;
	let lastCurrencyCheck = new Date();
	let txResultsHandler = TransactionResultHandler(createSnack);
	// let socket = socketservice.start()

	onMount(async () => {
		await initXianWallet();
		await checkWalletStatus();
		setInterval(checkWalletStatus, 1000);

		document.addEventListener("visibilitychange", setTabActive);
		refreshCurrencyBalance();
		refreshTauPrice();
		checkForApproval(config.masterContract);

		return () => {
			document.removeEventListener("visibilitychange", setTabActive);
		};
	});

	beforeUpdate(() => {
		// if (xdu) {
		// 	if (!$userAccount && xduWalletInfo.address) userAccount.set(xduWalletInfo.address)
		// }
		if (!$stampRatio) fetchStampRatio();
	});

	const fetchStampRatio = () => {
		fetch(`./stampRatio.json`)
			.then((res) => res.json())
			.then((res) => stampRatio.set(res.currentRatio));
	};

	setContext("app_functions", {
		sendTransaction: (transaction, callback) =>
			sendTransaction(transaction, callback),
		xdu: () => {
			return xdu;
		},
		// socket,
		// isInstalled: () => {
		// 	return xduWalletInstalled;
		// },
	});

	const initXianWallet = async () => {
		await XianWalletUtils.init(config.masternode);
		xdu = XianWalletUtils;
	}

	const checkWalletStatus = async () => {
		if ($txnInProgress) return;
		xdu = XianWalletUtils;
		// xduWalletInstalled = true;
		await xdu
			.requestWalletInfo()
			.then((info) => {
				handleWalletInfo(info);
				walletInstalled.set("installed");
			})
			.catch(() => walletInstalled.set("not_installed"));
	};

	const sendTransaction = async (transaction, callback) => {
		txnInProgress.set(true);
		let usersStamps = determineUsersTotalStamps();
		let contractName = transaction.contractName || config.masterContract;
		let stampsToSendTx = transaction.stampLimit;
		if (!stampsToSendTx)
			stampsToSendTx = stampLimits[contractName][transaction.methodName];

		if (usersStamps < stampsToSendTx) {
			createSnack({
				title: `Insufficient ${config.currencySymbol}`,
				body: `
					It will cost ${stringToFixed(toBigNumber(stampsToSendTx / $stampRatio), 4)} ${config.currencySymbol} to send this transaction.
					Please transfer more ${config.currencySymbol} to your Pixel Snek account using the Xian Wallet.
                `,
				type: "error",
				delay: 7000,
			});
		} else {
			transaction.stampLimit = stampsToSendTx;

			// 	const txResults = await xdu.sendTransaction(contractName, transaction.methodName, transaction.kwargs)
			// 	.catch(txResultsHandler.handleTransactionError)
			// 	txResultsHandler.handleTransaction(txResults)
			// }

			const txResults = await xdu
				.sendTransaction(
					contractName,
					transaction.methodName,
					transaction.kwargs,
					transaction.stampLimit,
				)
				.catch(txResultsHandler.handleTransactionError);
			txResultsHandler.handleTransaction(txResults, callback);
			txnInProgress.set(false);
		}
	};

	const determineUsersTotalStamps = () => {
		return parseInt($currency * $stampRatio);
	};

	const handleWalletInfo = (info) => {
		if (!info) return;
		// autoTx.set(xdu.autoTransactions)
		userAccount.set(info.address);
		walletInfo.set(info);
	};

	const refreshCurrencyBalance = async () => {
		if ($tabHidden || !$userAccount)
			setTimeout(refreshCurrencyBalance, 10000);
		else {
			await refreshTAUBalance();
			lastCurrencyCheck = new Date();
			setTimeout(refreshCurrencyBalance, 10000);
		}
	};

	const refreshTauPrice = async () => {
		if ($tabHidden || !$userAccount) setTimeout(refreshTauPrice, 60000);
		else {
			tauPrice.refreshPrice();
			setTimeout(refreshTauPrice, 60000);
		}
	};

	const setTabActive = () => {
		tabHidden.set(document.hidden);
		if (
			!$tabHidden &&
			$userAccount &&
			new Date() - lastCurrencyCheck > 5000
		)
			refreshTAUBalance();
		if (
			!$tabHidden &&
			$userAccount &&
			new Date() - tauPrice.lastCheck > 60000
		)
			tauPrice.refreshPrice();
	};
</script>

{#if $showModal.show}
	<Modal />
{/if}
<Snackbar />
<Nav {segment} {xdu} />
<main>
	<slot></slot>
</main>
<CreatedWithLove />
<AuctionUpdates />

<style>
	main {
		position: relative;
		max-width: 1600px;
		padding: 0 28px 10rem;
		margin: 1rem auto 0;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex-grow: 1;
	}
	@media (min-width: 450px) {
		main {
			padding: 0 28px 10rem;
			margin: 0 auto 0;
		}
	}
</style>
