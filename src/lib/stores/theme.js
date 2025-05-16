import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const THEME_KEY = 'xian_theme'; // Changed key to be more specific
const DEFAULT_THEME = 'dark';

const getInitialTheme = () => {
  if (!browser) {
    return DEFAULT_THEME;
  }
  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme) {
    return storedTheme;
  }
  // Check for system preference if no theme is stored
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return DEFAULT_THEME; // Fallback if no system preference detected or not supported
};

const initialTheme = getInitialTheme();

export const theme = writable(initialTheme);

export const toggleTheme = () => {
  theme.update(current => {
    const newTheme = current === 'light' ? 'dark' : 'light';
    return newTheme;
  });
};

if (browser) {
  // Function to apply the theme to the document and store it
  const applyTheme = (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
  };

  // Apply the initial theme when the script loads
  applyTheme(initialTheme);

  // Subscribe to theme changes to update the document and localStorage
  theme.subscribe(value => {
    applyTheme(value);
  });
} 