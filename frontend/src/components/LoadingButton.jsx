import React from 'react'

const LoadingButton = (
{
    isLoading,
    onClick,
    label,
    className = "",
    disabled = false,
}
) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`
        flex items-center justify-center
        px-6 py-2 rounded-lg text-white
        min-w-[180px]
        transition-all duration-200
        ${isLoading || disabled
          ? "bg-purple-400 cursor-not-allowed"
          : "bg-purple-500 hover:bg-purple-600"}
        ${className}
      `}
    >
      {isLoading ? (
        //  Spinner only
        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      ) : (
        label
      )}
    </button>
  )
}

export default LoadingButton