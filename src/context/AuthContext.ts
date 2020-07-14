import { createContext } from 'react';

interface AuthContextData {
  name: string;
}

/**
 * Realiza a criação do contexto com o modelo da interface
 * ! Para evitar que acuse erro ao inicializar o contexto com um
 * objeto vazio {}, deve-se forçar a tipagem do mesmo (as Interface)
 */
const authContext = createContext<AuthContextData>({} as AuthContextData);

export default authContext;
