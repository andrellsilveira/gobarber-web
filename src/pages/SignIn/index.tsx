import React, { useCallback, useRef, useContext } from 'react';
import { FiLogIn, FiLock, FiMail } from 'react-icons/fi';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import AuthContext from '../../context/AuthContext';
import getValidationErrors from '../../utils/getValidationsError';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background } from './styles';

const SignIn: React.FC = () => {
  /**
   * Cria um referência para o formulário
   * A "FormHandles" é uma interface que possui a tipagem de
   * todas as funções disponíveis para o elemento Form
   */
  const formRef = useRef<FormHandles>(null);

  /**
   * Inicializa uma variável para utilização do contexto
   * Essa variável terá acesso a todas as propriedades e valores
   * definidos para o contexto
   */
  const auth = useContext(AuthContext);

  const handleSubmit = useCallback(async (data: object) => {
    try {
      /**
       * Limpa qualquer erro existente
       */
      formRef.current?.setErrors({});
      /**
       * Esquema criado para a validação dos dados do formulário,
       * onde indicamos para o Yup que os dados estão em formato de
       * objeto (object) o quel tem um formato definido pelo método
       * "shape"
       */
      const schema = Yup.object().shape({
        /**
         * Indica para o Yup que o campo "name" é do tipo "string" e
         * é obrigatório (required)
         */
        email: Yup.string()
          .required('Informe seu e-mail')
          .email('Informe um e-mail válido!'),
        password: Yup.string().required('Informe sua senha'),
      });

      /**
       * Executa a validação dos dados com base nas configurações
       * definidas para o esquema
       * A propriedade "abortEarly" tem como padrão o valor "true"
       * fazendo com que a validação retorne e pare no primeiro erro
       * encontrado, alterando seu valor para "false", todos os erros
       * serão retornados de um vez
       */
      await schema.validate(data, {
        abortEarly: false,
      });
    } catch (err) {
      /**
       * Recupera e formata os error
       */
      const errors = getValidationErrors(err);
      /**
       * Define os erros para o formulário
       */
      formRef.current?.setErrors(errors);
    }
  }, []);

  return (
    <Container>
      <Content>
        <img src={logoImg} alt="GoBarber" />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Faça seu logon</h1>

          <Input name="email" icon={FiMail} placeholder="E-mail" />
          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Senha"
          />

          <Button type="submit">Entrar</Button>

          <a href="forgot">Esqueci minha senha</a>
        </Form>

        <a href="criar">
          <FiLogIn />
          Criar conta
        </a>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
