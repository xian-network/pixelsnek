<script>
  export let size = '1em';
  export let color = 'currentColor';
  export let customClass = '';
  export let title = 'Play Icon';
</script>

<svg 
  width={size} 
  height={size} 
  viewBox="0 0 24 24" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg" 
  class="svelte-icon play-icon {customClass}"
  aria-label={title}
  role="img"
>
  <g fill-rule="evenodd">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path 
      d="M7.813 19.398c.351 0 .656-.109 1.054-.343l9.305-5.39c.695-.407 1.015-.75 1.015-1.298 0-.547-.32-.89-1.015-1.297L8.867 5.68c-.398-.227-.703-.344-1.055-.344-.687 0-1.21.523-1.21 1.383v11.304c0 .852.523 1.375 1.21 1.375z" 
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