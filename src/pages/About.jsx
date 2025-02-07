import Section from "../components/Section";
import { gradient } from "../assets";
import docutalkLogo from '../assets/docutalk-logo.png';
import config from '../config/config';

const FeatureItem = ({ icon, title }) => (
  <div className="flex items-center gap-4 p-4 rounded-xl bg-n-7 border border-n-6">
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
    <span className="text-base font-medium text-n-1">
      {title}
    </span>
  </div>
);

const About = () => {
  return (
    <Section className="pt-[12rem] -mt-[5.25rem]" crosses>
      <div className="container relative">
        <div className="relative z-1 max-w-[62rem] mx-auto">
          <h1 className="h1 mb-6 text-center">About</h1>
          
          <div className="space-y-8">
            {/* Logo and App Info Card */}
            <div className="bg-n-8 border border-n-6 rounded-2xl p-8">
              <div className="flex flex-col items-center mb-8">
                <div className="w-32 h-32 flex items-center justify-center p-4 rounded-3xl bg-n-7">
                  <img 
                    src={docutalkLogo}
                    alt="DocuTalk Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h2 className="text-4xl font-bold text-n-1 mt-4 tracking-tight">
                  {config.appName}
                </h2>
                <p className="text-n-3 mt-1">
                  Version 1.0.4
                </p>
              </div>

              <div className="mb-2">
                <p className="text-n-3 text-center text-base leading-relaxed px-2">
                  DocuTalk is your intelligent document companion, making it easy to manage, analyze, and interact with your documents through natural conversation.
                </p>
              </div>
            </div>

            {/* Features Card */}
            <div className="bg-n-8 border border-n-6 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold text-n-1 mb-6">
                Key Features
              </h3>
              <div className="space-y-4">
                <FeatureItem 
                  icon={<path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />}
                  title="Document Upload & Management"
                />
                <FeatureItem 
                  icon={<path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />}
                  title="AI-Powered Document Analysis"
                />
                <FeatureItem 
                  icon={<path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />}
                  title="Natural Language Interaction"
                />
                <FeatureItem 
                  icon={<path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />}
                  title="Secure Document Storage"
                />
              </div>
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

export default About; 