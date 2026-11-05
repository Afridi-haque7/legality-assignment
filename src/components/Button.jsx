function Button({ className = "", ...props }) {
  return (
    <button
      type="button"
      className={`cursor-pointer rounded-md border border-gray-200 bg-white px-4 py-2 hover:bg-gray-50 ${className}`}
      {...props}
    />
  );
}

export default Button;
