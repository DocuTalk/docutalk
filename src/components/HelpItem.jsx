import { config } from '../config/config';

const HelpItem = ({ icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center w-full p-4 bg-n-8 border border-n-6 rounded-xl transition-colors hover:bg-n-7"
  >
    <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-[${config.colors.primaryAlpha}] mr-3`}>
      <svg 
        className={`w-6 h-6 text-[${config.colors.primary}]`}
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor"
      >
        {icon}
      </svg>
    </div>
    {/* ... rest of the component */}
  </button>
); 