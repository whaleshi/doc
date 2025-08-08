'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import echo from '@/utils/echo';

const EchoStatusContext = createContext<'connected' | 'disconnected' | 'error' | 'connecting'>('connecting');

export function EchoProvider({ children }: { children: React.ReactNode }) {
	const [status, setStatus] = useState<'connected' | 'disconnected' | 'error' | 'connecting'>('connecting');

	useEffect(() => {
		if (!echo) return;
		const connector = echo.connector;

		if ('pusher' in connector) {
			connector.pusher.connection.bind('connected', () => {
				setStatus('connected');
			});
			connector.pusher.connection.bind('disconnected', () => {
				setStatus('disconnected');
			});
			connector.pusher.connection.bind('error', () => {
				setStatus('error');
			});
		}

		return () => {
			echo?.disconnect();
		};
	}, []);

	return <EchoStatusContext.Provider value={status}>{children}</EchoStatusContext.Provider>;
}

export const useEchoStatus = () => useContext(EchoStatusContext);
