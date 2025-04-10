import api from './api';
import { Transacao, TransacaoCreate } from '../models/Transacao';
import axios from 'axios';

export const transacaoService = {
  // Obter todas as transações
  async getAll(): Promise<Transacao[]> {
    const response = await api.get<Transacao[]>('/transacao');
    return response.data;
  },
  
  // Obter transações por usuário
  async getByUsuario(identificador: string): Promise<Transacao[]> {
    const response = await api.get<Transacao[]>(`/transacao/usuario/${identificador}`);
    return response.data;
  },
  
  // Cadastrar nova transação
  async create(transacao: TransacaoCreate): Promise<{sucesso: boolean, mensagem: string, transacao?: Transacao}> {
    try {
      const response = await api.post('/transacao', transacao);
      return response.data;
    } catch (error) {
      // Verificando se é um erro do Axios
      if (axios.isAxiosError(error) && error.response) {
        // Se for erro 400 (Bad Request)
        if (error.response.status === 400 && error.response.data) {
          console.log("Resposta de erro:", error.response.data);
          
          // Extrair a mensagem de erro no formato correto
          const mensagem = error.response.data.mensagem || 
                          (typeof error.response.data === 'string' ? error.response.data : 
                          'Erro ao processar a requisição');
          
          return {
            sucesso: false,
            mensagem: mensagem
          };
        }
      }
      
      // Para outros tipos de erro, lançar novamente para ser tratado pelo componente
      throw error;
    }
  }
};