import React, { InputHTMLAttributes } from 'react';
import { IconBaseProps } from 'react-icons';

import { Container } from './styles';

/**
 * Cria uma interface que herda todas as propriedades do elemento
 * "input" do HTML, tornando o atributo "name" que é opcional em
 * obrigatório
 * */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  /**
   * Define a propriedade "icon" indicando que ela é do tipo
   * "componente"
   * A diretiva "IconBaseProps" define que o compoente "icon"
   * da interface terá acesso a todas as propriedades de um
   * componente ícone nativo
   */
  icon: React.ComponentType<IconBaseProps>;
}

/**
 * Disponibiliza as propriedade para o novo componente por meio da interface
 * icon: Propriedade do tipo componente, onde deve ser convertido para a primeira
 * letra em maiúsculo para que o React o entenda e possa utilizá-lo como componente
 * rest: As demais propriedades do elemento
 */
const Input: React.FC<InputProps> = ({ icon: Icon, ...rest }) => (
  <Container>
    {
      /**
       * Só exibe o ícone se este for informado
       */
      Icon && <Icon size={20} />
    }
    <input
      {
        /**
         * "Spread" das propriedade do elemento, ou seja,
         * todas as propriedade existentes são atribuídas a ele
         */
        ...rest
      }
    />
  </Container>
);

export default Input;
