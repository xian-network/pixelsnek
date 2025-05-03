<script>
    import {getContext, onMount, createEventDispatcher} from 'svelte'

    // Misc
    import {userAccount, autoTx, auctions} from '../js/stores.js'
    import { createWatermark } from '../js/utils.js'
    import {alreadyLiked, createSnack} from '../js/store-utils.js'
    import { config } from '../js/config.js';

    // Components
    import Frame from './Frame.svelte'
    import FrameCanvas from './FrameCanvas.svelte'
    import Price from './Price.svelte'
    import Likes from "./Likes.svelte";

    //Pictures
    import ArtistIcon from '../../static/img/artist.svg'
    import OwnerIcon from '../../static/img/owner.svg'


    const {sendTransaction} = getContext('app_functions')


    export let thingInfo;
    export let index;
    export let pixelSize = 5;

    let frames = thingInfo.frames

    let switcher;
    let liked = null;

    const dispatch = createEventDispatcher();

    $: show = 1
    $: auctioninfo = $auctions.find(f => f.uid === thingInfo.uid)
    $: activeAuction = auctioninfo ? true : false

    onMount(() => {
        checkAlreadyLiked();
        switcher = setInterval(switchFrames, Number(thingInfo.speed))
        return (() => clearInterval((switcher)))
    })

    const checkAlreadyLiked = () => {
        if (liked === null && $userAccount) alreadyLiked(thingInfo.uid, localStorage).then(res => liked = res)
    }

    const switchFrames = () => {
        if (show > frames.length) show = 1
        else show = show === frames.length ? 1 : show + 1;
    }

    const like = () => {
        if (liked || !$userAccount) return;

        const transaction = {
            methodName: 'like_thing',
            networkType: config.networkType,
            kwargs: {
                uid: thingInfo.uid
            }
        }

        if (!$autoTx) {
            createSnack({
                title: `Liking ${thingInfo.name}`,
                body: 'Check for Xian Wallet popup to approve transaction.',
                type: "info"
            })
        }

        sendTransaction(transaction, handleLikeTx)
    }

    const handleLikeTx = () => {
        // if (txResults.txBlockResult.status === 0) {
        //     liked = true;
        //     thingInfo.likes = thingInfo.likes + 1;
        //     createSnack({
        //         title: `${thingInfo.name}`,
        //         body: 'You liked this creation!',
        //         type: "info"
        //     })
        // }
        liked = true;
        thingInfo.likes = thingInfo.likes + 1;
        createSnack({
            title: `${thingInfo.name}`,
            body: 'You liked this creation!',
            type: "info"
        })
    }

    const updateThingInfo = (updates) => {
        dispatch('update', {index, updates})
    }

    userAccount.subscribe(account => checkAlreadyLiked())

</script>

