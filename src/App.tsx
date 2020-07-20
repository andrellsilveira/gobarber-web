import React from 'react';
/**
 * Cria um alias com o nome "Router" para o componente que está
 * sendo importado: "BrowserRouter"
 */
import { BrowserRouter as Router } from 'react-router-dom';

import GlobalStyle from './styles/global';

import Routes from './routes';

/**
 * Componente que encpsula os demais componentes de contexto (hooks)
 * da aplicação
 */
import AppProvider from './hooks';

const App: React.FC = () => (
  <Router>
    <AppProvider>
      <Routes />
    </AppProvider>

    <GlobalStyle />
  </Router>
);

export default App;
