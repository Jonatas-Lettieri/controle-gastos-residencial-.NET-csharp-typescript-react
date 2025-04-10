using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ControleGastos.API.Models
{
    /// <summary>
    /// Classe que representa um usuário no sistema de controle de gastos
    /// </summary>
    public class Usuario
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "O campo Nome é obrigatório")]
        [StringLength(100, ErrorMessage = "O Nome deve ter no máximo 100 caracteres")]
        public string Nome { get; set; }

        [Required(ErrorMessage = "O campo Idade é obrigatório")]
        [Range(1, 120, ErrorMessage = "A idade deve estar entre 1 e 120 anos")]
        public int Idade { get; set; }

        [Required(ErrorMessage = "O campo Email é obrigatório")]
        [EmailAddress(ErrorMessage = "O Email informado não é válido")]
        public string Email { get; set; }

        /// <summary>
        /// Identificador único de 10 caracteres aleatórios
        /// </summary>
        [Required]
        [StringLength(10, MinimumLength = 10)]
        public string Identificador { get; set; } = string.Empty;

        /// <summary>
        /// Lista de transações associadas ao usuário
        /// </summary>
        public virtual ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();

        /// <summary>
        /// Verifica se o usuário é menor de idade
        /// </summary>
        public bool EhMenorDeIdade() => Idade < 18;
    }
}