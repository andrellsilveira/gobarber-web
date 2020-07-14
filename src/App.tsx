import React from 'react';

import GlobalStyle from './styles/global';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

import AuthContext from './context/AuthContext';

const App: React.FC = () => (
  <>
    {/**
     * A propriedade "Provider" do contexto, identifica que todos
     * os componentes que estiverem aninhados dentro das tags
     * terão acesso às propriedades e valores daquele contexto
     */}
    <AuthContext.Provider value={{ name: 'ALLS' }}>
      <SignIn />
    </AuthContext.Provider>
    <GlobalStyle />
  </>
);

export default App;
