import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Card } from 'react-bootstrap';
import { Usuario, UsuarioUpdate } from '../models/Usuario';
import { usuarioService } from '../services/usuarioService';
import Notification from './Notification';

const ListaUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [usuarioUpdate, setUsuarioUpdate] = useState<UsuarioUpdate>({
    identificador: '',
    nome: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'danger' } | null>(null);
  const [validated, setValidated] = useState(false);

  // Carrega a lista de usuários
  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await usuarioService.getAll();
      console.log('Dados carregados:', data);
      // Força a atualização com um novo array
      setUsuarios([...data]);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      setNotification({
        message: 'Erro ao carregar a lista de usuários.',
        type: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  // Abre o modal de edição com os dados do usuário selecionado
  const handleShowEditModal = (usuario: Usuario) => {
    setUsuarioSelecionado(usuario);
    setUsuarioUpdate({
      identificador: usuario.identificador,
      nome: usuario.nome,
      email: usuario.email
    });
    setShowEditModal(true);
    setValidated(false);
  };

  // Abre o modal de confirmação de exclusão
  const handleShowDeleteModal = (usuario: Usuario) => {
    setUsuarioSelecionado(usuario);
    setShowDeleteModal(true);
  };

  // Atualiza os campos do formulário de edição
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUsuarioUpdate(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Salva as alterações do usuário
  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    setActionLoading(true);
    
    try {
      // Garantir que as propriedades não são undefined
      const updatedUser: UsuarioUpdate = {
        identificador: usuarioUpdate.identificador || '',
        nome: usuarioUpdate.nome || '',
        email: usuarioUpdate.email || ''
      };
      
      console.log('Enviando dados para atualização:', updatedUser);
      
      const response = await usuarioService.update(updatedUser);
      
      console.log('Resposta da API update:', response);
      console.log('Tipo de sucesso:', typeof response.sucesso);
      
      setShowEditModal(false);
      
      // Verifica se sucesso é true
      if (response && response.sucesso === true) {
        setNotification({
          message: response.mensagem || 'Usuário atualizado com sucesso!',
          type: 'success'
        });
        
        // Atualiza a lista de usuários
        await carregarUsuarios();
      } else {
        setNotification({
          message: response?.mensagem || 'Erro ao atualizar usuário.',
          type: 'danger'
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      setNotification({
        message: 'Ocorreu um erro ao atualizar o usuário. Tente novamente mais tarde.',
        type: 'danger'
      });
      setShowEditModal(false);
    } finally {
      setActionLoading(false);
    }
  };
  
  // Exclui o usuário
  const handleDeleteUser = async () => {
    if (!usuarioSelecionado) return;
    
    setActionLoading(true);
    
    try {
      console.log('Excluindo usuário:', usuarioSelecionado.identificador);
      
      const response = await usuarioService.remove(usuarioSelecionado.identificador);
      
      console.log('Resposta da API delete:', response);
      console.log('Tipo de sucesso:', typeof response.sucesso);
      
      setShowDeleteModal(false);
      
      // Verifica se sucesso é true
      if (response && response.sucesso === true) {
        setNotification({
          message: response.mensagem || 'Usuário excluído com sucesso!',
          type: 'success'
        });
        
        // Atualiza a lista de usuários
        await carregarUsuarios();
      } else {
        setNotification({
          message: response?.mensagem || 'Erro ao excluir usuário.',
          type: 'danger'
        });
      }
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      setNotification({
        message: 'Ocorreu um erro ao excluir o usuário. Tente novamente mais tarde.',
        type: 'danger'
      });
      setShowDeleteModal(false);
    } finally {
      setActionLoading(false);
    }
  };

  // Formata valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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
      
      <Card>
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Usuários Cadastrados</h4>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center">
              <p>Carregando usuários...</p>
            </div>
          ) : usuarios.length === 0 ? (
            <div className="text-center">
              <p>Nenhum usuário cadastrado.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Identificador</th>
                    <th>Email</th>
                    <th>Idade</th>
                    <th>Total Receitas</th>
                    <th>Total Despesas</th>
                    <th>Saldo</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(usuario => (
                    <tr key={usuario.identificador}>
                      <td>{usuario.nome}</td>
                      <td>{usuario.identificador}</td>
                      <td>{usuario.email}</td>
                      <td>{usuario.idade}</td>
                      <td className="text-success">{formatCurrency(usuario.totalReceitas)}</td>
                      <td className="text-danger">{formatCurrency(usuario.totalDespesas)}</td>
                      <td className={usuario.saldo >= 0 ? 'text-success' : 'text-danger'}>
                        {formatCurrency(usuario.saldo)}
                      </td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-2"
                          onClick={() => handleShowEditModal(usuario)}
                          disabled={actionLoading}
                        >
                          Editar
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleShowDeleteModal(usuario)}
                          disabled={actionLoading}
                        >
                          Remover
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* Modal de Edição */}
      <Modal show={showEditModal} onHide={() => !actionLoading && setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuário</Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validated} onSubmit={handleSaveChanges}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formNome">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={usuarioUpdate.nome}
                onChange={handleInputChange}
                placeholder="Digite o nome completo"
                required
                maxLength={100}
                disabled={actionLoading}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, informe o nome.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={usuarioUpdate.email}
                onChange={handleInputChange}
                placeholder="Digite o email"
                required
                disabled={actionLoading}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, informe um email válido.
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)} disabled={actionLoading}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={actionLoading}>
              {actionLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      
      {/* Modal de Confirmação de Exclusão */}
      <Modal show={showDeleteModal} onHide={() => !actionLoading && setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Tem certeza que deseja excluir o usuário <strong>{usuarioSelecionado?.nome}</strong>?
          </p>
          <p className="text-danger">
            <strong>Atenção:</strong> Esta ação não pode ser desfeita e todos os dados deste usuário, incluindo transações, serão removidos.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={actionLoading}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteUser} disabled={actionLoading}>
            {actionLoading ? 'Excluindo...' : 'Excluir Usuário'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ListaUsuarios;