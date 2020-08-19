import React, { useCallback, useRef, ChangeEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiLock, FiMail, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi';
/**
 * Biblioteca da Rocketseat para manipulação dos dados do formulário.
 * Nesse caso está sendo importado o componente "Form"
 */
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationsError';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AvatarInput } from './styles';
import { useAuth } from '../../hooks/auth';

interface ProfileFormData {
  name: string;
  email: string;
  oldPassword: string;
  password: string;
  passwordConfirmation: string;
}

const Profile: React.FC = () => {
  /**
   * Cria um referência para o formulário
   * A "FormHandles" é uma interface que possui a tipagem de
   * todas as funções disponíveis para o elemento Form
   */
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const history = useHistory();

  const { user, updateUser } = useAuth();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
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
          oldPassword: Yup.string(),
          password: Yup.string().when('oldPassword', {
            is: val => !!val.length,
            then: Yup.string().min(
              6,
              'A senha deve ter no mínimo 6 caracteres',
            ),
            otherwise: Yup.string(),
          }),
          passwordConfirmation: Yup.string()
            .when('password', {
              is: val => !!val.length,
              then: Yup.string().required('Confirme a nova senha'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), undefined], 'Confirmação incorreta'),
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

        const formData = {
          name: data.name,
          email: data.email,
          /**
           * Spread operator (...): Adiona as demais informações ao objeto somente se a
           * senha atual estiver preenchida
           */
          ...(data.oldPassword
            ? {
                oldPassword: data.oldPassword,
                password: data.password,
                passwordConfirmation: data.passwordConfirmation,
              }
            : {}),
        };

        /**
         * Executa a API passando os dados para a atualização do usuário
         */
        const response = await api.put('/profile', formData);

        /**
         * Atualiza os dados do usuário na sessão
         */
        updateUser(response.data);

        /**
         * Exibe um toast de sucesso
         */
        addToast({
          type: 'success',
          title: 'Perfil atualizado com sucesso!',
          description:
            'As informações do seu perfil foram atualizadas com sucesso.',
        });

        /**
         * Redireciona o usuário para a página de dashboard
         */
        history.push('/dashboard');
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
          title: 'Falha na atualização do perfil!',
          description: 'Verifique os dados preenchidos e tente novamente.',
        });
      }
    },
    [history, addToast, updateUser],
  );

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        /**
         * Cria uma instância "multidata" para preparar o arquivo para o upload
         */
        const data = new FormData();
        /**
         * Adiciona o arquivo selecionado à instância para o upload
         * 1º parâmetro: Nome do campo input file
         * 2º parâmetro: Arquivo selecionado
         */
        data.append('avatar', e.target.files[0]);

        /**
         * Executa chamada à API para a troca do avatar
         */
        api.patch('/users/avatar', data).then(response => {
          updateUser(response.data);

          addToast({
            type: 'success',
            title: 'Avatar atualizado com sucesso!',
          });
        });
      }
    },
    [addToast, updateUser],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>

      <Content>
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
        <Form
          ref={formRef}
          initialData={{
            name: user.name,
            email: user.email,
          }}
          onSubmit={handleSubmit}
        >
          <AvatarInput>
            <img src={user.avatarURL} alt={user.name} />
            <label htmlFor="avatar">
              <FiCamera />
              <input
                type="file"
                name="avatar"
                id="avatar"
                onChange={handleAvatarChange}
              />
            </label>
          </AvatarInput>

          <h1>Meu perfil</h1>

          <Input name="name" icon={FiUser} placeholder="Nome" />
          <Input name="email" icon={FiMail} placeholder="E-mail" />

          <Input
            containerStyle={{ marginTop: 24 }}
            name="oldPassword"
            icon={FiLock}
            type="password"
            placeholder="Senha atual"
          />
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
            placeholder="Confirmar senha"
          />

          <Button type="submit">Confirmar mudanças</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
