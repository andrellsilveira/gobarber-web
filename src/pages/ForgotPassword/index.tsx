import React, { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiLogIn, FiMail } from 'react-icons/fi';

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

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  /**
   * Cria um estado para controle do feedback de carregamento
   */
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        /** Inicia o feedback de carregamento */
        setLoading(true);

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
         * Executa o processo de recuperação de senha na API
         */
        await api.post('/password/forgot', { email: data.email });

        /**
         * Dispara um toast na aplicação
         */
        addToast({
          type: 'success',
          title: 'E-mail de recuperação enviado!',
          description:
            'Enviamos um e-mail para a recuperação de senha, verifique sua caixa de entrada.',
        });

        /**
         * Redireciona para o dashboard
         */
        // history.push('/dashboard');
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
          title: 'Falha na recuperação de senha!',
          description:
            'Ocorreu um erro ao tentar realizar a recuperação de senha, tente novamente.',
        });
      } finally {
        /** Encerra o feedback de carregamento */
        setLoading(false);
      }
    },
    [addToast],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar senha</h1>

            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Button type="submit" loading={loading}>
              Recuperar
            </Button>
          </Form>

          <Link to="/">
            <FiLogIn />
            Voltar ao login
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
