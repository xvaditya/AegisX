/* ── useActions Hook ── */

import { useState, useCallback } from 'react';
import type { ActionRequest, ActionResponse, ActionType } from '../types';
import { api } from '../services/api';

export function useActions() {
  const [executing, setExecuting] = useState(false);
  const [lastResult, setLastResult] = useState<ActionResponse | null>(null);
  const [history, setHistory] = useState<ActionResponse[]>([]);

  const execute = useCallback(async (actionType: ActionType, target: string, incidentId?: string) => {
    setExecuting(true);
    setLastResult(null);

    const request: ActionRequest = {
      action_type: actionType,
      target,
      incident_id: incidentId,
      confirmed: true,
    };

    try {
      const result = await api.executeAction(request);
      setLastResult(result);
      setHistory((prev) => [result, ...prev].slice(0, 20));
      return result;
    } catch (err) {
      console.error('Action execution failed:', err);
      return null;
    } finally {
      setExecuting(false);
    }
  }, []);

  return { execute, executing, lastResult, history };
}
