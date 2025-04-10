using ControleGastos.API.Data.Interfaces;
using ControleGastos.API.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ControleGastos.API.Data.Repositories
{
    /// <summary>
    /// Implementação do repositório de usuários
    /// </summary>
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly ControleGastosContext _context;

        public UsuarioRepository(ControleGastosContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Usuario>> GetAllAsync()
        {
            return await _context.Usuarios
                .Include(u => u.Transacoes)
                .ToListAsync();
        }

        public async Task<Usuario> GetByIdAsync(int id)
        {
            return await _context.Usuarios
                .Include(u => u.Transacoes)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<Usuario> GetByIdentificadorAsync(string identificador)
        {
            return await _context.Usuarios
                .Include(u => u.Transacoes)
                .FirstOrDefaultAsync(u => u.Identificador == identificador);
        }

        public async Task<bool> ExisteIdentificadorAsync(string identificador)
        {
            return await _context.Usuarios
                .AnyAsync(u => u.Identificador == identificador);
        }

        public async Task<bool> ExisteEmailAsync(string email, int? usuarioIdExcecao = null)
        {
            if (usuarioIdExcecao.HasValue)
            {
                return await _context.Usuarios
                    .AnyAsync(u => u.Email == email && u.Id != usuarioIdExcecao.Value);
            }
            
            return await _context.Usuarios
                .AnyAsync(u => u.Email == email);
        }

        public async Task AddAsync(Usuario usuario)
        {
            await _context.Usuarios.AddAsync(usuario);
        }

        public Task UpdateAsync(Usuario usuario)
        {
            _context.Usuarios.Update(usuario);
            return Task.CompletedTask;
        }

        public Task DeleteAsync(Usuario usuario)
        {
            _context.Usuarios.Remove(usuario);
            return Task.CompletedTask;
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}