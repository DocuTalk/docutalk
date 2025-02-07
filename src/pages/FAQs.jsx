import { useState } from 'react';
import Section from "../components/Section";
import { gradient } from "../assets";
import config from '../config/config';

const faqs = [
  {
    question: "What is DocuTalk?",
    answer: "DocuTalk is an intelligent document management app that allows you to upload, analyze, and interact with your documents through natural conversation. It uses AI to help you understand and extract information from your documents efficiently."
  },
  {
    question: "What types of documents can I upload?",
    answer: "Currently, DocuTalk supports PDF documents. We plan to add support for more document types in future updates."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we take data security very seriously. All documents are encrypted during transmission and storage. We use industry-standard security measures to protect your data."
  },
  {
    question: "How does the AI conversation feature work?",
    answer: "Our AI analyzes your documents and allows you to ask questions about their content in natural language. It can help you find specific information, summarize content, and understand complex documents better."
  },
  {
    question: "What are the upload limits?",
    answer: "Free accounts can upload documents up to 1 document of upto 5MB in size. Premium accounts have higher limits and additional features."
  },
  {
    question: "Can I share documents with others?",
    answer: "Currently, document sharing is not available as we prioritize the security and privacy of your documents. We're working on implementing secure sharing features in future updates while maintaining the highest level of data protection."
  }
];

const FAQItem = ({ faq, isExpanded, onToggle }) => (
  <div 
    className={`border border-[${config.colors.border}] rounded-xl overflow-hidden transition-all duration-200 ${
      isExpanded ? 'bg-n-7' : 'bg-n-8 hover:bg-n-7'
    }`}
  >
    <button
      className="w-full flex justify-between items-center p-6 text-left"
      onClick={onToggle}
    >
      <h3 className={`text-[${config.colors.textPrimary}] text-lg font-medium flex-1 mr-4`}>
        {faq.question}
      </h3>
      <svg
        className={`w-6 h-6 text-[${config.colors.primary}] transform transition-transform duration-200 ${
          isExpanded ? 'rotate-180' : ''
        }`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    
    <div 
      className={`overflow-hidden transition-all duration-200 ${
        isExpanded ? 'max-h-96' : 'max-h-0'
      }`}
    >
      <p className={`px-6 pb-6 text-[${config.colors.textSecondary}] leading-relaxed`}>
        {faq.answer}
      </p>
    </div>
  </div>
);

const FAQs = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleFAQ = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Section className="pt-[12rem] -mt-[5.25rem]" crosses>
      <div className="container relative">
        <div className="relative z-1 max-w-[62rem] mx-auto">
          <h1 className="h1 mb-6 text-center">Frequently Asked Questions</h1>
          <p className={`text-[${config.colors.textSecondary}] text-center text-lg mb-12`}>
            Find answers to common questions about DocuTalk.
          </p>
          
          <div className="bg-n-8 border border-n-6 rounded-2xl p-8">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  faq={faq}
                  isExpanded={expandedIndex === index}
                  onToggle={() => toggleFAQ(index)}
                />
              ))}
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

export default FAQs; 