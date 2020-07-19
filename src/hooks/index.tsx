import React from 'react';

import { AuthProvider } from './auth';
import { ToastProvider } from './toast';

/**
 * Este componente isola os hooks e contextos que aninham os demais
 * componentes da aplicação como o hook de autenticação e exibição de
 * toasts
 * @param children: Componentes e elementos HTML que são passados
 * para dentro do componente
 */
const AppProvider: React.FC = ({ children }) => {
  return (
    <AuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </AuthProvider>
  );
};

export default AppProvider;
