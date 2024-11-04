<script>
    import { getContext, onMount } from "svelte";

    // Misc
    import { alreadyLiked } from "../js/store-utils.js";
    import { config } from "../js/config.js";
    import { userAccount } from "../js/stores.js";
    import { buildExplorerLink } from "../js/utils.js";
    import { createSnack } from "../js/store-utils";

    //Pictures
    import LikeFilledIcon from "../../src/img/like-filled.svg";
    import LikeUnfilledIcon from "../../src/img/like-unfilled.svg";

    const { sendTransaction } = getContext("app_functions");

    export let thingInfo;
    export let width = 20;

    let liked = null;

    $: height = width * 1.5;

    onMount(() => {
        checkAlreadyLiked();
    });

    const checkAlreadyLiked = () => {
        alreadyLiked(thingInfo.uid);
        if (liked === null && $userAccount)
            alreadyLiked(thingInfo.uid).then((res) => (liked = res));
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
        console.log({ txResults });
        if (txResults.status == 0) {
            liked = true;
            thingInfo.likes = thingInfo.likes + 1;
            localStorage.setItem(
                `${thingInfo.uid}:${$userAccount}:liked`,
                true,
            );
            console.log("LIKED IT, CREATING SNACK NOW");
            createSnack({
                title: `You have liked this!`,
                type: "success",
                body: "Pixels make the heart grow fonder.",
                thingInfo: thingInfo,
                link: buildExplorerLink(txResults.cometbft_hash),
            });
        } else {
            liked = false;
            console.log("LIKING THIS FAILED");
            createSnack({
                title: `Liking this failed!`,
                type: "error",
                body: "Sorry ! There was an error liking this.",
                thingInfo: thingInfo,
                link: buildExplorerLink(txResults.cometbft_hash),
            });
        }
    };

    userAccount.subscribe((account) => checkAlreadyLiked());
</script>

<div class="flex-row flex-align-center likes">
    <div
        class="hide-mobile icon"
        class:logged-in={$userAccount}
        on:click={like}
        style={`width: ${width}px; height: ${height}px;`}
    >
        {#if liked !== null}
            {#if liked}
                <LikeFilledIcon width="21" />
            {:else}
                <LikeUnfilledIcon width="21" />
            {/if}
        {:else}
            <LikeUnfilledIcon width="21" />
        {/if}
    </div>

    <div class="show-mobile icon">
        <LikeUnfilledIcon width="22" />
    </div>
    {thingInfo.likes}
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
    }
    .logged-in {
        cursor: pointer;
    }
</style>
