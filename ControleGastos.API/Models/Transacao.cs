using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ControleGastos.API.Models
{
    /// <summary>
    /// Enum que define o tipo de transação: Receita ou Despesa
    /// </summary>
    public enum TipoTransacao
    {
        Receita = 1,
        Despesa = 2
    }

    /// <summary>
    /// Classe que representa uma transação financeira no sistema
    /// </summary>
    public class Transacao
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "A descrição é obrigatória")]
        [StringLength(200, ErrorMessage = "A descrição deve ter no máximo 200 caracteres")]
        public string Descricao { get; set; }

        [Required(ErrorMessage = "O valor é obrigatório")]
        [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser maior que zero")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Valor { get; set; }

        [Required(ErrorMessage = "O tipo de transação é obrigatório")]
        public TipoTransacao Tipo { get; set; }

        [Required(ErrorMessage = "O usuário é obrigatório")]
        public int UsuarioId { get; set; }

        [ForeignKey("UsuarioId")]
        public virtual Usuario Usuario { get; set; }

        [Required]
        public DateTime DataCadastro { get; set; } = DateTime.Now;

        /// <summary>
        /// Retorna o valor da transação: positivo para receitas e negativo para despesas
        /// </summary>
        [NotMapped]
        public decimal ValorEfetivo => Tipo == TipoTransacao.Receita ? Valor : -Valor;
    }
}