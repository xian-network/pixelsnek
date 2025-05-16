<script>
  export let size = '1em';
  export let color = 'currentColor';
  export let customClass = '';
  export let title = 'Close Icon';
</script>

<svg 
  width={size} 
  height={size} 
  viewBox="0 0 14 14" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg" 
  class="svelte-icon close-icon {customClass}"
  aria-label={title}
  role="img"
>
  <g opacity=".6" fill={color}>
    <path 
      d="M13.3.71a.996.996 0 0 0-1.41 0L7 5.59 2.11.7A.996.996 0 1 0 .7 2.11L5.59 7 .7 11.89a.996.996 0 1 0 1.41 1.41L7 8.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L8.41 7l4.89-4.89c.38-.38.38-1.02 0-1.4z" 
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