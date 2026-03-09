import { useState, useEffect } from 'react';
import { fetchDashboardData, Director, DashboardStats } from '../lib/data';

export function useDashboardData() {
    const [data, setData] = useState<Director[]>([]);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [pipelineLog, setPipelineLog] = useState<{ timestamp: string; status: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const result = await fetchDashboardData();
            setData(result.directors);
            setStats(result.stats);
            setPipelineLog(result.pipelineLog);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch data'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return { data, stats, pipelineLog, loading, error, refresh: loadData };
}
