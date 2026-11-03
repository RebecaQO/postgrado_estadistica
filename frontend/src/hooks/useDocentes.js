import { useState, useEffect } from 'react';
import { docenteService } from '../services/docenteService';

export function useDocentes() {
  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDocentes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await docenteService.getPublicDocentes();
      setDocentes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando docentes:', err);
      setError(err.message || 'Error al cargar los docentes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocentes();
  }, []);

  return { docentes, loading, error, refetch: fetchDocentes };
}

export default useDocentes;
