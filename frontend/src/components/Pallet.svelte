<script>
    import { currentColor } from '../js/stores'
    import { color_to_letter, letter_to_color } from '../js/utils.js'

    $: pallet = makePallet()

    const makePallet = () => {
        let colors = JSON.parse(JSON.stringify(color_to_letter))
        delete colors['#ffffff00']
        delete colors['#ffffff']
        return colors
    }

    const changeCurrentColor = (index, letter) => {
        currentColor.update( curr => {
            curr[index] = letter;
            return curr
        })
    }

    const changePrimary = (e, letter) => {
        changeCurrentColor(0, letter)
    }
    const changeSecondary = (e, letter) => {
        changeCurrentColor(1, letter)
    }
</script>

<style>
    .pallet-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: var(--space-md, 16px);
        background-color: var(--color-background-secondary, #f5f5f5);
        border-radius: var(--border-radius, 8px);
        border: 1px solid var(--color-border-secondary, #e0e0e0);
        margin-bottom: var(--space-md, 16px);
    }
    
    .top-pallet {
        display: grid;
        width: fit-content;
        grid-template-columns: repeat(2, 30px);
        grid-template-rows: repeat(1, 30px);
        grid-gap: 4px;
        margin-bottom: 4px;
    }
    .pallet {
        display: grid;
        width: fit-content;
        grid-template-columns: repeat(5, 30px);
        grid-template-rows: repeat(11, 30px);
        grid-gap: 4px;
    }

    .color{
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid var(--color-border-secondary, #afafaf);
        border-radius: var(--border-radius-sm, 5px);
        font-weight: bold;
        color: var(--color-text-tertiary, darkgray);
        transition: all 0.2s ease-in-out;
    }
    .color:hover{
        position: relative;
        top: -2px;
        z-index: 1;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        cursor: pointer;
    }
    .selected{
        border: 2px solid var(--color-primary, var(--primary));
    }
    .selected-colors{
        display: grid;
        width: fit-content;
        grid-template-columns: 46px 46px;
        grid-template-rows: 46px;
        grid-gap: var(--space-xs, 4px);
        padding: var(--space-md, 16px);
        border: 1px dashed var(--color-primary, var(--primary));
        margin-bottom: var(--space-lg, 24px);
        border-radius: var(--border-radius-sm, 5px);
        background-color: var(--color-background-tertiary, #f9f9f9);
    }
    .selected-colors > div {
        position: relative;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        border: 1px solid var(--color-border-secondary, #afafaf);
        border-radius: var(--border-radius-sm, 5px);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: var(--color-text-tertiary, darkgray);
        font-size: 1.2em;
        cursor: pointer;
    }
    label{
        position: absolute;
        top: -16px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.7em;
        color: var(--color-primary, var(--primary));
        font-weight: bold;
        background-color: var(--color-background-primary, white);
        padding: 0 var(--space-xxs, 2px);
        border-radius: var(--border-radius-sm, 5px);
    }
</style>

<div class="pallet-container"
     on:drag|preventDefault
     >
    <div class="selected-colors">
        <div
            style={`background: ${letter_to_color[$currentColor[0]]}`}
            on:contextmenu|preventDefault={e => changeSecondary(e, $currentColor[0])}>
            {$currentColor[0] === "A" ? "X" : ""}
            <label>L</label>
        </div>
        <div
            style={`background: ${letter_to_color[$currentColor[1]]}`}
            on:click={e => changePrimary(e, $currentColor[1])}>
            {$currentColor[1] === "A" ? "X" : ""}
            <label>R</label>
        </div>
    </div>
    <div class="top-pallet" >
        <div class="color"
             style={`background: #ffffff00`}
             on:click={e => changePrimary(e, color_to_letter['#ffffff00'])}
             on:contextmenu|preventDefault={e => changeSecondary(e, color_to_letter['#ffffff00'])}>
             X
        </div>
        <div class="color"
             style={`background: #ffffff`}
             on:click={e => changePrimary(e, color_to_letter['#ffffff'])}
             on:contextmenu|preventDefault={e => changeSecondary(e, color_to_letter['#ffffff'])}>
        </div>
    </div>

    <div class="pallet" >
        {#each Object.keys(pallet) as color}
            <div class="color"
                 style={`background: ${color}`}
                 on:click={e => changePrimary(e, color_to_letter[color])}
                 on:contextmenu|preventDefault={e => changeSecondary(e, color_to_letter[color])}>
                {#if color === '#ffffff00'} X {/if}
            </div>
        {/each}
    </div>
</div>

