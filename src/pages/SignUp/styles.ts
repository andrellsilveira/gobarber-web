import styled from 'styled-components';
import { shade } from 'polished';
import signUpBackgroundImg from '../../assets/sign-up-background.png';

export const Container = styled.div`
  height: 100vh;

  display: flex;
  /** "Estica" os elementos para o máximo possível dentro do elemento pai */
  align-items: stretch;
`;

export const Content = styled.div`
  display: flex;
  /** Distribui os itens na vertical */
  flex-direction: column;
  /** Centraliza os itens dentro do elemento, independentemento do eixo */
  place-content: center;
  /** Centraliza os itens no eixo horizontal */
  align-items: center;

  /** Indica que o elemento deve ocupar 100% do espaço disponível
  mas o tamanho total terá no máximo 700px */
  width: 100%;
  max-width: 700px;

  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;

    /** O sinal ">" indica que o estilo só deve ser aplicado ao elemento
    que se encontra diretamente dentro do elemento pai */
    > h1 {
      margin-bottom: 24px;
    }
  }

  > a {
    color: #f4ede8;
    display: block;
    margin-top: 24px;
    text-decoration: none;
    transition: color 0.2s;

    display: flex;
    align-items: center;

    &:hover {
      color: ${shade(0.2, '#f4ede8')};
    }

    svg {
      margin-right: 16px;
    }
  }
`;

export const Background = styled.div`
  /** Faz com que o elemento ocupe todo o espaço disponível */
  flex: 1;
  background: url(${signUpBackgroundImg}) no-repeat center;
  /** Indica que a imagem de fundo deve cobrir todo o espaço disponível */
  background-size: cover;
`;
