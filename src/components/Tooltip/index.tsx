import React from 'react';

import { Container } from './styles';

interface TooltipProps {
  title: string;
  /**
   * É necessário passar a classe de estilização para o componente
   * devido a este estar sendo estilizado através de elementos CSS
   * definidos para outro componente, no caso, o elemento "Error"
   * do componente "Input"
   * Essa propriedade não deve ser obrigatória, pois ele será preenchida
   * automaticamente quando os estilos definidos para o elemento "Error"
   * forem aplicados durante a renderização
   */
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ title, className, children }) => {
  return (
    <Container className={className}>
      {children}
      <span>{title}</span>
    </Container>
  );
};

export default Tooltip;
