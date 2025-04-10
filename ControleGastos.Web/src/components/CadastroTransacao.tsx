import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { TransacaoCreate, TipoTransacao } from '../models/Transacao';
import { Usuario } from '../models/Usuario';
import { transacaoService } from '../services/transacaoService';
import { usuarioService } from '../services/usuarioService';
import Notification from './Notification';

// Interface para os eventos de onChange
type InputChangeEvent = ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;

const CadastroTransacao: React.FC = () => {
  // Inicialização do estado com valores padrão
  const initialTransacao: TransacaoCreate = {
    descricao: '',
    valor: 0,
    tipo: TipoTransacao.Despesa,
    usuarioIdentificador: '',
    nomeUsuario: ''
  };

  const [transacao, setTransacao] = useState<TransacaoCreate>(initialTransacao);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
  const [validated, setValidated] = useState(false);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'danger' } | null>(null);
  const [loading, setLoading] = useState(true);
  // Estado adicional para mensagem de erro de saldo insuficiente (exibido diretamente no formulário)
  const [saldoError, setSaldoError] = useState<string | null>(null);

  // Carrega a lista de usuários ao iniciar o componente
  useEffect(() => {
    const carregarUsuarios = async () => {
      try {
        setLoading(true);
        const data = await usuarioService.getAll();
        setUsuarios(data);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        setNotification({
          message: 'Ocorreu um erro ao carregar a lista de usuários.',
          type: 'danger'
        });
      } finally {
        setLoading(false);
      }
    };

    carregarUsuarios();
  }, []);

  // Atualiza a transação quando um campo é alterado
  const handleChange = (e: InputChangeEvent) => {
    const { name, value } = e.target;
    
    // Limpa o erro de saldo quando o usuário muda qualquer campo
    setSaldoError(null);
    
    if (name === 'usuarioIdentificador') {
      const usuario = usuarios.find(u => u.identificador === value);
      setUsuarioSelecionado(usuario || null);
      
      // Se o usuário for menor de idade, força o tipo para despesa
      if (usuario && usuario.idade < 18) {
        setTransacao(prev => ({
          ...prev,
          [name]: value,
          nomeUsuario: usuario?.nome || '',
          tipo: TipoTransacao.Despesa
        }));
        return;
      }
      
      // Atualiza o nome do usuário quando o identificador muda
      setTransacao(prev => ({
        ...prev,
        [name]: value,
        nomeUsuario: usuario?.nome || ''
      }));
      return;
    }
    
    setTransacao(prev => ({
      ...prev,
      [name]: name === 'valor' 
        ? parseFloat(value) || 0 
        : name === 'tipo' 
          ? parseInt(value) as TipoTransacao 
          : value
    }));
  };

  // Submete o formulário
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Limpa qualquer erro de saldo anterior
    setSaldoError(null);
    
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    // Verifica se os dados estão preenchidos corretamente
    if (!transacao.usuarioIdentificador || !transacao.descricao || transacao.valor <= 0) {
      setNotification({
        message: 'Por favor, preencha todos os campos corretamente.',
        type: 'danger'
      });
      return;
    }

    try {
      // Garantir que o nomeUsuario está definido
      if (!transacao.nomeUsuario && usuarioSelecionado) {
        transacao.nomeUsuario = usuarioSelecionado.nome;
      }
      
      // Log para debug
      console.log('Enviando transação:', JSON.stringify(transacao, null, 2));
      
      const result = await transacaoService.create(transacao);
      console.log("Resultado da criação:", result);
      
      if (result.sucesso) {
        setNotification({ message: result.mensagem, type: 'success' });
        // Limpa o formulário
        setTransacao(initialTransacao);
        setUsuarioSelecionado(null);
        setValidated(false);
      } else {
        // Verifica se a mensagem de erro é sobre saldo insuficiente
        if (result.mensagem && result.mensagem.toLowerCase().includes('saldo insuficiente')) {
          // Define o erro de saldo para exibir no formulário
          setSaldoError(result.mensagem);
        } else {
          // Outros erros são exibidos como notificação
          setNotification({ message: result.mensagem, type: 'danger' });
        }
      }
    } catch (error: unknown) {
      console.error('Erro ao cadastrar transação:', error);
      let errorMessage = 'Erro desconhecido';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String((error as { message: unknown }).message);
      }
      
      setNotification({ 
        message: `Ocorreu um erro ao cadastrar a transação: ${errorMessage}`, 
        type: 'danger' 
      });
    }
  };

  return (
    <Container>
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}
      
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">Cadastrar Nova Transação</h4>
            </Card.Header>
            <Card.Body>
              {/* Exibe o erro de saldo insuficiente diretamente no formulário */}
              {saldoError && (
                <Alert variant="danger" onClose={() => setSaldoError(null)} dismissible>
                  <strong>Erro:</strong> {saldoError}
                </Alert>
              )}
              
              {loading ? (
                <div className="text-center">
                  <p>Carregando dados...</p>
                </div>
              ) : (
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formUsuario">
                    <Form.Label>Usuário</Form.Label>
                    <Form.Select
                      name="usuarioIdentificador"
                      value={transacao.usuarioIdentificador}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione um usuário</option>
                      {usuarios.map(usuario => (
                        <option key={usuario.identificador} value={usuario.identificador}>
                          {usuario.nome} ({usuario.identificador})
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Por favor, selecione um usuário.
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-3" controlId="formDescricao">
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control
                      type="text"
                      name="descricao"
                      value={transacao.descricao}
                      onChange={handleChange}
                      placeholder="Digite a descrição da transação"
                      required
                      maxLength={200}
                      autoComplete="off"
                    />
                    <Form.Control.Feedback type="invalid">
                      Por favor, informe uma descrição.
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-3" controlId="formValor">
                    <Form.Label>Valor</Form.Label>
                    <Form.Control
                      type="number"
                      name="valor"
                      value={transacao.valor || ''}
                      onChange={handleChange}
                      placeholder="Digite o valor"
                      required
                      min={0.01}
                      step={0.01}
                      autoComplete="off"
                    />
                    <Form.Control.Feedback type="invalid">
                      Por favor, informe um valor válido maior que zero.
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-3" controlId="formTipo">
                    <Form.Label>Tipo de Transação</Form.Label>
                    <div>
                      <Form.Check
                        inline
                        type="radio"
                        label="Despesa"
                        name="tipo"
                        id="tipo-despesa"
                        value={TipoTransacao.Despesa}
                        checked={transacao.tipo === TipoTransacao.Despesa}
                        onChange={handleChange}
                      />
                      <Form.Check
                        inline
                        type="radio"
                        label="Receita"
                        name="tipo"
                        id="tipo-receita"
                        value={TipoTransacao.Receita}
                        checked={transacao.tipo === TipoTransacao.Receita}
                        onChange={handleChange}
                        disabled={!!usuarioSelecionado && usuarioSelecionado.idade < 18}
                      />
                    </div>
                    {usuarioSelecionado && usuarioSelecionado.idade < 18 && (
                      <Form.Text className="text-danger">
                        Usuários menores de 18 anos só podem registrar despesas.
                      </Form.Text>
                    )}
                  </Form.Group>
                  
                  <div className="d-grid gap-2">
                    <Button variant="primary" type="submit">
                      Cadastrar Transação
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CadastroTransacao;