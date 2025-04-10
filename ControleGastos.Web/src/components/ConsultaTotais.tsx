import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Totais } from '../models/Totais';
import { usuarioService } from '../services/usuarioService';
import Notification from './Notification';

const ConsultaTotais: React.FC = () => {
  const [totais, setTotais] = useState<Totais | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'danger' } | null>(null);

  // Carrega os totais ao iniciar o componente
  useEffect(() => {
    const carregarTotais = async () => {
      try {
        setLoading(true);
        const data = await usuarioService.getTotais();
        setTotais(data);
      } catch (error) {
        console.error('Erro ao carregar totais:', error);
        setNotification({
          message: 'Ocorreu um erro ao carregar os totais do sistema.',
          type: 'danger'
        });
      } finally {
        setLoading(false);
      }
    };

    carregarTotais();
  }, []);

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
      
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">Consulta de Totais</h4>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center">
                  <p>Carregando totais...</p>
                </div>
              ) : !totais ? (
                <div className="text-center">
                  <p>Nenhum dado encontrado.</p>
                </div>
              ) : (
                <div>
                  <h5 className="mb-4 text-center">Resumo Financeiro Geral</h5>
                  
                  <Row className="mb-4">
                    <Col xs={12} md={4} className="mb-3">
                      <Card className="text-center h-100">
                        <Card.Body>
                          <h6 className="text-muted">Total de Receitas</h6>
                          <h3 className="text-success">{formatCurrency(totais.totalReceitas)}</h3>
                        </Card.Body>
                      </Card>
                    </Col>
                    
                    <Col xs={12} md={4} className="mb-3">
                      <Card className="text-center h-100">
                        <Card.Body>
                          <h6 className="text-muted">Total de Despesas</h6>
                          <h3 className="text-danger">{formatCurrency(totais.totalDespesas)}</h3>
                        </Card.Body>
                      </Card>
                    </Col>
                    
                    <Col xs={12} md={4} className="mb-3">
                      <Card className="text-center h-100">
                        <Card.Body>
                          <h6 className="text-muted">Saldo Líquido</h6>
                          <h3 className={totais.saldoLiquido >= 0 ? 'text-success' : 'text-danger'}>
                            {formatCurrency(totais.saldoLiquido)}
                          </h3>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col xs={12} md={6} className="mb-3">
                      <Card className="text-center h-100">
                        <Card.Body>
                          <h6 className="text-muted">Total de Usuários</h6>
                          <h3>{totais.totalUsuarios}</h3>
                        </Card.Body>
                      </Card>
                    </Col>
                    
                    <Col xs={12} md={6} className="mb-3">
                      <Card className="text-center h-100">
                        <Card.Body>
                          <h6 className="text-muted">Total de Transações</h6>
                          <h3>{totais.totalTransacoes}</h3>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ConsultaTotais;