<script>
  export let size = '1em';
  export let color = 'currentColor';
  export let customClass = '';
  export let title = 'Twitter Icon'; // Assuming group-2 is Twitter
</script>

<svg 
  width={size} 
  height={size} 
  viewBox="0 0 20 20" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg" 
  class="svelte-icon twitter-icon {customClass}"
  aria-label={title}
  role="img"
>
  <g fill-rule="nonzero" opacity=".6">
    <path d="M0 0h20v20H0z" fill="none"/>
    <path 
      d="M6.9 16.772c6.287 0 9.727-5.214 9.727-9.727 0-.147 0-.293-.007-.44a6.964 6.964 0 0 0 1.707-1.773 6.928 6.928 0 0 1-1.967.54 3.44 3.44 0 0 0 1.507-1.894 6.8 6.8 0 0 1-2.174.827 3.412 3.412 0 0 0-2.493-1.08 3.423 3.423 0 0 0-3.42 3.42c0 .267.033.527.087.78A9.708 9.708 0 0 1 2.82 3.852a3.428 3.428 0 0 0 1.06 4.567 3.458 3.458 0 0 1-1.547-.427v.046c0 1.654 1.18 3.04 2.74 3.354-.286.08-.586.12-.9.12-.22 0-.433-.02-.64-.06a3.418 3.418 0 0 0 3.194 2.373 6.856 6.856 0 0 1-4.247 1.467c-.273 0-.547-.014-.813-.047A9.724 9.724 0 0 0 6.9 16.772" 
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