import React from 'react';
/**
 * Importa os componentes da biblioteca definindo alias para os mesmos
 */
import {
  Route as ReactDOMRoute,
  RouteProps as ReactDOMRouteProps,
  Redirect,
} from 'react-router-dom';

import { useAuth } from '../hooks/auth';

/**
 * Interface que herda as propriedades já existentes para o componente
 * "Route" da biblioteca "react-router-dom" e adiciona um nova propriedade
 * customizada
 */
interface RouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean;
  /**
   * Sobrescreve a tipagem da propriedade componente para que
   * seja possível a passagem de um componente sem a necessidade
   * da utilização de tags: <Componente />
   */
  component: React.ComponentType;
}

/**
 * Componente que sobrescreve o "Route" da biblioteca "react-router-dom"
 * para que seja possível alterar o comportamento das rotas da aplicação
 */
const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  /**
   * Recupera os dados de usuário do hook de autenticação
   */
  const { user } = useAuth();

  /**
   * O atributo "render" modifica a logística do componente
   * para a exibição da rota em tela:
   *
   * privado/autenticado = segue
   * privadp/não autenticado = redireciona para o login
   * não privado/autenticado = redireciona para o dashboard
   * não privado/não autenticado = segue
   */
  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        return isPrivate === !!user ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: isPrivate ? '/' : '/dashboard',
              /**
               * A propriedade state possibilita manter o histórico
               * de navegação entre as páginas
               */
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export default Route;
