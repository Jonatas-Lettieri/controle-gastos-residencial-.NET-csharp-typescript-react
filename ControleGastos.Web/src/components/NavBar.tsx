import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">Controle de Gastos Residenciais</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/cadastro-usuario">Cadastrar Usuário</Nav.Link>
            <Nav.Link as={Link} to="/usuarios">Usuários Cadastrados</Nav.Link>
            <Nav.Link as={Link} to="/cadastro-transacao">Cadastrar Transação</Nav.Link>
            <Nav.Link as={Link} to="/consulta-totais">Consulta de Totais</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;