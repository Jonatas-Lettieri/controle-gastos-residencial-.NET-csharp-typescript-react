using ControleGastos.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ControleGastos.API.Data.Interfaces
{
    /// <summary>
    /// Interface para o repositório de transações
    /// </summary>
    public interface ITransacaoRepository
    {
        Task<IEnumerable<Transacao>> GetAllAsync();
        Task<IEnumerable<Transacao>> GetByUsuarioIdentificadorAsync(string identificador);
        Task<IEnumerable<Transacao>> GetByUsuarioIdAsync(int usuarioId);
        Task<Transacao> GetByIdAsync(int id);
        Task AddAsync(Transacao transacao);
        Task UpdateAsync(Transacao transacao);
        Task DeleteAsync(Transacao transacao);
        Task DeleteByUsuarioIdAsync(int usuarioId);
        Task<decimal> GetTotalReceitasByUsuarioIdAsync(int usuarioId);
        Task<decimal> GetTotalDespesasByUsuarioIdAsync(int usuarioId);
        Task<decimal> GetTotalReceitasAsync();
        Task<decimal> GetTotalDespesasAsync();
        Task<decimal> GetSaldoByUsuarioIdAsync(int usuarioId);
        Task<bool> SaveChangesAsync();
    }
}