import { useRouteError } from "react-router-dom";
import { ErrorFallback } from "./ErrorFallback";

export const RootErrorElement = () => {
	const error = useRouteError() as Error;

	const handleReset = () => {
		window.location.reload();
	};

	return (
		<ErrorFallback
			error={error || new Error("Unknown routing error")}
			resetErrorBoundary={handleReset}
		/>
	);
};
