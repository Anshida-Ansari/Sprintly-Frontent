import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/app.routes";
import { ErrorBoundary } from "./shared/components/ErrorBoundary";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ErrorBoundary>
			<QueryClientProvider client={queryClient}>
				<Toaster position="top-right" reverseOrder={false} />
				<RouterProvider router={router} />
			</QueryClientProvider>
		</ErrorBoundary>
	</StrictMode>,
);
