/**
 * react v16.3引入新的context API
 */
import { createContext } from 'react';
const contextContent = {
  theme: {
    menuTheme: 'dark'
  }
};
const GlobalContext = createContext(contextContent);

export default GlobalContext;