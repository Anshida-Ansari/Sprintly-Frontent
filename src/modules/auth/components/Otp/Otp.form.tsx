interface Props {
	isLoading: boolean;
	disabled: boolean;
	error: string;
	onSubmit: () => void;
}

const OtpForm = ({ isLoading, disabled, error, onSubmit }: Props) => {
	return (
		<>
			{error && (
				<p className="text-center text-sm text-red-600 mb-4">{error}</p>
			)}

			<button
				disabled={disabled}
				onClick={onSubmit}
				className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-300"
			>
				{isLoading ? "Verifying..." : "Verify OTP"}
			</button>
		</>
	);
};

export default OtpForm;
