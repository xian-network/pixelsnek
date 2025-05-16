<script>
    export let pixels = [];
    export let pixelSize = 5;
    export let frameNum = 0;

    let grid = [];
    let gridSize = 0;

    $: {
        if (Array.isArray(pixels)) {
            gridSize = Math.sqrt(pixels.length);
            if (Number.isInteger(gridSize)) {
                grid = [];
                for (let i = 0; i < gridSize; i++) {
                    grid.push(pixels.slice(i * gridSize, (i + 1) * gridSize));
                }
            } else {
                console.warn('Invalid pixel data length:', pixels.length);
                grid = [];
            }
        } else {
            console.warn('Invalid pixels data:', pixels);
            grid = [];
        }
    }
</script>

<div class="board" style="--grid-size: {gridSize}; --pixel-size: {pixelSize}px;">
    {#each grid as row, i}
        {#each row as pixel, j}
            <div
                class="pixel"
                style="background-color: {pixel || '#000000'};"
                data-x={j}
                data-y={i}
            />
        {/each}
    {/each}
</div>

<style>
    .board {
        display: grid;
        grid-template-columns: repeat(var(--grid-size), var(--pixel-size));
        grid-template-rows: repeat(var(--grid-size), var(--pixel-size));
        gap: 0;
        background: #000;
        border: 2px solid var(--color-border);
        image-rendering: pixelated;
    }

    .pixel {
        width: var(--pixel-size);
        height: var(--pixel-size);
        box-sizing: border-box;
    }
</style>