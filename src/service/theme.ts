
const KEY = 'theme'
const DARK = 'theme-dark'
const LIGHT = 'theme-light'

export function setTheme(themeName: string) {
    localStorage.setItem(KEY, themeName);
    document.documentElement.className = themeName;
    document.documentElement.setAttribute('data-bs-theme', themeName.split('-')[1] || themeName);
}

export function keepTheme() {
  if (localStorage.getItem(KEY)) {
    if (localStorage.getItem(KEY) === DARK) {
      setTheme(DARK);
    } else if (localStorage.getItem(KEY) === LIGHT) {
      setTheme(LIGHT)
    }
  } else {
    setTheme(DARK)
  }
}

export function toggleTheme() {
    if (localStorage.getItem(KEY)) {
      if (localStorage.getItem(KEY) === DARK) {
        setTheme(LIGHT);
        return LIGHT;
      } else if (localStorage.getItem(KEY) === LIGHT) {
        setTheme(DARK)
        return DARK;
      }
    } 
    setTheme(DARK)
    return DARK
  }

