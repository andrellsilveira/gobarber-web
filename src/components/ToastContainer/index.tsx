import React from 'react';
import { useTransition } from 'react-spring';

import Toast from './Toast';

import { ToastMessage } from '../../hooks/toast';
import { Container } from './styles';

interface ToastContainerProps {
  messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
  /**
   * Inicializa uma variável para definição das animaçõs para os
   * elementos que serão exibidos em tela
   * A função "useTransition" recebe 3 parâmetros:
   * 1. Objeto (ou array) contendo os valores que serão exibidos
   * 2. Função que identifica a chave única entre os valores do objeto
   * 3. Objeto contendo as animações
   */
  const messagesWithTransitions = useTransition(
    messages,
    message => message.id,
    {
      from: { right: '-120%', opacity: 0 },
      enter: { right: '0%', opacity: 1 },
      leave: { right: '-120%', opacity: 0 },
    },
  );

  return (
    <Container>
      {
        /**
         * Ao utilizar o React Spring, é necessário realizar a
         * desestruturação do objeto no "map" para recuperar os
         * valores relevantes para utilização:
         * item: Objeto em sí, no caso, "message"
         * key: Chave única do objeto (message.id)
         * props: Propriedades da animação
         */
        messagesWithTransitions.map(({ item, key, props }) => (
          <Toast key={key} message={item} style={props} />
        ))
      }
    </Container>
  );
};

export default ToastContainer;
