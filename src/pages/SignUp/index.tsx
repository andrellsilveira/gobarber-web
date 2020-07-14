import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiLock, FiMail, FiUser } from 'react-icons/fi';
/**
 * Biblioteca da Rocketseat para manipulação dos dados do formulário.
 * Nesse caso está sendo importado o componente "Form"
 */
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationsError';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background } from './styles';

const SignUp: React.FC = () => {
  /**
   * Cria um referência para o formulário
   * A "FormHandles" é uma interface que possui a tipagem de
   * todas as funções disponíveis para o elemento Form
   */
  const formRef = useRef<FormHandles>(null);

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
        name: Yup.string().required('O nome é obrigatório!'),
        email: Yup.string()
          .required('O e-mail é obrigatório')
          .email('Informe um e-mail válido!'),
        password: Yup.string().min(
          6,
          'A senha deve ter no mínimo 6 caracteres',
        ),
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
      <Background />
      <Content>
        <img src={logoImg} alt="GoBarber" />

        {/**
         * O atributo "initialData" define quais campos terão um
         * valor default e qual será esse valor para cada um deles
         * A notação para definição dos valores é a seguinte:
         *
         * initialData={{
         *  name: 'ALLS',
         *  email: 'alls@alls.net.br',
         * }}
         *
         * OBS.: O nome da propriedade deve ser o nome do elemento HTML
         */}
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Faça seu cadastro</h1>

          <Input name="name" icon={FiUser} placeholder="Nome" />
          <Input name="email" icon={FiMail} placeholder="E-mail" />
          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Senha"
          />

          <Button type="submit">Cadastrar</Button>
        </Form>

        <a href="criar">
          <FiArrowLeft />
          Voltar para logon
        </a>
      </Content>
    </Container>
  );
};

export default SignUp;