<style>
    .retro-monitor {
        background-color: var(--card-bg); /* Modern semi-transparent background */
        border: 1px solid rgba(255, 255, 255, 0.1); /* Subtle border */
        padding: 16px; /* More generous padding */
        position: relative;
        width: 240px; /* Consistent width for all cards */
        height: 420px; /* Fixed height for all cards */
        margin: 1em; /* More margin for better spacing */
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        border-radius: 16px; /* Rounded corners for modern look */
        overflow: hidden; /* Keep content within rounded corners */
        backdrop-filter: blur(10px); /* Glass effect */
        -webkit-backdrop-filter: blur(10px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); /* Elegant shadow */
        transition: all 0.3s ease;
    }

    /* Remove antennas for modern look */
    .retro-monitor::before,
    .retro-monitor::after {
        display: none;
    }

    /* Add hover effect */
    .retro-monitor:hover {
        transform: translateY(-10px); /* Lift effect on hover */
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25),
                    0 0 30px rgba(123, 93, 250, 0.3); /* Colorful glow */
    }

    /* NFT highlight effects */
    .nft-glow {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: linear-gradient(45deg, rgba(123, 93, 250, 0.15), rgba(59, 130, 246, 0.15));
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none; /* Allow clicks to pass through */
        z-index: 1;
    }
    
    .retro-monitor:hover .nft-glow {
        opacity: 1;
    }
    
    /* Antenna tip styles */
    .antenna-tip-left, .antenna-tip-right {
        border-radius: 50%; /* Make it round */
        bottom: 100%; /* Position above the monitor frame */
        margin-bottom: 11px; /* Position at the end of the antenna height + spacing */
    }

    .antenna-tip-left {
        left: 35%;
        transform: translateX(-45%) rotate(-30deg) translateX(-1px) translateY(-1px); /* Position relative to left antenna */
    }

    .antenna-tip-right {
        right: 35%;
        transform: translateX(45%) rotate(30deg) translateX(1px) translateY(-1px); /* Position relative to right antenna */
    }

    .monitor-screen {
        background-color: var(--pure-black); /* Screen background */
        border: 2px inset var(--gray-6); /* Inset border for screen effect */
        padding: 5px; /* Small padding around the canvas */
        display: block; /* Ensure it behaves like a block */
        line-height: 0; /* Prevent extra space below canvas */
        margin-bottom: 5px; /* Space below screen */
    }

    .monitor-screen a {
        display: block; /* Make link fill the screen area */
        line-height: 0;
    }

    /* Adjust title styles */
    .title {
        justify-content: space-between;
        align-items: center;
        margin: 0 0 3px 0; /* Reduced margin */
        width: 100%; /* Ensure it takes full width inside monitor */
        order: 1; /* Position title first */
    }
    .title > a {
        align-self: center;
        color: var(--pure-white); /* Usar blanco puro para máxima legibilidad */
        font-weight: 600; /* Hacerlo más bold para mejor legibilidad */
        font-size: 1em; /* Aumentar tamaño de fuente */
        margin: 0;
        cursor: pointer;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block; /* Ensure it takes space */
        max-width: 190px; /* Mayor ancho para mostrar más texto */
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); /* Sombra para mejorar legibilidad */
        padding: 5px 0; /* Más espacio alrededor del texto */
    }

    /* Adjust icons styles */
    .icons {
        margin: 0 0 5px 0; /* Reduced margin */
        width: 100%;
        order: 2; /* Position icons second */
        justify-content: space-between; /* Space out icons */
    }
    .icon {
        width: 16px; /* Slightly smaller icons */
        height: 16px;
        fill: var(--pure-black); /* Change icon color */
    }
    .icons a {
        line-height: 0; /* Fix alignment */
    }
    .icons > .flex-grow {
        flex-grow: 0; /* Don't let owner icon grow */
    }
    /* Ensure Likes component aligns */
    :global(.likes-component) { /* Target Likes component if needed */
         color: var(--pure-black);
    }

    /* Adjust description styles */
    .description {
        overflow: hidden; /* Hide overflow */
        word-break: break-word;
        flex-grow: 0; /* Don't allow description to grow */
        display: block; /* Change from flex */
        width: 100%;
        margin: 5px 0; /* Add some margin */
        order: 4; /* Position description fourth */
        height: 70px; /* Fixed height for description */
    }
    .description > p {
        width: 100%;
        margin: 0;
        overflow: hidden;
        font-size: 0.9em; /* Aumentar tamaño de texto */
        color: var(--pure-white); /* Cambiar a blanco para mayor contraste */
        line-height: 1.4; /* Mejorar espaciado entre líneas */
        max-height: 100%;
        text-overflow: ellipsis;
        padding: 6px 8px; /* Añadir padding */
        background-color: rgba(0, 0, 0, 0.4); /* Fondo oscuro semitransparente */
        border-radius: 6px; /* Bordes redondeados */
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7); /* Sombra de texto para mejor legibilidad */
        font-weight: 400; /* Peso de fuente medio */
        display: -webkit-box; /* Para ellipsis multilínea */
        -webkit-line-clamp: 3; /* Mostrar máximo 3 líneas */
        -webkit-box-orient: vertical;
    }

    /* Power LED (New - attached to .retro-monitor) */
    .power-led {
        position: absolute;
        bottom: 5px; /* Position near bottom left of monitor frame */
        left: 5px;
        width: 5px; /* LED size */
        height: 5px;
        background-color: #39FF14; /* Bright green LED color */
        border: 1px solid var(--pure-black);
        border-radius: 1px; /* Slightly rounded square */
        box-shadow: 0 0 2px #39FF14; /* Glow effect */
        z-index: 1; /* Ensure it's above the monitor background */
    }

    /* Style for auction/price section */
    .monitor-controls {
        width: 100%;
        margin-top: auto; /* Push to bottom */
        padding-top: 5px;
        order: 5; /* Position last */
    }

    .auction {
        font-size: 0.8em;
        text-align: center;
        display: block;
        color: var(--primary-highlight);
    }

    .buy-like {
        align-items: center;
        justify-content: space-between;
        width: 100%;
        flex-wrap: wrap;
    }

    /* Adjust FrameCanvas container */
    .monitor-screen-container {
         order: 3; /* Position screen third */
         width: 100%;
         text-align: center; /* Center canvas if smaller than screen */
    }

</style>

<!-- Retro Monitor Wrapper -->
<div class="retro-monitor">
    <!-- Antenna Tips -->
    <div class="antenna-tip-left"></div>
    <div class="antenna-tip-right"></div>

    <!-- Power LED -->
    <div class="power-led"></div>

    <!-- Title -->
    <div class="title flex-row">
        <a href={`./frames/${thingInfo.uid}`} class="name" title={thingInfo.name}>{thingInfo.name}</a>
    </div>

    <!-- Icons -->
    <div class="icons text-color-gray-5 flex-row flex-align-center">
        <a href={`./creator/${thingInfo.creator}`} class="icon" title={`Creator: ${thingInfo.creator}`}>
            <ArtistIcon width="16"/>
        </a>
        <a href={`./owned/${thingInfo.owner}`} class="icon" title={`Owner: ${thingInfo.owner}`}>
            <OwnerIcon width="16"/>
        </a>
        <Likes {thingInfo} />
    </div>

    <!-- Screen -->
    <div class="monitor-screen-container">
        <div class="monitor-screen">
            <a href={`./frames/${thingInfo.uid}`}>
                {#if frames.length >= show}
                    <FrameCanvas {pixelSize} pixels={frames[show - 1]} watermark={createWatermark(thingInfo, $userAccount)}/>
                {/if}
            </a>
        </div>
    </div>

    <!-- Description -->
    <div class="description">
        <p title={thingInfo.description}>{thingInfo.description}</p>
    </div>

    <!-- Controls (Auction/Price) -->
    <div class="monitor-controls">
        {#if activeAuction}
            <a href={`./frames/${thingInfo.uid}#auction`} class="auction">view active auction</a>
        {:else}
            <div class="flex-row buy-like">
                <Price {thingInfo} updateInfo={updateThingInfo}/>
            </div>
        {/if}
    </div>

</div>
<!-- End Retro Monitor Wrapper -->




