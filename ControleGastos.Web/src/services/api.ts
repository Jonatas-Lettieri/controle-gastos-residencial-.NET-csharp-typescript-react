import axios from 'axios';

// Verifica se está no ambiente de desenvolvimento
const isDevelopment = process.env.NODE_ENV === 'development';

// Cria uma instância do axios com a URL base da API
const api = axios.create({
  baseURL: isDevelopment ? 'http://localhost:5000/api' : 'https://localhost:5001/api'  // Usa HTTP no dev e HTTPS em produção
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  response => response,
  error => {
    // Tratamento específico para diferentes tipos de erro
    if (error.response) {
      // Resposta do servidor com código de erro
      
      // Tratamento baseado no tipo de erro
      switch (error.response.status) {
        case 400:
          // Bad Request - erros de validação
          if (error.response.data && error.response.data.mensagem && 
              error.response.data.mensagem.includes('Saldo insuficiente')) {
            // Não logar como erro os casos de saldo insuficiente (regra de negócio)
            console.info('Validação de saldo:', error.response.data.mensagem);
          } else if (error.response.data && error.response.data.includes('email')) {
            // Captura especificamente mensagens relacionadas a email duplicado
            console.error('Erro 400:', error.response.data);
            // Aqui é apenas o log do erro, o tratamento será feito no usuarioService
          } else if (error.response.data && error.response.data.errors) {
            // Erros de validação do ModelState
            const validationErrors = Object.values(error.response.data.errors).flat();
            console.error('Erros de validação:', validationErrors);
          } else {
            // Outros erros 400
            console.error('Erro 400:', error.response.data);
          }
          break;
        case 404:
          console.error('Recurso não encontrado');
          break;
        case 500:
          console.error('Erro no servidor:', error.response.data);
          break;
        default:
          console.error(`Erro ${error.response.status}:`, error.response.data);
      }
    } else if (error.request) {
      // Requisição foi feita mas não houve resposta (problemas de rede)
      console.error('Não foi possível conectar ao servidor:', error.request);
    } else {
      // Erro na configuração da requisição
      console.error('Erro na configuração da requisição:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;