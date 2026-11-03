import { useState, useEffect } from 'react';
import { defensaService } from '../services/defensaService';

export function useDefensas() {
  const [defensas, setDefensas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDefensas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await defensaService.getDefensasTesis();
      setDefensas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando defensas de tesis:', err);
      setError(err.message || 'Error al cargar defensas de tesis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDefensas();
  }, []);

  return { defensas, loading, error, refetch: fetchDefensas };
}

export default useDefensas;
