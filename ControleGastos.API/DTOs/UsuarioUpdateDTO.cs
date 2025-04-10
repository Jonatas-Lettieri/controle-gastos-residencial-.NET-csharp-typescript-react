using System.ComponentModel.DataAnnotations;

namespace ControleGastos.API.DTOs
{
    /// <summary>
    /// DTO utilizado para atualização de dados do usuário
    /// </summary>
    public class UsuarioUpdateDTO
    {
        [Required(ErrorMessage = "O identificador do usuário é obrigatório")]
        public string Identificador { get; set; }

        [Required(ErrorMessage = "O campo Nome é obrigatório")]
        [StringLength(100, ErrorMessage = "O Nome deve ter no máximo 100 caracteres")]
        public string Nome { get; set; }

        [Required(ErrorMessage = "O campo Email é obrigatório")]
        [EmailAddress(ErrorMessage = "O Email informado não é válido")]
        public string Email { get; set; }
    }
}