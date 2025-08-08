import React from 'react';
import { Toaster } from "sonner";

export default function BaseLayout({ children }: { children: React.ReactNode }) {
	return (
		<div style={{ paddingBottom: '64px' }}>
			<Toaster
				position="top-center"
				toastOptions={{
					classNames: {
						toast: "f500",
					},
				}}
			/>
			{children}
		</div>
	);
}
