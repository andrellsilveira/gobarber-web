import React, { createContext, useCallback, useState, useContext } from 'react';
import { date } from 'yup';
import api from '../services/api';

interface AuthState {
  token: string;
  user: object;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: object;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

/**
 * Realiza a criação do contexto com o modelo da interface
 * ! Para evitar que acuse erro ao inicializar o contexto com um
 * objeto vazio {}, deve-se forçar a tipagem do mesmo (as Interface)
 */
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

/**
 * Componente principal do contexto de autenticação
 * Esse componente deverá encapsular todos os componentes da aplicação
 * que estarão inseridos num contexto de autenticação, ou seja, todo
 * componente que necessitar de verificação quanto a autenticação do
 * usuário deverá estar aninhado dentro do componente AuthProvider
 */
const AuthProvider: React.FC = ({ children }) => {
  /**
   * Armazena todos os dados do login em um estado para possibilitar
   * a utilização dessas informações por outros componentes da
   * aplicação através do contexto
   */
  const [data, setData] = useState<AuthState>(() => {
    /**
     * Verifica se foi recuperado as informações de autenticação e,
     * em caso positivo, as recupera para inicialização do estado,
     * caso contrário força o retorno como um objeto vazio
     */
    const token = localStorage.getItem('@GoBarber:token');
    const user = localStorage.getItem('@GoBarber:user');

    if (token && user) {
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', { email, password });

    const { token, user } = response.data;

    /**
     * Ao armazenar no "localStorage", sempre identificar a aplicação
     * junto ao nome do item, precedida com @ para facilitar a identificação
     * caso seja necessário consultar o armazenamento dos itens do sistema
     */
    localStorage.setItem('@GoBarber:token', token);
    /**
     * Valores não comuns como string, number e boolean precisam ser
     * convertidos para JSON
     */
    localStorage.setItem('@GoBarber:user', JSON.stringify(user));

    /**
     * Atualiza as informações de estado após realizar o login
     */
    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    /**
     * Remove os itens do "localStorage"
     */
    localStorage.removeItem('@GoBarber:token');
    localStorage.removeItem('@GoBarber:user');

    /**
     * Define o estado de "data" como um objeto vazio
     */
    setData({} as AuthState);
  }, []);

  return (
    /**
     * A propriedade "Provider" do contexto, identifica que todos
     * os componentes que estiverem aninhados dentro das tags
     * terão acesso às propriedades e valores daquele contexto
     * As propriedades e métodos que poderão ser acessadas pelos
     * demais componentes da aplicação deverão estar especificados
     * no atributo "value" do Provider
     */
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook para utilização do contexto de autenticação nos demais
 * componentes da aplicação.
 * Esse hook serve para simplificar o acesso às informações de
 * autenticação pelos demais componentes do sistema
 */
function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  /**
   * Verifica se o contexto foi criado, caso não tenha sido, então
   * dispara um erro, pois a falta do componente AuthProvider causa
   * a falha da inicialização do contexto
   */
  if (!context) {
    throw new Error('useAuth deve ser utilizado com um AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
