import React, {
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { IconBaseProps } from 'react-icons';
/**
 * Biblioteca criada pela Rocketseat para utilização e registro dos
 * campos de um formulário
 */
import { useField } from '@unform/core';

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
 * name: Propriedade "name" do elemento
 * icon: Propriedade do tipo componente, onde deve ser convertido para a primeira
 * letra em maiúsculo para que o React o entenda e possa utilizá-lo como componente
 * rest: As demais propriedades do elemento
 */
const Input: React.FC<InputProps> = ({ name, icon: Icon, ...rest }) => {
  /**
   * Inicializa a referência do componente, caso um input do HTML
   */
  const inputRef = useRef<HTMLInputElement>(null);
  /**
   * Variáveis para manipulação do estado do elemento
   */
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  /**
   * Recupera alguns atributos do campo identificado pelo nome passado
   * para a função "useField"
   */
  const { fieldName, defaultValue, error, registerField } = useField(name);

  /**
   * O "useCallback" é um recurso do React para quando se faz necessário a
   * criação de uma função dentro de outra função (componente), de forma a evitar que
   * esse método seja recriado em memória toda vez que o componente for
   * renderizado novamente, uma vez que esse recurso fará com que a função
   * fique memorizada
   * Dessa forma, sempre que for necessário criar uma função dentro de um componente
   * deverá ser utilizado o "useCallback"
   * Informar uma variável como segundo parâmetro fará que a função seja atualizada
   * em memória quando o valor dessa variável for alterado
   */
  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    /**
     * Define se o elemento está preenchido
     * Os sinais "!!" transformam a sentença em booleano, no caso, se o valor do input
     * estiver preenchido (true), a primeira "!" negará (false) e segunda negará mais
     * uma vez (true), caso contrário, se o input estiver vazio (false), a primeira "!"
     * (true) e a segunda "!" (false)
     */
    setIsFilled(!!inputRef.current?.value);
  }, []);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  /**
   * Realiza o "registro" do campo assim que ele for inicializado em tela
   */
  useEffect(() => {
    /**
     * O método "registerField" pertence à biblioteca "@unform/core"
     * name: O nome do elemento. Aqui utiliza-se o atributo "fieldName", pois
     * a biblioteca pode alterar o nome do elemento em algumas condições
     * ref: Referência do elemento. A referência permite que o elemento
     * seja acessado pelo DOM como qualquer outro elemento HTML nativo
     * path: Identifica o caminho para recuperar o valor do input
     *
     * É necessário especificar as variáveis utilizadas dentro do "useEffect"como
     * segundo parâmetro
     */
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <Container isFocused={isFocused} isFilled={isFilled}>
      {
        /**
         * Só exibe o ícone se este for informado
         */
        Icon && <Icon size={20} />
      }
      <input
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        ref={inputRef}
        defaultValue={defaultValue}
        {
          /**
           * "Spread" das propriedade do elemento, ou seja,
           * todas as propriedade existentes são atribuídas a ele
           */
          ...rest
        }
      />
      {error}
    </Container>
  );
};

export default Input;
