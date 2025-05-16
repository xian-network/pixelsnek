<script>
  export let size = '1em';
  export let color = 'currentColor';
  export let customClass = '';
  export let title = 'Upgrade Icon';
</script>

<svg 
  width={size} 
  height={size} 
  viewBox="0 0 56 56" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg" 
  class="svelte-icon upgrade-f-icon {customClass}"
  aria-label={title}
  role="img"
>
  <g fill-rule="evenodd">
    <path d="M0 0h56v56H0z" fill="none"/>
    <path 
      d="M42.656 31.7c1.75 0 2.88-1.093 2.88-2.643 0-.747-.4-1.604-1.075-2.26l-13.471-13.8c-1.13-1.057-1.933-1.604-3.008-1.604-1.058 0-1.896.565-2.99 1.604l-13.49 13.8c-.674.656-1.093 1.513-1.075 2.26 0 1.55 1.13 2.644 2.88 2.644h29.35zm-.273 14.62c2.041 0 3.245-1.221 3.245-3.226v-4.302c0-2.024-1.204-3.245-3.245-3.245H13.599c-2.023 0-3.245 1.221-3.245 3.245v4.302c0 2.005 1.222 3.226 3.245 3.226h28.784z" 
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