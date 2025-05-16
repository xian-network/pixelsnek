<script>
  import Icon from './Icon.svelte';
  import XLogo from '../icons/XLogo.svelte';
  import TelegramIcon from '../icons/TelegramIcon.svelte';

  const currentYear = new Date().getFullYear();

  // Social icon paths (use Svelte components for X and Telegram)
  const githubIconPath = "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12z";

  const socialLinks = [
    { href: 'https://x.com/xian_network/', label: 'X', iconComponent: XLogo },
    { href: 'https://github.com/xian-network/pixelsnek/', label: 'GitHub', iconPath: githubIconPath },
    { href: 'https://t.me/xian_network', label: 'Telegram', iconComponent: TelegramIcon },
  ];
</script>

<footer class="main-footer {$$props.class || ''}">
  <div class="footer-container">
    <div class="footer-top">
      <div class="footer-branding">
        <span class="logo-text">PixelSnek</span>
        <p class="tagline">Create, animate, and mint pixel art on Xian.</p>
      </div>
      <div class="footer-socials">
        {#each socialLinks as link}
          <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label} class="social-link">
            {#if link.iconComponent}
              <svelte:component this={link.iconComponent} style="width:1.5em;height:1.5em;vertical-align:middle;" />
            {:else}
              <Icon path={link.iconPath} size="1.5em" />
            {/if}
          </a>
        {/each}
      </div>
    </div>

    <div class="footer-bottom">
      <p class="copyright">&copy; {currentYear} PixelSnek. All rights reserved.</p>
    </div>
  </div>
</footer>

<style>
  .main-footer {
    background-color: var(--color-background-secondary);
    color: var(--color-text-secondary);
    padding: var(--space-xl) var(--space-lg);
    border-top: 1px solid var(--color-border-secondary);
  }

  .footer-container {
    max-width: 1200px; /* Or your desired max width */
    margin: 0 auto;
  }

  .footer-top {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-lg);
    padding-bottom: var(--space-lg);
    margin-bottom: var(--space-lg);
    border-bottom: 1px solid var(--color-border-primary);
  }

  .footer-branding .logo-text {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
    display: block;
    margin-bottom: var(--space-xs);
  }
  .footer-branding .tagline {
    font-size: var(--font-size-sm);
    margin: 0;
  }

  .footer-socials {
    display: flex;
    gap: var(--space-md);
  }

  .social-link {
    color: var(--color-text-tertiary);
    transition: color 0.2s ease;
  }
  .social-link:hover,
  .social-link:focus-visible {
    color: var(--color-primary-accent);
    outline: none;
  }

  .footer-bottom {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-md);
    font-size: var(--font-size-sm);
  }

  .copyright {
    margin: 0;
  }

  @media (max-width: 768px) {
    .footer-top,
    .footer-bottom {
      flex-direction: column;
      align-items: center; /* Center items on smaller screens */
      text-align: center;
    }
    .footer-socials {
      margin-top: var(--space-md);
    }
    .copyright {
       margin-bottom: var(--space-sm);
    }
  }
</style> 