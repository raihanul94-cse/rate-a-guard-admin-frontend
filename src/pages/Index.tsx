
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to admin login page
    navigate('/admin/login');
  }, [navigate]);

  return null;
};

export default Index;
