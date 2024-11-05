<script>
    import Creator from "../../../components/Creator.svelte";

	import { formatAccountAddress } from '../../../js/utils';

	export let data;
	const { created, creator } = data;
</script>

<svelte:head>
	<title>{`NFTs created by ${formatAccountAddress(creator)}`}</title>
</svelte:head>

<Creator {created} {creator}/>