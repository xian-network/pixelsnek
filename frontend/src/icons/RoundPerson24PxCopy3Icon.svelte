<script>
  export let size = '1em';
  export let color = 'currentColor';
  export let customClass = '';
  export let title = 'Person/Info Icon';
</script>

<svg 
  width={size} 
  height={size} 
  viewBox="0 0 24 24" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg" 
  class="svelte-icon person-info-icon {customClass}"
  aria-label={title}
  role="img"
>
  <g fill-rule="evenodd" opacity=".6">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path 
      d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zm0 2a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm0 5a1 1 0 0 1 1 1v5a1 1 0 0 1-2 0v-5a1 1 0 0 1 1-1zm0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" 
      fill={color}
      fill-rule="nonzero"
    />
  </g>
</svg>

<style>
  .svelte-icon {
    display: inline-block;
    vertical-align: middle;
  }
</style> 