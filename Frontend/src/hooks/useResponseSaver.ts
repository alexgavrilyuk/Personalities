import { useCallback, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Response {
  questionId: string;
  responseValue?: number;
  selectedOption?: 'a' | 'b';
}

interface SaveStatus {
  isSaving: boolean;
  lastSaved: Date | null;
  error: string | null;
}

export const useResponseSaver = () => {
  const { session } = useAuth();
  const [saveStatus, setSaveStatus] = useState<SaveStatus>({
    isSaving: false,
    lastSaved: null,
    error: null
  });
  
  const saveQueue = useRef<Response[]>([]);
  const saveTimer = useRef<NodeJS.Timeout | null>(null);

  const saveResponses = useCallback(async (responses: Response[]) => {
    if (!session?.access_token) return;

    setSaveStatus(prev => ({ ...prev, isSaving: true, error: null }));

    try {
      const endpoint = responses.length === 1 
        ? `${process.env.REACT_APP_AUTH_API_URL}/responses/save`
        : `${process.env.REACT_APP_AUTH_API_URL}/responses/batch`;

      const body = responses.length === 1 
        ? {
            questionId: responses[0].questionId,
            responseValue: responses[0].responseValue,
            selectedOption: responses[0].selectedOption
          }
        : { responses };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error('Failed to save responses');
      }

      setSaveStatus({
        isSaving: false,
        lastSaved: new Date(),
        error: null
      });
    } catch (error) {
      setSaveStatus(prev => ({
        ...prev,
        isSaving: false,
        error: 'Failed to save response. Will retry...'
      }));
      
      // Add back to queue for retry
      saveQueue.current = [...saveQueue.current, ...responses];
    }
  }, [session]);

  const queueResponse = useCallback((response: Response) => {
    if (!session) return;

    saveQueue.current.push(response);

    // Clear existing timer
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }

    // Set new timer for debounced save
    saveTimer.current = setTimeout(() => {
      if (saveQueue.current.length > 0) {
        const toSave = [...saveQueue.current];
        saveQueue.current = [];
        saveResponses(toSave);
      }
    }, 500); // 500ms debounce
  }, [session, saveResponses]);

  const saveImmediately = useCallback(async () => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }

    if (saveQueue.current.length > 0) {
      const toSave = [...saveQueue.current];
      saveQueue.current = [];
      await saveResponses(toSave);
    }
  }, [saveResponses]);

  return {
    queueResponse,
    saveImmediately,
    saveStatus
  };
};