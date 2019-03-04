import { createContext } from 'react';
const contextContent = {
  theme: {
    menuTheme: 'dark'
  }
};
const GlobalContext = createContext(contextContent);

export default GlobalContext;