using ControleGastos.API.DTOs;
using ControleGastos.API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace ControleGastos.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly UsuarioService _usuarioService;

        public UsuarioController(UsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        /// <summary>
        /// Obtém todos os usuários cadastrados com seus totais financeiros
        /// </summary>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var usuarios = await _usuarioService.GetAllUsuariosAsync();
                return Ok(usuarios);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    $"Erro ao obter usuários: {ex.Message}");
            }
        }

        /// <summary>
        /// Obtém um usuário pelo seu identificador único
        /// </summary>
        [HttpGet("{identificador}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetByIdentificador(string identificador)
        {
            try
            {
                var usuario = await _usuarioService.GetUsuarioByIdentificadorAsync(identificador);
                
                if (usuario == null)
                    return NotFound("Usuário não encontrado");
                
                return Ok(usuario);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    $"Erro ao obter usuário: {ex.Message}");
            }
        }

        /// <summary>
        /// Cadastra um novo usuário no sistema
        /// </summary>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Create([FromBody] UsuarioDTO usuarioDTO)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Chamando o serviço para cadastrar o usuário
                var resultado = await _usuarioService.CadastrarUsuarioAsync(usuarioDTO);
                
                if (resultado.Sucesso)
                    // Redireciona para o recurso do usuário criado
                    return Created($"/api/usuario/{resultado.Usuario.Identificador}", resultado);
                
                return BadRequest(resultado.Mensagem);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    $"Erro ao cadastrar usuário: {ex.Message}");
            }
        }

        /// <summary>
        /// Atualiza os dados de um usuário existente
        /// </summary>
        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Update([FromBody] UsuarioUpdateDTO usuarioUpdateDTO)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Chamando o serviço para atualizar o usuário
                var resultado = await _usuarioService.AtualizarUsuarioAsync(usuarioUpdateDTO);
                
                if (resultado.Sucesso)
                    return Ok(resultado);
                
                if (resultado.Mensagem.Contains("não encontrado"))
                    return NotFound(resultado.Mensagem);
                
                return BadRequest(resultado.Mensagem);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    $"Erro ao atualizar usuário: {ex.Message}");
            }
        }

        /// <summary>
        /// Remove um usuário e todas as suas transações do sistema
        /// </summary>
        [HttpDelete("{identificador}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Delete(string identificador)
        {
            try
            {
                var resultado = await _usuarioService.RemoverUsuarioAsync(identificador);
                
                if (resultado.Sucesso)
                    return Ok(resultado);
                
                return NotFound(resultado.Mensagem);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    $"Erro ao remover usuário: {ex.Message}");
            }
        }

        /// <summary>
        /// Obtém os totais gerais do sistema
        /// </summary>
        [HttpGet("totais")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetTotais()
        {
            try
            {
                var totais = await _usuarioService.GetTotaisAsync();
                return Ok(totais);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    $"Erro ao obter totais: {ex.Message}");
            }
        }
    }
}