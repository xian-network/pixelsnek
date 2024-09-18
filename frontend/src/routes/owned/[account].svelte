<script context="module">
	import { config } from '../../js/config.js'
	export async function preload({ params, query }) {
		try {
			let things = await this.fetch(`./owned/${params.account}.json?limit=25`).then(res => res.json())
			return {
				account: params.account,
				owned: things
			}
		} catch (error) {
			console.error("Error fetching owned things:", error);
			return {
				account: params.account,
				owned: [],
				error: error.message
			}
		}
	}
</script>

<script>
    import Owned from "../../components/Owned.svelte";
    import { formatAccountAddress } from '../../js/utils'

    export let account
    export let owned
    export let error = null
</script>

<svelte:head>
	<title>{`NFTs owned by ${formatAccountAddress(account)}`}</title>
</svelte:head>

{#if error}
    <p>Error: {error}</p>
{:else}
    <Owned owned={owned} {account}/>
{/if}


