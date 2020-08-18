import React, { useCallback, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationsError';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background, AnimationContainer } from './styles';
import api from '../../services/api';

interface ResetPasswordFormData {
  password: string;
  passwordConfirmation: string;
}

const ResetPassword: React.FC = () => {
  /**
   * Cria um referência para o formulário
   * A "FormHandles" é uma interface que possui a tipagem de
   * todas as funções disponíveis para o elemento Form
   */
  const formRef = useRef<FormHandles>(null);

  /**
   * Importa os métodos para exibição e remoção de toasts
   * do hook de Toast
   */
  const { addToast } = useToast();

  /**
   * Possibilita a navegação entre as páginas da aplicação
   */
  const history = useHistory();

  /**
   * Possibilita a recuperação da URL
   */
  const location = useLocation();

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
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
          password: Yup.string().required('Informe sua senha'),
          passwordConfirmation: Yup.string().oneOf(
            [Yup.ref('password'), undefined],
            'Confirmação incorreta',
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

        /**
         * Recupera os query params da URL, no caso o token
         */
        const query = new URLSearchParams(location.search);
        const token = query.get('token');

        if (!token) {
          throw new Error();
        }

        /**
         * Executa o processo para reset de senha na API
         */
        await api.post('/password/reset', {
          token,
          password: data.password,
          passwordConfirmation: data.passwordConfirmation,
        });

        /**
         * Redireciona para o login
         */
        history.push('/');
      } catch (err) {
        /**
         * Verifica se o erro é otiginado a partir de um validação
         * da biblioteca Yup
         */
        if (err instanceof Yup.ValidationError) {
          /**
           * Recupera e formata os erros
           */
          const errors = getValidationErrors(err);
          /**
           * Define os erros para o formulário
           */
          formRef.current?.setErrors(errors);

          return;
        }

        /**
         * Dispara um toast na aplicação
         */
        addToast({
          type: 'error',
          title: 'Falha na redefinição da senha!',
          description:
            'Ocorreu uma falha ao redefinir a sua senha, tente novamente.',
        });
      }
    },
    [addToast, history, location],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Redefinir senha</h1>

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Nova senha"
            />
            <Input
              name="passwordConfirmation"
              icon={FiLock}
              type="password"
              placeholder="Confirmar a senha"
            />

            <Button type="submit">Redefinir</Button>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ResetPassword;
