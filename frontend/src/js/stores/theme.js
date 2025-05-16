import { writable } from 'svelte/store';

const THEME_KEY = 'xian_theme'; 
const DEFAULT_THEME = 'dark';

const getInitialTheme = () => {
  if (!process.browser) {
    return DEFAULT_THEME;
  }
  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme) {
    return storedTheme;
  }
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return DEFAULT_THEME;
};

const initialTheme = getInitialTheme();

export const theme = writable(initialTheme);

export const toggleTheme = () => {
  theme.update(current => {
    const newTheme = current === 'light' ? 'dark' : 'light';
    return newTheme;
  });
};

if (process.browser) {
  const applyTheme = (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
  };

  applyTheme(initialTheme);

  theme.subscribe(value => {
    applyTheme(value);
  });
} 