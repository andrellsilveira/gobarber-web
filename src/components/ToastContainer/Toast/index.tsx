import React, { useEffect } from 'react';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiXCircle,
} from 'react-icons/fi';

import { ToastMessage, useToast } from '../../../hooks/toast';
import { Container } from './styles';

interface ToastProps {
  message: ToastMessage;
  style: object;
}

/**
 * Define o tipo de ícone do toats em uma variável
 * para utilização de acordo com o tipo que for
 * definido
 */
const icons = {
  info: <FiInfo size={24} />,
  success: <FiCheckCircle size={24} />,
  error: <FiAlertCircle size={24} />,
};

const Toast: React.FC<ToastProps> = ({ message, style }) => {
  const { removeToast } = useToast();

  /**
   * Remove o toast após 3 segundos de sua criação
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(message.id);
    }, 3000);

    /**
     * Ao retornar uma função de dentro de um "useEffect" ela
     * é executada automaticamente quando o componente for destruído
     */
    return () => {
      /**
       * Caso o toast seja fechado manualmente pelo usuário antes
       * dos 3 segundos, então a função timer será interrompida
       */
      clearInterval(timer);
    };
  }, [removeToast, message.id]);

  return (
    <Container
      type={message.type}
      /**
       * Não deve ser passado para um elemento HTML uma propriedade com valor booleano,
       * caso o valor da propriedade necessite ser verdadeiro ou falso ele deverá ser
       * convertido para um número
       */
      hasDescription={Number(!!message.description)}
      style={style}
    >
      {icons[message.type || 'info']}

      <div>
        <strong>{message.title}</strong>
        {message.description && <p>{message.description}</p>}
      </div>

      <button type="button" onClick={() => removeToast(message.id)}>
        <FiXCircle size={20} />
      </button>
    </Container>
  );
};

export default Toast;
