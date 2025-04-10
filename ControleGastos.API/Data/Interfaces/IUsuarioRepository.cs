using ControleGastos.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ControleGastos.API.Data.Interfaces
{
    /// <summary>
    /// Interface para o repositório de usuários
    /// </summary>
    public interface IUsuarioRepository
    {
        Task<IEnumerable<Usuario>> GetAllAsync();
        Task<Usuario> GetByIdAsync(int id);
        Task<Usuario> GetByIdentificadorAsync(string identificador);
        Task<bool> ExisteIdentificadorAsync(string identificador);
        Task<bool> ExisteEmailAsync(string email, int? usuarioIdExcecao = null);
        Task AddAsync(Usuario usuario);
        Task UpdateAsync(Usuario usuario);
        Task DeleteAsync(Usuario usuario);
        Task<bool> SaveChangesAsync();
    }
}