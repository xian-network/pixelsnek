<script>
    import { getContext } from "svelte";
    import { walletInfo, walletInstalled } from "../js/stores.js";
    import Button from "./Button.svelte";

    export let xdu;
</script>

<div style="height: 30px;">
    {#if $walletInstalled === "not_installed"}
        <Button
            variant="primary-medium"
            href="https://chromewebstore.google.com/search/Xian"
            target="_blank"
            rel="noopener noreferrer"
        >
            Install Wallet
        </Button>
    {:else if $walletInstalled === "init"}
        <Button variant="primary-medium" disabled={true}>Loading...</Button>
    {:else if $walletInfo?.locked ?? true}
        <Button variant="primary-medium" disabled={true}>Wallet Locked</Button>
    {:else if !$walletInfo?.address ?? false}
        <Button variant="primary-medium" on:click={() => xdu.sendConnection()}
            >Connect to Wallet</Button
        >
    {/if}
</div>

<style>
    /* 
  .button { ... old styles ... } 
  It's better if these are removed to avoid conflicts with Button.svelte styles 
  or global styles if .button was intended to be global.
  If there were specific layout styles here (e.g., margin), they might need to be reapplied 
  directly to the <Button> components via props or a wrapper div if necessary.
  For now, I will assume Button.svelte handles all necessary button appearance.
  */
</style>
