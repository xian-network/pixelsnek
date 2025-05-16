<script>
  export let size = '1em';
  export let color = 'currentColor';
  export let customClass = '';
  export let title = 'Facebook Icon'; // Assuming group is Facebook
</script>

<svg 
  width={size} 
  height={size} 
  viewBox="0 0 20 20" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg" 
  class="svelte-icon facebook-icon {customClass}"
  aria-label={title}
  role="img"
>
  <g fill-rule="evenodd" opacity=".6">
    <path d="M0 0h20v20H0z" fill="none"/>
    <path 
      d="M18.333 10a8.333 8.333 0 1 0-9.635 8.232V12.41H6.582V10h2.116V8.164c0-2.088 1.244-3.242 3.148-3.242.911 0 1.865.163 1.865.163v2.05h-1.05c-1.036 0-1.359.643-1.359 1.302V10h2.311l-.37 2.409h-1.94v5.823A8.335 8.335 0 0 0 18.332 10" 
      fill={color}
    />
  </g>
</svg>

<style>
  .svelte-icon {
    display: inline-block;
    vertical-align: middle;
  }
</style> 