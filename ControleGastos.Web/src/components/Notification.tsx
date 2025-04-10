import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';

interface NotificationProps {
  message: string;
  type: 'success' | 'danger';
  onClose?: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Fecha a notificação automaticamente após 5 segundos
    const timer = setTimeout(() => {
      setShow(false);
      if (onClose) onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!show || !message) return null;

  return (
    <Alert 
      variant={type} 
      onClose={() => {
        setShow(false);
        if (onClose) onClose();
      }} 
      dismissible
      className="mt-3 position-fixed top-0 start-50 translate-middle-x"
      style={{ zIndex: 1050, width: 'auto', maxWidth: '90%' }}
    >
      {message}
    </Alert>
  );
};

export default Notification;