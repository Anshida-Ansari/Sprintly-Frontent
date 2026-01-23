import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import LoadingExperience from "./shared/components/Loding";

function App() {
	return (
		<div className="App">
			<Suspense fallback={<LoadingExperience />}>
				<Outlet />
			</Suspense>
		</div>
	);
}

export default App;
