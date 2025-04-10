using System.ComponentModel.DataAnnotations;

namespace ControleGastos.API.DTOs
{
    /// <summary>
    /// DTO utilizado para operações de cadastro e exibição de usuários
    /// </summary>
    public class UsuarioDTO
    {
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

        // O campo Identificador não é obrigatório na criação (será gerado automaticamente)
        public string Identificador { get; set; } = string.Empty; // ou null

        // Propriedades para exibição dos totais financeiros
        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
        public decimal Saldo { get; set; }
    }
}
