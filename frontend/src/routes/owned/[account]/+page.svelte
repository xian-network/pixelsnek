<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import Owned from "../../../components/Owned.svelte";
    import { formatAccountAddress } from '../../../js/utils';
	import { fetchThings } from "../../../js/processGraphql.js";
    import { getOwnedUidsQuery } from "../../../js/graphqlQueries.js";

	// export async function preload({ params, query }) {
	// 	try {
	// 		let things = await fetchThings(getOwnedUidsQuery(params.account));
	// 		return {
	// 			account: params.account,
	// 			owned: things
	// 		}
	// 	} catch (error) {
	// 		console.error("Error fetching owned things:", error);
	// 		return {
	// 			account: params.account,
	// 			owned: [],
	// 			error: error.message
	// 		}
	// 	}
	// }

    let owned;
    let error = null;
    let loading = true;
    let account;

    $: account = $page.params.account;

    onMount(async () => {
        if (!account) return;
        try {
            owned = await fetchThings(getOwnedUidsQuery(account, 0, 10))
            loading = false;
            console.log({owned})

            // owned = await response.json();
        } catch (err) {
            console.error("Error fetching owned things:", err);
            error = err.message;
        } finally {
            loading = false;
        }
    });
</script>

<svelte:head>
	<title>{`NFTs owned by ${formatAccountAddress(account)}`}</title>
</svelte:head>

{#if loading}
    <p>Loading...</p>
<!-- {:else if error}
    <p>Error: {error}</p> -->
{:else if account && owned}
    <Owned {owned} {account}/>
<!-- {:else}
    <p>No account specified</p> -->
{/if}


