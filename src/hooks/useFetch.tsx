import { useEffect, useState } from 'react';
import { HttpMethod } from '../core/enums/httpMethods';
import { FetchResult, IResponse } from '../core/interfaces/fetchResult.interface';
import { IFetchRequest } from '../core/interfaces/fetchRequest.interface';

export default function useFetch(
  url: string, 
  pagination?: { page: number, limit: number }, 
  method: HttpMethod = HttpMethod.GET, 
  body = null
): FetchResult<any> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState<any[]>([]);
  const [response, setResponse] = useState<IResponse>({
    results: [],
    info: null
  });
  const [page, setPage] = useState(pagination?.page || 1);
  const [limit, setLimit] = useState(pagination?.page || 10);
  const [hasMore, setHasMore] = useState(true);

  const handleScroll = () => {
    // Verifica si se ha llegado al final de la página
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.offsetHeight
    ) {
      // Evita realizar una nueva carga si ya se está cargando contenido
      if (loading && hasMore) {
        setLoading(true);
        // setPage(page+1)
        // setPage((prevPage) => prevPage + 1); // Incrementa el número de página
      }else {
        setPage((prevPage) => prevPage + 1);
        if (!loading) {
          fetchData();
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchData();
    }
  }, [url, method, body, page]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : null,
      };
      const response = await fetch(`${url}?page=${page}&results=${20}`, options);
      const responseData = await response.json();
      setResponse(responseData)
      setHasMore(responseData?.results.length > 0);
      setLoading(false);
    } catch (error: any) {
      setError(error);
      setLoading(false);
    }
  };

  return { response, loading, error };
}