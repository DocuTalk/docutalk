import ButtonSvg from "../assets/svg/ButtonSvg";

const Button = ({ className, href, variant = 'primary', onClick, children, px, white, red }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'text-n-1 hover:text-color-1';
      case 'secondary':
        return 'bg-n-6 hover:bg-n-5 text-n-1';
      default:
        return 'text-n-1 hover:text-color-1';
    }
  };

  const classes = `button relative inline-flex items-center justify-center h-11 transition-colors ${getVariantStyles()} ${
    px || "px-7"
  } ${white ? "text-n-8" : ""} ${className || ""}`;

  const spanClasses = `relative z-10 ${red ? "text-n-1" : ""}`;

  const renderButton = () => (
    <button className={classes} onClick={onClick}>
      <span className={spanClasses}>{children}</span>
      {ButtonSvg(white, red)}
    </button>
  );

  const renderLink = () => (
    <a href={href} className={classes}>
      <span className={spanClasses}>{children}</span>
      {ButtonSvg(white, red)}
    </a>
  );

  return onClick ? renderButton() : href ? renderLink() : renderButton();
};

export default Button;