/* ── useMetrics Hook ── */

import { useState, useEffect } from 'react';
import type { SystemMetrics } from '../types';
import { api } from '../services/api';
import { METRICS_POLL_INTERVAL } from '../utils/constants';

export function useMetrics() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const poll = async () => {
      try {
        const data = await api.getMetrics();
        if (mounted) {
          setMetrics(data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Metrics poll failed:', err);
      }
    };

    poll();
    const timer = setInterval(poll, METRICS_POLL_INTERVAL);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  return { metrics, loading };
}
