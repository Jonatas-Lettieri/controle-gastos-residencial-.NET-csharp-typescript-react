export enum TipoTransacao {
  Receita = 1,
  Despesa = 2
}

export interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  usuarioIdentificador: string;
  nomeUsuario: string;
  dataCadastro: Date;
}

export interface TransacaoCreate {
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  usuarioIdentificador: string;
  nomeUsuario: string;
}