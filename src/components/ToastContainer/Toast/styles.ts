import styled, { css } from 'styled-components';
import { animated } from 'react-spring';

interface ContainerProps {
  /**
   * O símbolo "?" identifica que a propriedade é opcional
   */
  type?: 'success' | 'error' | 'info';
  hasDescription: number;
}

/**
 * Isola alguns estilos em uma variável para serem uilizados
 * de acordo com o valor definido para uma propriedade do elemento
 */
const toastTypeVariations = {
  info: css`
    background: #ebf8ff;
    color: #3172b7;
  `,
  success: css`
    background: #e6fffa;
    color: #2e656a;
  `,
  error: css`
    background: #fddede;
    color: #c53030;
  `,
};

/**
 * As animações do React Spring não podem ser aplicadas a elementos
 * comuns do HTML, por isso é necessário utilizar a propriedade
 * "animated" seguida do elemento que será animado, no caso uma "div"
 */
export const Container = styled(animated.div)<ContainerProps>`
  width: 360px;
  position: relative;
  padding: 16px 30px 16px 16px;
  border-radius: 10px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
  display: flex;

  & + div {
    margin-top: 16px;
  }

  /**
  * Exibe o estilo da de acordo com o valor definido para o tipo
  * do Toast e, caso não tenha sido definido nenhum valor, então
  * formata com o padrão 'info'
  */
  ${props => toastTypeVariations[props.type || 'info']}

  > svg {
    margin: 4px 12px 0 0;
  }

  div {
    flex: 1;

    p {
      margin-top: 4px;
      font-size: 14px;
      opacity: 0.8;
      line-height: 20px;
    }
  }

  button {
    position: absolute;
    right: 16px;
    top: 19px;
    opacity: 0.6;
    border: 0;
    background: transparent;
    color: inherit;
  }

  /**
  * Caso o Toast não tenha descrição, adiciona alguns estilos
  * para o alinhamento dos itens
  */
  ${props =>
    !props.hasDescription &&
    css`
      align-items: center;

      svg {
        margin-top: 0;
      }
    `}
`;
