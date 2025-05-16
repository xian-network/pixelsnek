<script>
  export let size = '1em';
  export let color = 'currentColor';
  export let customClass = '';
  export let title = 'Location Icon';
</script>

<svg 
  width={size} 
  height={size} 
  viewBox="0 0 24 24" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg" 
  class="svelte-icon location-icon {customClass}"
  aria-label={title}
  role="img"
>
  <g fill-rule="evenodd">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path 
      d="M11.95 20.766c.741 0 1.163-.68 1.523-1.453l5.875-12.766c.18-.383.28-.734.28-1.04a1.14 1.14 0 0 0-1.155-1.155c-.305 0-.657.101-1.047.28L4.668 10.5c-.75.344-1.461.773-1.461 1.523 0 .875.82 1.196 1.875 1.196l5.492.015c.125 0 .172.047.172.172l.016 5.492c0 1.024.304 1.868 1.187 1.868zm.39-3.094.039-5.258c0-.578-.234-.82-.828-.812l-5.25.03c-.07 0-.094-.085-.008-.124l11.148-5.094c.118-.055.172.016.125.125l-5.101 11.149c-.04.078-.125.062-.125-.016z" 
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