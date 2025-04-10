import React, { useState, FormEvent } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { usuarioService } from '../services/usuarioService';
import { UsuarioCreate } from '../models/Usuario';
import Notification from './Notification';

const CadastroUsuario: React.FC = () => {
  const [usuario, setUsuario] = useState<UsuarioCreate>({
    nome: '',
    idade: 0,
    email: '',
    identificador: '' // Inicializando com string vazia
  });
  
  const [validated, setValidated] = useState(false);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'danger' } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUsuario(prev => ({
      ...prev,
      [name]: name === 'idade' ? parseInt(value) || 0 : value
    }));
  };

  const resetForm = () => {
    setUsuario({
      nome: '',
      idade: 0,
      email: '',
      identificador: ''
    });
    setValidated(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setLoading(true);
    
    try {
      // Log para depuração
      console.log('Enviando dados para cadastro:', usuario);
      
      // Tenta criar o usuário e obtém o resultado
      const result = await usuarioService.create(usuario);
      
      // Se o resultado da operação não foi sucesso
      if (!result.sucesso) {
        // Exibe a mensagem de erro retornada pela API
        setNotification({ 
          message: result.mensagem || 'Erro ao cadastrar usuário. Verifique os dados e tente novamente.', 
          type: 'danger' 
        });
        setLoading(false);
        return; // Sai da função, mantendo o formulário preenchido
      }
      
      // Se deu tudo certo, limpa o formulário e exibe mensagem de sucesso
      resetForm();
      setNotification({ 
        message: result.mensagem || 'Usuário cadastrado com sucesso!', 
        type: 'success' 
      });
      
    } catch (error) {
      // Em caso de erro não tratado, exibe uma mensagem genérica
      console.error('Erro ao cadastrar usuário:', error);
      setNotification({ 
        message: 'Ocorreu um erro ao cadastrar o usuário. Tente novamente mais tarde.', 
        type: 'danger' 
      });
    } finally {
      setLoading(false);
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
              <h4 className="mb-0">Cadastrar Novo Usuário</h4>
            </Card.Header>
            <Card.Body>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formNome">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    value={usuario.nome}
                    onChange={handleChange}
                    placeholder="Digite o nome completo"
                    required
                    maxLength={100}
                    disabled={loading}
                    autoComplete="off"
                  />
                  <Form.Control.Feedback type="invalid">
                    Por favor, informe o nome.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formIdade">
                  <Form.Label>Idade</Form.Label>
                  <Form.Control
                    type="number"
                    name="idade"
                    value={usuario.idade || ''}
                    onChange={handleChange}
                    placeholder="Digite a idade"
                    required
                    min={1}
                    max={120}
                    disabled={loading}
                    autoComplete="off"
                  />
                  <Form.Control.Feedback type="invalid">
                    Por favor, informe uma idade válida (entre 1 e 120).
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    *Menores de 18 anos só poderão registrar despesas.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={usuario.email}
                    onChange={handleChange}
                    placeholder="Digite o email"
                    required
                    disabled={loading}
                    autoComplete="off"
                  />
                  <Form.Control.Feedback type="invalid">
                    Por favor, informe um email válido.
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Cadastrando...' : 'Cadastrar Usuário'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CadastroUsuario;