export interface Usuario {
    id: number;
    nome: string;
    idade: number;
    email: string;
    identificador: string;
    totalReceitas: number;
    totalDespesas: number;
    saldo: number;
  }
  
  export interface UsuarioCreate {
    nome: string;
    idade: number;
    email: string;
    identificador?: string;
  }
  
  export interface UsuarioUpdate {
    identificador: string;
    nome: string;
    email: string;
  }