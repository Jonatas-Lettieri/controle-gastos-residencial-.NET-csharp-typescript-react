import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import NavBar from './components/NavBar';
import Home from './components/Home';
import CadastroUsuario from './components/CadastroUsuario';
import ListaUsuarios from './components/ListaUsuarios';
import CadastroTransacao from './components/CadastroTransacao';
import ConsultaTotais from './components/ConsultaTotais';
import './styles.css';

/**
 * Componente principal da aplicação
 * Configura as rotas e estrutura base da aplicação
 */
const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <NavBar />
        <Container className="mt-4 mb-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cadastro-usuario" element={<CadastroUsuario />} />
            <Route path="/usuarios" element={<ListaUsuarios />} />
            <Route path="/cadastro-transacao" element={<CadastroTransacao />} />
            <Route path="/consulta-totais" element={<ConsultaTotais />} />
            {/* Página 404 para rotas não encontradas */}
            <Route path="*" element={
              <div className="text-center mt-5">
                <h1>404</h1>
                <h3>Página não encontrada</h3>
                <p>A página que você está procurando não existe ou foi removida.</p>
              </div>
            } />
          </Routes>
        </Container>
        <footer className="footer mt-auto py-3 bg-dark text-white">
          <Container className="text-center">
            <span>Sistema de Controle de Gastos Residenciais &copy; {new Date().getFullYear()}</span>
          </Container>
        </footer>
      </div>
    </Router>
  );
};

export default App;