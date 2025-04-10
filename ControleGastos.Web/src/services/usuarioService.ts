import api from './api';
import { Usuario, UsuarioCreate, UsuarioUpdate } from '../models/Usuario';
import { Totais } from '../models/Totais';

// Interface para erro de Axios
interface AxiosErrorResponse {
  response?: {
    status: number;
    data: string | Record<string, unknown>;
  };
  request?: unknown;
  message?: string;
}

export const usuarioService = {
  // Obter todos os usuários
  async getAll(): Promise<Usuario[]> {
    try {
      const response = await api.get<Usuario[]>('/usuario');
      return response.data;
    } catch (error) {
      console.error('Erro na API getAll:', error);
      throw error;
    }
  },
  
  // Obter usuário por identificador
  async getByIdentificador(identificador: string): Promise<Usuario> {
    try {
      const response = await api.get<Usuario>(`/usuario/${identificador}`);
      return response.data;
    } catch (error) {
      console.error('Erro na API getByIdentificador:', error);
      throw error;
    }
  },
  
  // Cadastrar novo usuário
  async create(usuario: UsuarioCreate): Promise<{sucesso: boolean, mensagem: string, usuario?: Usuario}> {
    try {
      const response = await api.post('/usuario', usuario);
      
      // Verificando se a resposta contém sucesso
      if (response.data && response.data.Sucesso !== undefined) {
        // Resposta do backend tem propriedades com inicial maiúscula
        return {
          sucesso: response.data.Sucesso === true,
          mensagem: response.data.Mensagem || 'Usuário cadastrado com sucesso!',
          usuario: response.data.Usuario
        };
      } else if (response.data && response.data.sucesso !== undefined) {
        // Resposta já está no formato esperado
        return {
          sucesso: response.data.sucesso === true,
          mensagem: response.data.mensagem || 'Usuário cadastrado com sucesso!',
          usuario: response.data.usuario
        };
      }
      
      // Caso não tenha o formato esperado, assume que foi sucesso
      return {
        sucesso: true,
        mensagem: 'Usuário cadastrado com sucesso!'
      };
    } catch (error: unknown) {
      // Conversão de tipo com verificação
      const axiosError = error as AxiosErrorResponse;
      
      // Trata especificamente o erro de email duplicado
      if (axiosError.response && axiosError.response.status === 400 && axiosError.response.data) {
        const mensagemErro = typeof axiosError.response.data === 'string' 
          ? axiosError.response.data 
          : 'O email informado já está em uso';
          
        return {
          sucesso: false,
          mensagem: mensagemErro
        };
      }
      
      console.error('Erro na API create:', error);
      throw error;
    }
  },
  
  // Atualizar usuário existente
  async update(usuario: UsuarioUpdate): Promise<{sucesso: boolean, mensagem: string}> {
    try {
      const response = await api.put('/usuario', usuario);
      
      // Verificando se a resposta contém sucesso
      if (response.data && response.data.Sucesso !== undefined) {
        // Resposta do backend tem propriedades com inicial maiúscula
        return {
          sucesso: response.data.Sucesso === true,
          mensagem: response.data.Mensagem || 'Usuário atualizado com sucesso!'
        };
      } else if (response.data && response.data.sucesso !== undefined) {
        // Resposta já está no formato esperado
        return {
          sucesso: response.data.sucesso === true,
          mensagem: response.data.mensagem || 'Usuário atualizado com sucesso!'
        };
      }
      
      // Caso não tenha o formato esperado, assume que foi sucesso
      return {
        sucesso: true,
        mensagem: 'Usuário atualizado com sucesso!'
      };
    } catch (error: unknown) {
      // Conversão de tipo com verificação
      const axiosError = error as AxiosErrorResponse;
      
      // Trata especificamente o erro de email duplicado
      if (axiosError.response && axiosError.response.status === 400 && axiosError.response.data) {
        const mensagemErro = typeof axiosError.response.data === 'string' 
          ? axiosError.response.data 
          : 'O email informado já está em uso por outro usuário';
          
        return {
          sucesso: false,
          mensagem: mensagemErro
        };
      }
      
      console.error('Erro na API update:', error);
      throw error;
    }
  },
  
  // Remover usuário
  async remove(identificador: string): Promise<{sucesso: boolean, mensagem: string}> {
    try {
      const response = await api.delete(`/usuario/${identificador}`);
      
      // Verificando se a resposta contém sucesso
      if (response.data && response.data.Sucesso !== undefined) {
        // Resposta do backend tem propriedades com inicial maiúscula
        return {
          sucesso: response.data.Sucesso === true,
          mensagem: response.data.Mensagem || 'Usuário removido com sucesso!'
        };
      } else if (response.data && response.data.sucesso !== undefined) {
        // Resposta já está no formato esperado
        return {
          sucesso: response.data.sucesso === true,
          mensagem: response.data.mensagem || 'Usuário removido com sucesso!'
        };
      }
      
      // Caso não tenha o formato esperado, assume que foi sucesso
      return {
        sucesso: true,
        mensagem: 'Usuário removido com sucesso!'
      };
    } catch (error) {
      console.error('Erro na API remove:', error);
      throw error;
    }
  },
  
  // Obter totais gerais
  async getTotais(): Promise<Totais> {
    try {
      const response = await api.get<Totais>('/usuario/totais');
      return response.data;
    } catch (error) {
      console.error('Erro na API getTotais:', error);
      throw error;
    }
  }
};