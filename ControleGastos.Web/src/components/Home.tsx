import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <Container>
      <Row className="mt-5 text-center">
        <Col>
          <h1>Sistema de Controle de Gastos Residenciais</h1>
          <p className="lead">
            Gerencie suas finanças residenciais de forma simples e eficiente
          </p>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Cadastrar Usuário</Card.Title>
              <Card.Text>
                Cadastre os membros da sua residência para começar a controlar os gastos.
              </Card.Text>
              <Link to="/cadastro-usuario">
                <Button variant="primary" className="mt-auto">
                  Cadastrar Usuário
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Usuários Cadastrados</Card.Title>
              <Card.Text>
                Veja todos os usuários cadastrados e seus respectivos totais financeiros.
              </Card.Text>
              <Link to="/usuarios">
                <Button variant="primary" className="mt-auto">
                  Ver Usuários
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Cadastrar Transação</Card.Title>
              <Card.Text>
                Registre receitas e despesas associadas aos usuários cadastrados.
              </Card.Text>
              <Link to="/cadastro-transacao">
                <Button variant="primary" className="mt-auto">
                  Cadastrar Transação
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col md={{ span: 4, offset: 4 }} className="mb-4">
          <Card className="h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Consulta de Totais</Card.Title>
              <Card.Text>
                Visualize o resumo financeiro geral de todos os usuários.
              </Card.Text>
              <Link to="/consulta-totais">
                <Button variant="primary" className="mt-auto">
                  Ver Totais
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
