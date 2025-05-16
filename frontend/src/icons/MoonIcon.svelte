<script>
  export let size = '1em';
  export let color = 'currentColor';
  export let customClass = '';
  export let title = 'Moon Icon';
</script>

<svg 
  width={size} 
  height={size} 
  viewBox="0 0 24 24" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg" 
  class="svelte-icon moon-icon {customClass}"
  aria-label={title}
  role="img"
>
  <g fill-rule="evenodd">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path 
      d="M12.328 20.055c3.281 0 6.164-1.977 7.227-4.625.093-.227.125-.446.125-.57 0-.32-.227-.532-.5-.532-.157 0-.313.04-.524.133-.562.21-1.5.406-2.422.406-4.047 0-6.617-2.5-6.617-6.515 0-.915.203-2.079.492-2.704.102-.21.141-.382.141-.515a.513.513 0 0 0-.54-.524c-.124 0-.327.032-.538.118-2.914 1.171-4.852 4.21-4.852 7.46 0 4.57 3.446 7.868 8.008 7.868z" 
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