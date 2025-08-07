import { useState, useEffect } from 'react';
import { ShareholdersData } from '@/types/shareholders';
import { ShareholdersService } from '@/services/shareholdersService';

interface UseShareholdersDataReturn {
  data: ShareholdersData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useShareholdersData = (ticker: string): UseShareholdersDataReturn => {
  const [data, setData] = useState<ShareholdersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!ticker) {
      setError('Ticker is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const shareholdersData = await ShareholdersService.getAllShareholdersData(ticker);
      setData(shareholdersData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải dữ liệu cổ đông';
      setError(errorMessage);
      console.error('Error fetching shareholders data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [ticker]);

  return {
    data,
    loading,
    error,
    refetch
  };
};
