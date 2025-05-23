import { txnInProgress } from "./stores.js";

export const TransactionResultHandler = (createSnack) => {
	function handleTransaction(response, callback){
		if(response === null){
			console.log('Transaction responded with null')
			createSnack({
				title: 'Null response',
				body: 'Transaction responded with null',
				type: 'error'
			})
			return
		}
		// if (response?.errors || response.error || !response.success) {
		// 	console.error('Transaction failed:', response.errors || response.error || 'Unknown error');
		// 	createSnack({
		// 		title: 'Transaction failed',
		// 		body: response.errors?.message || response.error?.message || 'An unexpected error occurred',
		// 		type: 'error'
		// 	})
		// 	return;
		// }
		console.log('Transaction succeeded:', response);
		if(typeof callback === 'function') callback(response);
	}
	
	function handleTransactionError(error){
		console.error('Transaction error:', error);
		createSnack({
			title: 'Transaction Error',
			body: error,
			type: 'error'
		})
		txnInProgress.set(false);
	}

	return {
		handleTransaction,
		handleTransactionError
	}
}