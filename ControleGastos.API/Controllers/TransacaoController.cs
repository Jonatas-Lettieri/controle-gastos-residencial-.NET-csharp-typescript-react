using ControleGastos.API.DTOs;
using ControleGastos.API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ControleGastos.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransacaoController : ControllerBase
    {
        private readonly TransacaoService _transacaoService;
        private readonly ILogger<TransacaoController> _logger;

        public TransacaoController(
            TransacaoService transacaoService,
            ILogger<TransacaoController> logger)
        {
            _transacaoService = transacaoService;
            _logger = logger;
        }

        /// <summary>
        /// Obtém todas as transações cadastradas
        /// </summary>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var transacoes = await _transacaoService.GetAllTransacoesAsync();
                return Ok(transacoes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao obter todas as transações");
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    $"Erro ao obter transações: {ex.Message}");
            }
        }

        /// <summary>
        /// Obtém as transações de um usuário específico
        /// </summary>
        [HttpGet("usuario/{identificador}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetByUsuario(string identificador)
        {
            try
            {
                var transacoes = await _transacaoService.GetTransacoesByUsuarioIdentificadorAsync(identificador);
                return Ok(transacoes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Erro ao obter transações do usuário {identificador}");
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    $"Erro ao obter transações do usuário: {ex.Message}");
            }
        }

        /// <summary>
        /// Cadastra uma nova transação financeira
        /// </summary>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Create([FromBody] TransacaoDTO transacaoDTO)
        {
            try
            {
                _logger.LogInformation($"Iniciando criação de transação: {System.Text.Json.JsonSerializer.Serialize(transacaoDTO)}");
                
                // Remove validação do campo NomeUsuario e DataCadastro
                ModelState.Remove("NomeUsuario");
                ModelState.Remove("DataCadastro");
                ModelState.Remove("Id");
                ModelState.Remove("TipoDescricao");

                if (!ModelState.IsValid)
                {
                    var errors = ModelState
                        .Where(x => x.Value.Errors.Count > 0)
                        .ToDictionary(
                            kvp => kvp.Key,
                            kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToArray()
                        );
                    
                    _logger.LogWarning($"Erro de validação: {System.Text.Json.JsonSerializer.Serialize(errors)}");
                    return BadRequest(new { mensagem = "Dados inválidos", errors });
                }

                var resultado = await _transacaoService.CadastrarTransacaoAsync(transacaoDTO);
                
                if (resultado.Sucesso)
                {
                    _logger.LogInformation($"Transação criada com sucesso: {resultado.Transacao.Id}");
                    return Created($"/api/transacao/{resultado.Transacao.Id}", new { 
                        sucesso = resultado.Sucesso,
                        mensagem = resultado.Mensagem,
                        transacao = resultado.Transacao
                    });
                }
                
                if (resultado.Mensagem.Contains("não encontrado"))
                {
                    _logger.LogWarning($"Recurso não encontrado: {resultado.Mensagem}");
                    return NotFound(new { sucesso = false, mensagem = resultado.Mensagem });
                }
                
                _logger.LogWarning($"Erro ao criar transação: {resultado.Mensagem}");
                return BadRequest(new { sucesso = false, mensagem = resultado.Mensagem });
            }
            catch (Exception ex)
            {
                // Log detalhado
                _logger.LogError(ex, "Erro no controlador ao cadastrar transação");
                
                return StatusCode(StatusCodes.Status500InternalServerError, new {
                    sucesso = false,
                    mensagem = $"Erro ao cadastrar transação: {ex.Message}"
                });
            }
        }
    }
}