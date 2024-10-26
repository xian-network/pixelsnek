<script>
	import { getContext } from 'svelte';
	import { walletInfo, walletInstalled } from '../js/stores.js';

    export let xdu;

    // const { isInstalled } = getContext('app_functions')

    // $: installed = isInstalled();
    // console.log({installed})
    walletInstalled.subscribe(value => {
        console.log({value})
    })
</script>

{#if $walletInstalled === 'not_installed'}
    <a href="https://chromewebstore.google.com/search/Xian"
       target="_blank"
       rel="noopener noreferrer"
       class="button">Install Wallet</a>
{:else if $walletInstalled === 'init'}
    <button class="button" disabled={true}>Loading...</button>
{:else}
     {#if $walletInfo?.locked ?? true}
        <button class="button" disabled={true}>Wallet Locked</button>
    {:else}
         {#if !$walletInfo?.address ?? false}
            <button class="button" on:click={() => xdu.sendConnection()}>Connect to Wallet</button>
         {/if}
    {/if}
{/if}