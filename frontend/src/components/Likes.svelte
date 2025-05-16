<script>
    import { getContext, onMount } from "svelte";

    // Misc
    import { alreadyLiked } from "../js/store-utils.js";
    import { config } from "../js/config.js";
    import { userAccount } from "../js/stores.js";
    import { buildExplorerLink } from "../js/utils.js";
    import { createSnack } from "../js/store-utils";

    //Pictures
    import LikeFilledIcon from "../../static/img/like-filled.svg";
    import LikeUnfilledIcon from "../../static/img/like-unfilled.svg";
    import { debug } from "svelte/internal";

    const { sendTransaction } = getContext("app_functions");

    export let thingInfo;
    export let width = 20;

    let liked = null;

    $: height = width * 1.5;

    onMount(() => {
        checkAlreadyLiked();
    });

    const checkAlreadyLiked = async () => {
        if ($userAccount) {
            // Try direct localStorage check first
            const lsKey = `${thingInfo.uid}:${$userAccount}:liked`;
            if (localStorage.getItem(lsKey)) {
                liked = true;
                return;
            }
            
            // Try the alreadyLiked function
            try {
                const res = await alreadyLiked(thingInfo.uid);
                liked = res;
                
                // Force save to localStorage for consistency if liked
                if (res === true) {
                    localStorage.setItem(lsKey, "true");
                }
            } catch (error) {
                console.error(`Error checking like status for ${thingInfo.uid}:`, error);
                liked = false;
            }
        }
    };

    const like = () => {
        if (liked || !$userAccount) return;

        const transaction = {
            methodName: "like_thing",
            networkType: config.networkType,
            kwargs: {
                uid: thingInfo.uid,
            },
        };

        sendTransaction(transaction, handleLikeTx);
    };

    const handleLikeTx = (txResults) => {
        if (txResults.status == 0) {
            liked = true;
            thingInfo.likes = Number(thingInfo.likes) + 1;
            localStorage.setItem(
                `${thingInfo.uid}:${$userAccount}:liked`,
                true,
            );
            createSnack({
                title: `You have liked this!`,
                type: "success",
                body: "Pixels make the heart grow fonder.",
                thingInfo: thingInfo,
                link: buildExplorerLink(txResults.cometbft_hash),
            });
        } else {
            liked = false;
            createSnack({
                title: `Liking this failed!`,
                type: "error",
                body: "Sorry ! There was an error liking this.",
                thingInfo: thingInfo,
                link: buildExplorerLink(txResults.cometbft_hash),
            });
        }
    };

    userAccount.subscribe(account => {
        if (account) {
            checkAlreadyLiked().catch(err => {
                console.error(`Error during checkAlreadyLiked for ${thingInfo.uid}:`, err);
            });
        }
    });
</script>

<div class="flex-row flex-align-center likes">
    <div
        class="hide-mobile icon"
        class:logged-in={$userAccount}
        on:click={like}
        style={`width: ${width}px; height: ${height}px;`}
    >
        {#if liked === true}
            <LikeFilledIcon width="21" />
        {:else}
            <LikeUnfilledIcon width="21" />
        {/if}
    </div>

    <div class="show-mobile icon">
        <LikeUnfilledIcon width="22" />
    </div>
    <h2>{thingInfo.likes}</h2>
</div>

<style>
    .flex-row {
        align-items: center;
        justify-content: space-between;
    }
    .icon {
        margin-right: 6px;
        position: relative;
        top: 3.5px;
        padding: 10px;
    }
    .logged-in {
        cursor: pointer;
    }

    /* .likes {
        border: 1px solid red;
    } */
</style>
