import React, { ButtonHTMLAttributes } from 'react';
import { Container } from './styles';

/**
 * Interfaces que não possuem atributos são convertidas em "types"
 */
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * children: São os valores definidos dentro das tags de um elemento
 * rest: São os atributos de um elemento
 */
const Button: React.FC<ButtonProps> = ({ children, ...rest }) => (
  <Container
    {
      /**
       * "Spread" das propriedade do elemento, ou seja,
       * todas as propriedade existentes são atribuídas a ele
       */ ...rest
    }
  >
    {children}
  </Container>
);

export default Button;
