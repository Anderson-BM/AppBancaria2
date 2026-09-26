import { useCallback, useEffect, useState } from 'react';
import { authApi } from '../../api/auth.js';

export function useAuth() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [hasPin, setHasPin] = useState(false);
  const [error, setError] = useState('');

  const refreshStatus = useCallback(async () => {
    try {
      const status = await authApi.status();
      setAuthenticated(status.authenticated);
      setHasPin(status.hasPin);
    } catch {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const createPin = useCallback(async (pin) => {
    await authApi.setupPin(pin);
    setAuthenticated(true);
    setHasPin(true);
  }, []);

  const login = useCallback(async (pin) => {
    try {
      await authApi.login(pin);
      setAuthenticated(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setAuthenticated(false);
  }, []);

  return { checking, authenticated, hasPin, error, createPin, login, logout };
}
