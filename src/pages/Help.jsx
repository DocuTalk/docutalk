import Section from "../components/Section";
import { gradient } from "../assets";
import { useNavigate } from "react-router-dom";
import { config } from '../config/config';
import Icon from '../components/Icon';

const HelpItem = ({ icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full p-4 bg-[${config.colors.background}] border border-[${config.colors.border}] rounded-xl transition-colors hover:bg-[${config.colors.surfacePrimary}]`}
  >
    <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-[${config.colors.primaryAlpha}] mr-3`}>
      <Icon icon={icon} color="primary" />
    </div>
    <div className="flex-1 text-left">
      <h3 className={`text-base font-semibold text-[${config.colors.textPrimary}] mb-1`}>{title}</h3>
      <p className={`text-sm text-[${config.colors.textSecondary}]`}>{description}</p>
    </div>
    <svg 
      className={`w-6 h-6 text-[${config.colors.primary}]`}
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={1.5} 
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  </button>
);

const Help = () => {
  const navigate = useNavigate();

  return (
    <Section className="pt-[12rem] -mt-[5.25rem]" crosses>
      <div className="container relative">
        <div className="relative z-1 max-w-[62rem] mx-auto">
          <h1 className="h1 mb-6 text-center">Help & Support</h1>
          <p className="text-n-3 text-center text-lg mb-12">
            Get help with DocuTalk
          </p>

          <div className="bg-n-8 border border-n-6 rounded-2xl p-8">
            <div className="space-y-4">
              <HelpItem 
                icon={<path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />}
                title="Contact Support"
                description="Email us at cust.supp.docutalk@gmail.com"
                onClick={() => window.location.href = 'mailto:cust.supp.docutalk@gmail.com'}
              />

              <HelpItem 
                icon={<path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />}
                title="FAQs"
                description="Find answers to common questions"
                onClick={() => navigate('/faqs')}
              />

              <HelpItem 
                icon={<path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />}
                title="User Guide"
                description="Learn how to use DocuTalk"
                onClick={() => navigate('/guide')}
              />
            </div>
          </div>
        </div>

        {/* Background gradient */}
        <div className="absolute top-0 -left-[10rem] w-[56.625rem] h-[56.625rem] opacity-50 mix-blend-color-dodge pointer-events-none">
          <img
            className="absolute top-1/2 left-1/2 w-[79.5625rem] h-[88.5625rem] -translate-x-1/2 -translate-y-1/2"
            src={gradient}
            alt="Gradient"
          />
        </div>
      </div>
    </Section>
  );
};

export default Help; 