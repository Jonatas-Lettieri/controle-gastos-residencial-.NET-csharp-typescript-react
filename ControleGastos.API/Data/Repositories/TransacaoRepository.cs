using ControleGastos.API.Data.Interfaces;
using ControleGastos.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ControleGastos.API.Data.Repositories
{
    /// <summary>
    /// Implementação do repositório de transações
    /// </summary>
    public class TransacaoRepository : ITransacaoRepository
    {
        private readonly ControleGastosContext _context;

        public TransacaoRepository(ControleGastosContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Transacao>> GetAllAsync()
        {
            return await _context.Transacoes
                .Include(t => t.Usuario)
                .ToListAsync();
        }

        public async Task<IEnumerable<Transacao>> GetByUsuarioIdentificadorAsync(string identificador)
        {
            return await _context.Transacoes
                .Include(t => t.Usuario)
                .Where(t => t.Usuario.Identificador == identificador)
                .ToListAsync();
        }

        public async Task<IEnumerable<Transacao>> GetByUsuarioIdAsync(int usuarioId)
        {
            return await _context.Transacoes
                .Include(t => t.Usuario)
                .Where(t => t.UsuarioId == usuarioId)
                .ToListAsync();
        }

        public async Task<Transacao> GetByIdAsync(int id)
        {
            return await _context.Transacoes
                .Include(t => t.Usuario)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task AddAsync(Transacao transacao)
        {
            await _context.Transacoes.AddAsync(transacao);
        }

        public Task UpdateAsync(Transacao transacao)
        {
            _context.Transacoes.Update(transacao);
            return Task.CompletedTask;
        }

        public Task DeleteAsync(Transacao transacao)
        {
            _context.Transacoes.Remove(transacao);
            return Task.CompletedTask;
        }

        public async Task DeleteByUsuarioIdAsync(int usuarioId)
        {
            var transacoes = await _context.Transacoes
                .Where(t => t.UsuarioId == usuarioId)
                .ToListAsync();

            _context.Transacoes.RemoveRange(transacoes);
        }

        public async Task<decimal> GetTotalReceitasByUsuarioIdAsync(int usuarioId)
        {
            return await _context.Transacoes
                .Where(t => t.UsuarioId == usuarioId && t.Tipo == TipoTransacao.Receita)
                .SumAsync(t => t.Valor);
        }

        public async Task<decimal> GetTotalDespesasByUsuarioIdAsync(int usuarioId)
        {
            return await _context.Transacoes
                .Where(t => t.UsuarioId == usuarioId && t.Tipo == TipoTransacao.Despesa)
                .SumAsync(t => t.Valor);
        }

        public async Task<decimal> GetSaldoByUsuarioIdAsync(int usuarioId)
        {
            var totalReceitas = await GetTotalReceitasByUsuarioIdAsync(usuarioId);
            var totalDespesas = await GetTotalDespesasByUsuarioIdAsync(usuarioId);
            
            return totalReceitas - totalDespesas;
        }

        public async Task<decimal> GetTotalReceitasAsync()
        {
            return await _context.Transacoes
                .Where(t => t.Tipo == TipoTransacao.Receita)
                .SumAsync(t => (decimal?)t.Valor) ?? 0;
        }

        public async Task<decimal> GetTotalDespesasAsync()
        {
            return await _context.Transacoes
                .Where(t => t.Tipo == TipoTransacao.Despesa)
                .SumAsync(t => (decimal?)t.Valor) ?? 0;
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}