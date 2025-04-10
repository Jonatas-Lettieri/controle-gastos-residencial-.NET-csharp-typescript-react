using ControleGastos.API.Data.Interfaces;
using ControleGastos.API.DTOs;
using ControleGastos.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleGastos.API.Services
{
    /// <summary>
    /// Serviço responsável pelas operações relacionadas aos usuários
    /// </summary>
    public class UsuarioService
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly ITransacaoRepository _transacaoRepository;

        public UsuarioService(IUsuarioRepository usuarioRepository, ITransacaoRepository transacaoRepository)
        {
            _usuarioRepository = usuarioRepository;
            _transacaoRepository = transacaoRepository;
        }

        /// <summary>
        /// Obtém todos os usuários com seus respectivos totais financeiros
        /// </summary>
        public async Task<IEnumerable<UsuarioDTO>> GetAllUsuariosAsync()
        {
            var usuarios = await _usuarioRepository.GetAllAsync();
            var usuariosDTO = new List<UsuarioDTO>();

            foreach (var usuario in usuarios)
            {
                var totalReceitas = await _transacaoRepository.GetTotalReceitasByUsuarioIdAsync(usuario.Id);
                var totalDespesas = await _transacaoRepository.GetTotalDespesasByUsuarioIdAsync(usuario.Id);

                usuariosDTO.Add(new UsuarioDTO
                {
                    Id = usuario.Id,
                    Nome = usuario.Nome,
                    Idade = usuario.Idade,
                    Email = usuario.Email,
                    Identificador = usuario.Identificador,
                    TotalReceitas = totalReceitas,
                    TotalDespesas = totalDespesas,
                    Saldo = totalReceitas - totalDespesas
                });
            }

            return usuariosDTO;
        }

        /// <summary>
        /// Obtém um usuário pelo seu identificador único
        /// </summary>
        public async Task<UsuarioDTO?> GetUsuarioByIdentificadorAsync(string identificador)
        {
            var usuario = await _usuarioRepository.GetByIdentificadorAsync(identificador);
            
            if (usuario == null)
                return null;

            var totalReceitas = await _transacaoRepository.GetTotalReceitasByUsuarioIdAsync(usuario.Id);
            var totalDespesas = await _transacaoRepository.GetTotalDespesasByUsuarioIdAsync(usuario.Id);

            return new UsuarioDTO
            {
                Id = usuario.Id,
                Nome = usuario.Nome,
                Idade = usuario.Idade,
                Email = usuario.Email,
                Identificador = usuario.Identificador,
                TotalReceitas = totalReceitas,
                TotalDespesas = totalDespesas,
                Saldo = totalReceitas - totalDespesas
            };
        }

        /// <summary>
        /// Gera um identificador único de 10 caracteres aleatórios
        /// </summary>
        private async Task<string> GerarIdentificadorUnicoAsync()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var identificador = "";
            var random = new Random();
            
            do
            {
                var stringBuilder = new StringBuilder();
                for (int i = 0; i < 10; i++)
                {
                    stringBuilder.Append(chars[random.Next(chars.Length)]);
                }
                identificador = stringBuilder.ToString();
            } 
            while (await _usuarioRepository.ExisteIdentificadorAsync(identificador));

            return identificador;
        }

        /// <summary>
        /// Cadastra um novo usuário no sistema
        /// </summary>
        public async Task<(bool Sucesso, string Mensagem, UsuarioDTO? Usuario)> CadastrarUsuarioAsync(UsuarioDTO usuarioDTO)
        {
            // Verifica se o email já existe
            if (await _usuarioRepository.ExisteEmailAsync(usuarioDTO.Email))
            {
                return (false, "O email informado já está em uso", null);
            }

            // Gerar o identificador único automaticamente
            var identificador = await GerarIdentificadorUnicoAsync();
            
            var usuario = new Usuario
            {
                Nome = usuarioDTO.Nome,
                Idade = usuarioDTO.Idade,
                Email = usuarioDTO.Email,
                Identificador = identificador
            };

            await _usuarioRepository.AddAsync(usuario);
            
            if (await _usuarioRepository.SaveChangesAsync())
            {
                // Atualizar o DTO com o identificador gerado
                usuarioDTO.Id = usuario.Id;
                usuarioDTO.Identificador = identificador;

                return (true, "Usuário cadastrado com sucesso", usuarioDTO);
            }
            
            return (false, "Ocorreu um erro ao cadastrar o usuário", null);
        }

        /// <summary>
        /// Atualiza os dados de um usuário existente
        /// </summary>
        public async Task<(bool Sucesso, string Mensagem)> AtualizarUsuarioAsync(UsuarioUpdateDTO usuarioUpdateDTO)
        {
            var usuario = await _usuarioRepository.GetByIdentificadorAsync(usuarioUpdateDTO.Identificador);
            
            if (usuario == null)
            {
                return (false, "Usuário não encontrado");
            }

            // Verifica se o email já existe para outro usuário
            if (await _usuarioRepository.ExisteEmailAsync(usuarioUpdateDTO.Email, usuario.Id))
            {
                return (false, "O email informado já está em uso por outro usuário");
            }

            usuario.Nome = usuarioUpdateDTO.Nome;
            usuario.Email = usuarioUpdateDTO.Email;

            await _usuarioRepository.UpdateAsync(usuario);
            
            if (await _usuarioRepository.SaveChangesAsync())
            {
                return (true, "Usuário atualizado com sucesso");
            }
            
            return (false, "Ocorreu um erro ao atualizar o usuário");
        }

        /// <summary>
        /// Remove um usuário e todas as suas transações do sistema
        /// </summary>
        public async Task<(bool Sucesso, string Mensagem)> RemoverUsuarioAsync(string identificador)
        {
            var usuario = await _usuarioRepository.GetByIdentificadorAsync(identificador);
            
            if (usuario == null)
            {
                return (false, "Usuário não encontrado");
            }

            // Remove todas as transações do usuário
            await _transacaoRepository.DeleteByUsuarioIdAsync(usuario.Id);
            
            // Remove o usuário
            await _usuarioRepository.DeleteAsync(usuario);
            
            if (await _usuarioRepository.SaveChangesAsync())
            {
                return (true, "Usuário removido com sucesso");
            }
            
            return (false, "Ocorreu um erro ao remover o usuário");
        }

        /// <summary>
        /// Obtém os totais gerais do sistema
        /// </summary>
        public async Task<TotaisDTO> GetTotaisAsync()
        {
            var usuarios = await _usuarioRepository.GetAllAsync();
            var totalReceitas = await _transacaoRepository.GetTotalReceitasAsync();
            var totalDespesas = await _transacaoRepository.GetTotalDespesasAsync();

            return new TotaisDTO
            {
                TotalReceitas = totalReceitas,
                TotalDespesas = totalDespesas,
                SaldoLiquido = totalReceitas - totalDespesas,
                TotalUsuarios = usuarios.Count(),
                TotalTransacoes = usuarios.SelectMany(u => u.Transacoes).Count()
            };
        }
    }
}
