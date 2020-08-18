import React, { ButtonHTMLAttributes } from 'react';
import { boolean } from 'yup';
import { Container } from './styles';

/**
 * Interfaces que não possuem atributos são convertidas em "types"
 * Nesse caso estão sendo importados todos os atributos do botão padrão do HTML e também
 * está sendo definido o atributo "loading"
 */
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

/**
 * children: São os valores definidos dentro das tags de um elemento
 * rest: São os atributos de um elemento
 */
const Button: React.FC<ButtonProps> = ({ children, loading, ...rest }) => (
  <Container
    {
      /**
       * "Spread" das propriedade do elemento, ou seja,
       * todas as propriedade existentes são atribuídas a ele
       */ ...rest
    }
  >
    {loading ? 'Carregando...' : children}
  </Container>
);

export default Button;
