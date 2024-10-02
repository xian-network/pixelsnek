<script>
    import { onMount } from 'svelte';
	import { stores } from '@sapper/app';
    import Owned from "../../components/Owned.svelte";
    import { formatAccountAddress } from '../../js/utils';

    const { page } = stores();

    let owned = [];
    let error = null;
    let loading = true;
    let account;

    $: account = $page.params.account;

    onMount(async () => {
        if (!account) return;
        try {
            const response = await fetch(`./owned/${account}.json?limit=25`);
            owned = await response.json();
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
{:else if error}
    <p>Error: {error}</p>
{:else if account}
    <Owned {owned} {account}/>
{:else}
    <p>No account specified</p>
{/if}


