export default function Button({
  children,
  onClick,
  colorProps,
  className,
  ...rest
}) {
  const color = {
    default: "text-indigo-500 hover:text-indigo-700",
    connected: "text-green-500"
  };

  return (
    <div>
      <button
        {...rest}
        onClick={onClick}
        // disabled={false}
        className={`disabled:opacity-50 ${className} ${
          colorProps ? color[colorProps] : color.default
        }   px-4 py-2 border rounded-xl font-medium `}
      >
        {children}
      </button>
    </div>
  );
}
