using ControleGastos.API.Data.Interfaces;
using ControleGastos.API.DTOs;
using ControleGastos.API.Models;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ControleGastos.API.Services
{
    /// <summary>
    /// Serviço responsável pelas operações relacionadas às transações financeiras
    /// </summary>
    public class TransacaoService
    {
        private readonly ITransacaoRepository _transacaoRepository;
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly ILogger<TransacaoService> _logger;

        public TransacaoService(
            ITransacaoRepository transacaoRepository, 
            IUsuarioRepository usuarioRepository,
            ILogger<TransacaoService> logger)
        {
            _transacaoRepository = transacaoRepository;
            _usuarioRepository = usuarioRepository;
            _logger = logger;
        }

        /// <summary>
        /// Obtém todas as transações cadastradas
        /// </summary>
        public async Task<IEnumerable<TransacaoDTO>> GetAllTransacoesAsync()
        {
            var transacoes = await _transacaoRepository.GetAllAsync();
            return transacoes.Select(t => new TransacaoDTO
            {
                Id = t.Id,
                Descricao = t.Descricao,
                Valor = t.Valor,
                Tipo = t.Tipo,
                UsuarioIdentificador = t.Usuario.Identificador,
                NomeUsuario = t.Usuario.Nome,
                DataCadastro = t.DataCadastro
            });
        }

        /// <summary>
        /// Obtém as transações de um usuário específico
        /// </summary>
        public async Task<IEnumerable<TransacaoDTO>> GetTransacoesByUsuarioIdentificadorAsync(string identificador)
        {
            var transacoes = await _transacaoRepository.GetByUsuarioIdentificadorAsync(identificador);
            return transacoes.Select(t => new TransacaoDTO
            {
                Id = t.Id,
                Descricao = t.Descricao,
                Valor = t.Valor,
                Tipo = t.Tipo,
                UsuarioIdentificador = t.Usuario.Identificador,
                NomeUsuario = t.Usuario.Nome,
                DataCadastro = t.DataCadastro
            });
        }

        /// <summary>
        /// Cadastra uma nova transação financeira
        /// </summary>
        public async Task<(bool Sucesso, string Mensagem, TransacaoDTO Transacao)> CadastrarTransacaoAsync(TransacaoDTO transacaoDTO)
        {
            try
            {
                // Log dos dados recebidos
                _logger.LogInformation($"Dados recebidos: {System.Text.Json.JsonSerializer.Serialize(transacaoDTO)}");
                
                // Valida a entrada
                if (string.IsNullOrEmpty(transacaoDTO.Descricao))
                {
                    return (false, "A descrição é obrigatória", null);
                }

                if (transacaoDTO.Valor <= 0)
                {
                    return (false, "O valor deve ser maior que zero", null);
                }

                if (string.IsNullOrEmpty(transacaoDTO.UsuarioIdentificador))
                {
                    return (false, "O identificador do usuário é obrigatório", null);
                }

                // Busca o usuário pelo identificador
                var usuario = await _usuarioRepository.GetByIdentificadorAsync(transacaoDTO.UsuarioIdentificador);
                
                if (usuario == null)
                {
                    _logger.LogWarning($"Usuário com identificador {transacaoDTO.UsuarioIdentificador} não encontrado");
                    return (false, "Usuário não encontrado", null);
                }

                _logger.LogInformation($"Usuário encontrado: ID={usuario.Id}, Nome={usuario.Nome}");

                // Verifica se o usuário é menor de idade e está tentando cadastrar uma receita
                if (usuario.EhMenorDeIdade() && transacaoDTO.Tipo == TipoTransacao.Receita)
                {
                    _logger.LogWarning("Usuário menor de idade tentando cadastrar receita");
                    return (false, "Usuários menores de 18 anos só podem realizar operações de despesa", null);
                }

                // Verifica o saldo se for despesa
                if (transacaoDTO.Tipo == TipoTransacao.Despesa)
                {
                    // Calcula o saldo atual do usuário
                    decimal saldoAtual = await _transacaoRepository.GetSaldoByUsuarioIdAsync(usuario.Id);
                    
                    // Verifica se o saldo é suficiente para realizar a despesa
                    if (saldoAtual < transacaoDTO.Valor)
                    {
                        _logger.LogWarning($"Saldo insuficiente para realizar a transação. Saldo: {saldoAtual}, Valor da despesa: {transacaoDTO.Valor}");
                        return (false, "Saldo insuficiente para realizar esta transação", null);
                    }
                }

                // Usei DateTime.UtcNow em vez de DateTime.Now para compatibilidade com PostgreSQL
                DateTime dataUtc = DateTime.UtcNow;
                
                // Cria a entidade a ser salva no banco de dados
                var transacao = new Transacao
                {
                    Descricao = transacaoDTO.Descricao,
                    Valor = transacaoDTO.Valor,
                    Tipo = transacaoDTO.Tipo,
                    UsuarioId = usuario.Id,
                    DataCadastro = dataUtc // Usei UTC
                };

                _logger.LogInformation($"Transação a ser criada: {System.Text.Json.JsonSerializer.Serialize(new
                {
                    transacao.Descricao,
                    transacao.Valor,
                    transacao.Tipo,
                    transacao.UsuarioId,
                    transacao.DataCadastro,
                    DataKind = transacao.DataCadastro.Kind.ToString() // Log do Kind da data para debug
                })}");

                try
                {
                    // Adicionar a transação ao repositório
                    await _transacaoRepository.AddAsync(transacao);
                    
                    // Salvar as mudanças
                    bool saved = await _transacaoRepository.SaveChangesAsync();
                    
                    if (saved)
                    {
                        _logger.LogInformation($"Transação salva com sucesso: ID={transacao.Id}");
                        
                        // Retornar o DTO da transação criada
                        var transacaoRetorno = new TransacaoDTO
                        {
                            Id = transacao.Id,
                            Descricao = transacao.Descricao,
                            Valor = transacao.Valor,
                            Tipo = transacao.Tipo,
                            UsuarioIdentificador = usuario.Identificador,
                            NomeUsuario = usuario.Nome,
                            DataCadastro = transacao.DataCadastro
                        };
                        
                        return (true, "Transação cadastrada com sucesso", transacaoRetorno);
                    }
                    else
                    {
                        _logger.LogWarning("Não foi possível salvar a transação");
                        return (false, "Não foi possível salvar a transação no banco de dados", null);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Erro ao salvar a transação");
                    return (false, $"Erro ao salvar a transação: {ex.Message}", null);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro no processo de cadastro da transação");
                return (false, $"Erro ao processar a transação: {ex.Message}", null);
            }
        }
    }
}