namespace ControleGastos.API.DTOs
{
    /// <summary>
    /// DTO utilizado para exibir os totais gerais do sistema
    /// </summary>
    public class TotaisDTO
    {
        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
        public decimal SaldoLiquido { get; set; }
        public int TotalUsuarios { get; set; }
        public int TotalTransacoes { get; set; }
    }
}