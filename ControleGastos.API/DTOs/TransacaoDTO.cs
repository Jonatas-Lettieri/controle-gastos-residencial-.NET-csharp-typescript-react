using ControleGastos.API.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ControleGastos.API.DTOs
{
    /// <summary>
    /// DTO utilizado para cadastro e exibição de transações
    /// </summary>
    public class TransacaoDTO
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "A descrição é obrigatória")]
        [StringLength(200, ErrorMessage = "A descrição deve ter no máximo 200 caracteres")]
        public string Descricao { get; set; }

        [Required(ErrorMessage = "O valor é obrigatório")]
        [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser maior que zero")]
        public decimal Valor { get; set; }

        [Required(ErrorMessage = "O tipo de transação é obrigatório")]
        public TipoTransacao Tipo { get; set; }

        [Required(ErrorMessage = "O identificador do usuário é obrigatório")]
        public string UsuarioIdentificador { get; set; }
        
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string TipoDescricao => Tipo == TipoTransacao.Receita ? "Receita" : "Despesa";
        
        public string NomeUsuario { get; set; }
        
        public DateTime DataCadastro { get; set; }
    }
}