<script>
  export let name = ''; 
  export let path = ''; 
  export let size = '1em'; 
  export let color = 'currentColor';
  export let viewBox = '0 0 24 24'; 

  $: svgPath = path || ''; 

</script>

{#if svgPath}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill={color}
    viewBox={viewBox}    
    class="icon {$$props.class || ''}"
    aria-hidden="true" 
    focusable="false" 
  >
    <path d={svgPath} fill-rule="evenodd" clip-rule="evenodd"/>
  </svg>
{/if}

<style>
  .icon {
    display: inline-block;
    vertical-align: middle; 
  }
</style> 