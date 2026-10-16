const ErrorState = ({ message = 'Something went wrong.', onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center" role="alert">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 font-display text-2xl font-extrabold text-rose-600 rotate-[6deg]">
      !
    </div>
    <p className="max-w-sm text-sm font-medium text-ink-soft">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn-secondary mt-5">
        Try again
      </button>
    )}
  </div>
);

export default ErrorState;
