import { useState, useEffect } from 'react';
import { programaService } from '../services/programaService';

export function useProgramas(onlyActive = true) {
  const [programas, setProgramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProgramas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = onlyActive
        ? await programaService.getActivos()
        : await programaService.getAll();
      setProgramas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando programas:', err);
      setError(err.message || 'Error al cargar los programas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgramas();
  }, [onlyActive]);

  return { programas, loading, error, refetch: fetchProgramas };
}

export default useProgramas;
