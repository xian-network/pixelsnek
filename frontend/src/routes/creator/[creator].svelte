<script context="module">
	import { config } from '../../js/config.js'
	import { fetchThings } from "../../js/processGraphql.js";
    import { getOwnedUidsQuery } from "../../js/graphqlQueries.js";

	
	export async function preload({ params, query }) {
		let data = await fetchThings(getOwnedUidsQuery(params.creator))
	    return {created: data, creator: params.creator}
	}
</script>

<script>
    import Creator from "../../components/Creator.svelte";

	import { formatAccountAddress } from '../../js/utils'

    export let created
	export let creator
</script>

<svelte:head>
	<title>{`NFTs created by ${formatAccountAddress(creator)}`}</title>
</svelte:head>

<Creator {created} {creator}/>