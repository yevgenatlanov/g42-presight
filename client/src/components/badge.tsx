import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "secondary" | "primary";
  size?: "sm" | "md";
  className?: string;
  onClick?: () => void;
  title?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "sm",
  className = "",
  onClick,
  title,
}) => {
  const baseStyles = "inline-flex items-center rounded-full font-medium";

  const variantStyles = {
    default: "bg-gray-900 text-white hover:bg-gray-800",
    primary: "bg-blue-900 text-white hover:bg-blue-800",
    outline: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-sm",
  };

  const clickableStyles = onClick ? "cursor-pointer" : "";

  return (
    <span
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${clickableStyles} ${className}`}
      onClick={onClick}
      title={title}
    >
      {children}
    </span>
  );
};

export default Badge;
