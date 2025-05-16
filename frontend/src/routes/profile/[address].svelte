<script>
    import { onMount } from 'svelte';
	import { stores } from '@sapper/app';
    import Owned from "../../components/Owned.svelte";
    import Creator from "../../components/Creator.svelte";
    import { formatAccountAddress, isXianKey } from '../../js/utils';
	import { fetchThings } from "../../js/processGraphql.js";
    import { getOwnedUidsQuery, getCreatedUidsQuery } from "../../js/graphqlQueries.js";
    import { config } from '../../js/config.js';
    import { userAccount } from '../../js/stores';

    const { page } = stores();

    let ownedNFTs = [];
    let createdNFTs = [];
    let error = null;
    let loadingOwned = true;
    let loadingCreated = true;
    let address;
    let previousAddress = null;
    let activeTab = 'created'; // Default to showing created NFTs first

    $: address = $page.params.address;
    $: isCurrentUser = $userAccount && $userAccount === address;
    
    // Watch for address changes and reload data when it changes
    $: if (address && address !== previousAddress) {
        loadProfileData(address);
    }

    async function loadProfileData(profileAddress) {
        // Reset data and set loading state
        loadingCreated = true;
        loadingOwned = true;
        createdNFTs = [];
        ownedNFTs = [];
        error = null;
        
        // Save current address to compare for future changes
        previousAddress = profileAddress;
        
        // Fetch created NFTs
        try {
            createdNFTs = await fetchThings(getCreatedUidsQuery(profileAddress, 0, 10));
            loadingCreated = false;
        } catch (err) {
            console.error("Error fetching created NFTs:", err);
            error = err.message;
            loadingCreated = false;
        }

        // Fetch owned NFTs
        try {
            ownedNFTs = await fetchThings(getOwnedUidsQuery(profileAddress, 0, 10));
            loadingOwned = false;
        } catch (err) {
            console.error("Error fetching owned NFTs:", err);
            error = err.message;
            loadingOwned = false;
        }
    }

    onMount(() => {
        if (address) {
            loadProfileData(address);
        }
    });

    $: isLoading = loadingOwned || loadingCreated;

    function setActiveTab(tab) {
        activeTab = tab;
    }
</script>

<svelte:head>
	<title>{`Profile: ${address ? formatAccountAddress(address) : 'Loading...'}`}</title>
</svelte:head>

<div class="profile-container">
    <div class="profile-header">
        <h1 class="profile-title">
            {#if isCurrentUser}
                My Profile
            {:else}
                Profile: {address ? formatAccountAddress(address, 8, 6) : ''}
            {/if}
        </h1>
        
        {#if address && isXianKey(address)}
            <a href="{`${config.blockExplorer}/addresses/${address}`}" 
               target="_blank" 
               rel="noopener noreferrer"
               class="blockchain-link">
                View on Blockchain Explorer
            </a>
        {/if}
    </div>

    {#if isLoading}
        <div class="loading-container">
            <p>Loading profile data...</p>
        </div>
    {:else}
        <div class="profile-tabs">
            <button 
                class="tab-button {activeTab === 'created' ? 'active' : ''}" 
                on:click={() => setActiveTab('created')}>
                Created NFTs
            </button>
            <button 
                class="tab-button {activeTab === 'owned' ? 'active' : ''}" 
                on:click={() => setActiveTab('owned')}>
                Owned NFTs
            </button>
        </div>
        
        <div class="profile-content">
            {#if activeTab === 'created'}
                <section class="profile-section" class:hidden={activeTab !== 'created'}>
                    <Creator created={createdNFTs} creator={address} />
                </section>
            {:else if activeTab === 'owned'}
                <section class="profile-section" class:hidden={activeTab !== 'owned'}>
                    <Owned owned={ownedNFTs} account={address} />
                </section>
            {/if}
        </div>
    {/if}
</div>

<style>
    .profile-container {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--space-md, 16px);
    }

    .profile-header {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        justify-content: space-between;
        margin-bottom: var(--space-lg, 24px);
        padding-bottom: var(--space-md, 16px);
        border-bottom: 1px solid var(--color-border-primary);
    }

    .profile-title {
        font-family: var(--font-family-sans);
        font-size: var(--font-size-2xl);
        color: var(--color-text-primary);
        margin: 0;
        letter-spacing: 0.15em;
        text-transform: uppercase;
    }

    .blockchain-link {
        color: var(--color-text-link);
        font-size: var(--font-size-sm);
        text-decoration: none;
    }

    .blockchain-link:hover {
        text-decoration: underline;
    }

    .loading-container {
        display: flex;
        justify-content: center;
        padding: var(--space-xl, 32px) 0;
        font-size: var(--font-size-md);
        color: var(--color-text-secondary);
    }

    .profile-tabs {
        display: flex;
        border-bottom: 2px solid var(--color-border-secondary);
        margin-bottom: var(--space-lg, 24px);
    }

    .tab-button {
        background: transparent;
        border: none;
        padding: var(--space-sm, 8px) var(--space-lg, 24px);
        font-family: var(--font-family-sans);
        font-size: var(--font-size-md);
        color: var(--color-text-secondary);
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
        letter-spacing: 0.15em;
        text-transform: uppercase;
    }

    .tab-button.active {
        color: var(--color-primary-accent);
    }

    .tab-button.active::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: var(--color-primary-accent);
    }

    .profile-content {
        min-height: 300px;
    }

    .profile-section {
        width: 100%;
    }

    .hidden {
        display: none;
    }

    @media (max-width: 600px) {
        .profile-title {
            font-size: var(--font-size-xl);
            margin-bottom: var(--space-sm, 8px);
        }

        .profile-header {
            flex-direction: column;
        }

        .tab-button {
            padding: var(--space-sm, 8px) var(--space-md, 16px);
            font-size: var(--font-size-sm);
        }
    }
</style> 