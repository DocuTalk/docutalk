import { config } from '../config/config';

const Icon = ({ icon, size = 6, color = 'primary' }) => (
  <svg 
    className={`w-${size} h-${size} text-[${config.colors[color]}]`}
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor"
  >
    {icon}
  </svg>
);

export default Icon; 