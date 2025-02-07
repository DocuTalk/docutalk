import Section from "../components/Section";
import { gradient } from "../assets";
import config from '../config/config';

const guideSections = [
  {
    title: "Getting Started",
    content: "Welcome to DocuTalk! This guide will help you get started with our document management and AI conversation platform. Follow these steps to begin your journey.",
    steps: [
      {
        title: "Create an Account",
        description: "Sign up for DocuTalk using your email address. Verify your email to activate your account."
      },
      {
        title: "Complete Your Profile",
        description: "Add your name and profile picture to personalize your account."
      }
    ]
  },
  {
    title: "Uploading Documents",
    content: "To upload a document, navigate to the Upload section in the navigation bar. Select a PDF file from your device. The document will be processed and ready for interaction within moments.",
    steps: [
      {
        title: "Select File",
        description: "Click the Upload button or drag and drop your PDF files."
      },
      {
        title: "Processing",
        description: "Wait for the document to be processed by our AI system."
      }
    ]
  },
  {
    title: "Document Management",
    content: "Your documents are securely stored and easily accessible from the Home tab. Use the search bar to find specific documents, or browse through your collection using our intuitive grid layout.",
    steps: [
      {
        title: "Organization",
        description: "Keep your documents organized with clear names and descriptions."
      },
      {
        title: "Access",
        description: "Quickly find and access your documents from the dashboard."
      }
    ]
  },
  {
    title: "AI Conversations",
    content: "Select any document to start a conversation about its contents. Ask questions naturally, and our AI will help you understand and extract information efficiently. Try asking for summaries, specific details, or explanations.",
    steps: [
      {
        title: "Start Chat",
        description: "Click on any document to begin an AI-powered conversation."
      },
      {
        title: "Ask Questions",
        description: "Use natural language to ask about document contents."
      }
    ]
  },
  {
    title: "Profile & Settings",
    content: "Manage your account settings, view usage statistics, and customize your experience through the Profile tab. You can also access help resources and contact support from here.",
    steps: [
      {
        title: "Account Management",
        description: "Update your profile and manage account settings."
      },
      {
        title: "Support",
        description: "Access help resources and contact our support team."
      }
    ]
  },
  {
    title: "Tips & Best Practices",
    content: "For optimal results, ensure your PDFs are clearly readable and properly scanned. Use specific questions when conversing with the AI, and organize your documents with clear names for easy retrieval.",
    steps: [
      {
        title: "Document Quality",
        description: "Use clear, well-scanned PDFs for best results."
      },
      {
        title: "Effective Queries",
        description: "Ask specific questions to get the most accurate responses."
      }
    ]
  }
];

const GuideSection = ({ title, content, steps }) => (
  <div className="mb-12 last:mb-0">
    <div className={`bg-[${config.colors.surfaceSecondary}] border border-[${config.colors.border}] rounded-xl p-6 mb-6`}>
      <h2 className={`text-xl font-semibold text-[${config.colors.textPrimary}] mb-3`}>
        {title}
      </h2>
      <p className={`text-[${config.colors.textSecondary}] mb-6`}>
        {content}
      </p>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex gap-4">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-[${config.colors.primaryAlpha}] flex items-center justify-center text-[${config.colors.primary}] font-semibold`}>
              {index + 1}
            </div>
            <div>
              <h3 className={`font-medium text-[${config.colors.textPrimary}] mb-1`}>
                {step.title}
              </h3>
              <p className={`text-[${config.colors.textSecondary}]`}>
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Guide = () => {
  return (
    <Section className="pt-[12rem] -mt-[5.25rem]" crosses>
      <div className="container relative">
        <div className="relative z-1 max-w-[62rem] mx-auto">
          <h1 className="h1 mb-6 text-center">DocuTalk Guide</h1>
          <p className={`text-[${config.colors.textSecondary}] text-center text-lg mb-12`}>
            Learn how to make the most of DocuTalk's features and capabilities.
          </p>
          
          <div className="bg-n-8 border border-n-6 rounded-2xl p-8">
            {guideSections.map((section, index) => (
              <GuideSection key={index} {...section} />
            ))}
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

export default Guide; 