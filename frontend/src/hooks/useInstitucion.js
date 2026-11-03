import { useState, useEffect } from 'react';
import { institucionService } from '../services/institucionService';

export function useInstitucion() {
  const [institucion, setInstitucion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInstitucion = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await institucionService.getInfo();
      setInstitucion(data);
    } catch (err) {
      console.error('Error cargando información institucional:', err);
      setError(err.message || 'Error al cargar información institucional');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitucion();
  }, []);

  return { institucion, loading, error, refetch: fetchInstitucion };
}

export default useInstitucion;
