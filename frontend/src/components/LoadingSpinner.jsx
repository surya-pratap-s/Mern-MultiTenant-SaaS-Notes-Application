export default function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-current border-e-transparent text-blue-600 dark:text-white" />
        </div>
    );
}
