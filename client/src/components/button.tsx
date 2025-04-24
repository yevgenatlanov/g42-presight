import React from "react";
import Spinner from "./spinner";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  ...props
}) => {
  // Create style classes using a lookup object
  const styles = {
    base: "inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2",
    variant: {
      primary: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900",
      secondary:
        "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-400",
      outline:
        "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus:ring-gray-400",
    },
    size: {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-5 py-2.5 text-base",
    },
    state: props.disabled ? "opacity-50 cursor-not-allowed" : "",
  };

  return (
    <button
      className={`${styles.base} ${styles.variant[variant]} ${styles.size[size]} ${styles.state} ${className}`}
      {...props}
    >
      {isLoading && <Spinner />}
      {children}
    </button>
  );
};

export default Button;
