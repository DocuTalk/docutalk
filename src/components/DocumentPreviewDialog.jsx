import { useState, useRef, useEffect } from 'react';
import Button from './Button';
import { gradient } from "../assets";
import pdfIcon from "../assets/pdf-icon.png";
import config from '../config/config';
import authService from '../lib/appwrite';

const DocumentPreviewDialog = ({ isOpen, onClose, document: docData }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const isBuffering = useRef(false);
  const userScrolledRef = useRef(false);
  const abortControllerRef = useRef(null);
  const shouldStopBuffering = useRef(false);
  const [queryCount, setQueryCount] = useState(0);

  // Add new constant for max query count
  const STANDARD_MAX_QUERY_COUNT = config.standardMaxQueryCount;

  // Clear messages when dialog is closed or document changes
  useEffect(() => {
    if (!isOpen) {
      setMessages([]);
      setInputMessage('');
      setIsLoading(false);
      setIsTyping(false);
      setAutoScroll(true);
      userScrolledRef.current = false;
      isBuffering.current = false;
      shouldStopBuffering.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }
  }, [isOpen, docData?.$id]); // Reset when dialog closes or document changes

  useEffect(() => {
    const fetchQueryCount = async () => {
      try {
        // Get current user's account
        const currentUser = await authService.getCurrentUser();
        if (!currentUser) {
          console.error('No current user found');
          return;
        }
        
        // Use the accountId to get query count
        const count = await authService.getUserQueryCount(currentUser.accountId);
        setQueryCount(count);
      } catch (error) {
        console.error('Error fetching query count:', error);
      }
    };

    if (isOpen && docData) {
      fetchQueryCount();
    }
  }, [isOpen, docData]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check if at bottom
  const isAtBottom = () => {
    const container = chatContainerRef.current;
    if (!container) return false;
    return Math.abs(
      (container.scrollHeight - container.clientHeight) - 
      container.scrollTop
    ) < 50;
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    if (!chatContainerRef.current) return;
    chatContainerRef.current.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth'
    });
  };

  // Handle scroll events
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isBuffering.current) {
        if (!isAtBottom()) {
          userScrolledRef.current = true;
          setAutoScroll(false);
        }
      } else {
        setAutoScroll(isAtBottom());
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll when messages change
  useEffect(() => {
    if (!isBuffering.current) {
      setAutoScroll(true);
      scrollToBottom();
    }
  }, [messages]);

  // Add stop handler
  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    shouldStopBuffering.current = true;
    setIsLoading(false);
    setIsTyping(false);
  };

  // Modify simulateTyping to check for stop signal
  const simulateTyping = async (text, messageId) => {
    const minTypingSpeed = 20;
    const maxTypingSpeed = 40;
    let displayedText = '';

    setIsTyping(true);
    isBuffering.current = true;
    
    try {
      for (let i = 0; i < text.length; i++) {
        if (shouldStopBuffering.current) {
          break;
        }

        displayedText += text[i];
        const finalText = displayedText;

        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === messageId 
              ? { ...msg, content: finalText }
              : msg
          )
        );

        if (!userScrolledRef.current) {
          scrollToBottom();
        }

        const delay = Math.random() * (maxTypingSpeed - minTypingSpeed) + minTypingSpeed;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } finally {
      isBuffering.current = false;
      setIsTyping(false);
      shouldStopBuffering.current = false;
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here if you want
      console.log('Text copied to clipboard');
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  // Function to clean text of special characters and normalize whitespace
  const cleanText = (text) => {
    return text
      .replace(/\n/g, ' ')         // Replace newlines with spaces
      .replace(/[^\w\s.,?!]/g, '') // Remove special characters except basic punctuation
      .replace(/\s+/g, ' ')        // Normalize all whitespace (including multiple spaces from newlines)
      .trim();
  };

  // Function to format chat history for the system prompt
  const formatChatHistory = (messages) => {
    const history = [...messages]
      .reverse()
      .reduce((acc, msg, index, arr) => {
        if (msg.type === 'user') {
          const aiResponse = arr[index - 1];
          if (aiResponse && aiResponse.type === 'ai') {
            // Clean both query and response
            const cleanedQuery = cleanText(msg.content);
            const cleanedResponse = cleanText(aiResponse.content);
            
            // Add the pair in correct order
            acc.push(`Human: ${cleanedQuery}`);
            acc.push(`Assistant: ${cleanedResponse}`);
          }
        }
        return acc;
      }, []);

    // Join with spaces instead of newlines and limit to 500 characters
    return history.join(' ').slice(0, 500);
  };

  // Add this function near the top of the component
  const getUserFriendlyErrorMessage = (error) => {
    // Check if error is from API response
    if (error.message?.includes('No running EC2 instance')) {
      return "Our servers are experiencing high demand. Please try again in a few minutes.";
    }
    
    if (error.message?.includes('timeout') || error.name === 'TimeoutError') {
      return "The request took too long to process. Please try a shorter question or try again later.";
    }

    // Handle other specific API errors
    if (error.statusCode === 500) {
      return "We're experiencing technical difficulties. Please try again in a few minutes.";
    }

    if (error.message?.includes('Failed to fetch') || error.message?.includes('Network')) {
      return "Unable to connect to the server. Please check your internet connection and try again.";
    }

    // Default error message
    return "Something went wrong. Please try again later.";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    try {
      // Get current user and check last update time
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        const lastUpdated = new Date(currentUser.$updatedAt);
        const today = new Date();
        
        // Check if last update was from a previous day
        if (lastUpdated.getDate() !== today.getDate() || 
            lastUpdated.getMonth() !== today.getMonth() || 
            lastUpdated.getFullYear() !== today.getFullYear()) {
            
            console.log('Resetting query count - new day');
            
            // Reset query count to 0
            await authService.database.updateDocument(
                config.appwriteDatabaseId,
                config.appwriteUserCollectionId,
                currentUser.userDocId,
                {
                    queryCount: 0
                }
            );
            
            // Update local query count
            setQueryCount(0);
        }

        console.log('\n👤 User Document Info:', {
          lastUpdated: currentUser.$updatedAt,
          queryCount: currentUser.queryCount,
          userId: currentUser.accountId
        });
      }

      // Now check if user has reached query limit (using potentially reset count)
      if (queryCount >= STANDARD_MAX_QUERY_COUNT) {
        const errorMessage = {
          id: Date.now().toString(),
          type: 'error',
          content: 'You have reached your daily request limit. Please upgrade your account to get more requests.',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
        return;
      }

      // Reset states
      userScrolledRef.current = false;
      setAutoScroll(true);
      scrollToBottom();
      shouldStopBuffering.current = false;

      // Create new AbortController
      abortControllerRef.current = new AbortController();

      // Always enable auto-scroll for new messages
      userScrolledRef.current = false;
      setAutoScroll(true);
      scrollToBottom();

      // Add user message to chat
      const userMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: inputMessage,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');
      setIsLoading(true);

      // Log the API payload
      const apiPayload = {
        input: {
          messages: [{
            role: 'user',
            content: {
              pdf_url: docData.document,
              user_id: typeof docData.users === 'object' ? docData.users.$id : docData.users,
              action: 'similarity_search',
              query: inputMessage,
              system_prompt: `You are an expert document analyzer. Provide detailed answers based on the context. Previous conversation: ${formatChatHistory(messages)}`,
              temperature: 0.5
            }
          }]
        }
      };

      console.log('\n📤 Query API Payload:', JSON.stringify(apiPayload, null, 2));

      // Use the configured API endpoint
      const response = await fetch(config.queryApiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(apiPayload),
        signal: abortControllerRef.current.signal
      });

      console.log('\n📥 Raw API Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      const responseData = await response.json();
      console.log('\n✅ Parsed API Response:', JSON.stringify(responseData, null, 2));

      // Parse the response body if it's a string
      const parsedBody = typeof responseData.body === 'string' 
        ? JSON.parse(responseData.body) 
        : responseData.body;
      
      console.log('\n🔍 Parsed body:', parsedBody);

      // Check for timeout
      const isTimeout = 
        responseData?.message === "Endpoint request timed out" || 
        (responseData?.errorMessage && responseData.errorMessage.toLowerCase().includes('timed out'));

      if (isTimeout) {
        console.log('\n⏳ Request timeout detected');
        throw new Error('Request timed out. Please try again.');
      }

      // Check for API errors
      if (responseData.statusCode === 500 || !parsedBody?.success) {
        console.error('\n❌ API Error:', {
          statusCode: responseData.statusCode,
          success: parsedBody?.success,
          message: parsedBody?.message
        });

        throw new Error(parsedBody?.message || 'API processing failed', {
          cause: {
            statusCode: responseData.statusCode,
            ...parsedBody
          }
        });
      }

      console.log('\n✨ Successfully received AI response');

      const responseText = parsedBody.data?.response || parsedBody.message;

      // Set loading to false before starting typing simulation
      setIsLoading(false);

      // Create a temporary message with an ID
      const messageId = Date.now().toString();
      const aiMessage = {
        id: messageId,
        type: 'ai',
        content: '', // Start empty
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);

      // Simulate typing effect
      await simulateTyping(responseText, messageId);

      // After successful API response
      if (response.ok && !responseData.error && !responseData.errorType && responseData.statusCode !== 500) {
        try {
          // Get current user
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            // Increment query count
            const newCount = await authService.incrementUserQueryCount(currentUser.accountId);
            setQueryCount(newCount);
          }
        } catch (error) {
          console.error('Error updating query count:', error);
        }
      }

    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request cancelled');
        return;
      }
      
      console.error('\n❌ Error in handleSendMessage:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });

      // Add error message to chat with user-friendly message
      const errorMessage = {
        id: Date.now().toString(),
        type: 'error',
        content: getUserFriendlyErrorMessage(error),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
      console.log('\n🏁 Query process completed');
    }
  };

  // Reset scroll state when user starts typing
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    if (isAtBottom()) {
      setAutoScroll(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-40 bg-n-8/95"
      style={{
        top: '5.25rem',
        height: 'calc(100vh - 5.25rem)'
      }}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Background with gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[71.75rem] h-[50rem] opacity-50 mix-blend-color-dodge pointer-events-none">
          <img className="w-full h-full object-cover" src={gradient} alt="Gradient" />
        </div>
      </div>

      {/* Content container */}
      <div className="relative z-1 h-full flex items-center justify-center p-8">
        {/* Dialog panel */}
        <div 
          className="relative bg-n-7 border border-n-6 p-8 rounded-2xl shadow-xl w-full max-w-[600px] md:max-w-[800px] lg:max-w-[1000px] xl:max-w-[1200px] h-full max-h-full flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center gap-4 mb-6 pb-6 border-b border-n-6">
            {/* Left side - Document info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-n-6 flex items-center justify-center p-2">
                <img
                  src={pdfIcon}
                  alt="PDF"
                  className="w-6 h-6 object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold text-n-1 truncate">
                  {docData.title || docData.name}
                </h3>
                <div className="flex items-center gap-x-4 text-xs">
                  <div className="truncate">
                    <span className="text-n-3">Created: </span>
                    <span className="text-n-1">{formatDate(docData.$createdAt || docData.createdAt)}</span>
                  </div>
                  <div className="truncate">
                    <span className="text-n-3">Author: </span>
                    <span className="text-n-1">{docData.author || 'Unknown'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Stats and close button */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="px-2.5 py-1.5 rounded-xl bg-n-6 flex flex-col justify-center h-10">
                <p className="text-xs text-n-3 leading-none">Requests</p>
                <p className="text-sm font-medium text-center text-n-1 mt-1">
                  {queryCount}/{STANDARD_MAX_QUERY_COUNT}
                </p>
              </div>
              
              <Button
                className="button relative inline-flex items-center justify-center w-10 h-10 hover:bg-n-6 rounded-xl transition-colors"
                onClick={onClose}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Button>
            </div>
          </div>

          {/* Chat Container */}
          <div className="flex-1 min-h-0 flex flex-col">
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-n-8 rounded-xl mb-4"
            >
              {messages.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-12 h-12 mb-3 rounded-full bg-n-6 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h4 className="text-base text-n-1 mb-1">Start a Conversation</h4>
                  <p className="text-sm text-n-3">Ask questions about this document</p>
                </div>
              )}
              
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-xl text-sm ${
                      message.type === 'user'
                        ? 'bg-primary-2 text-n-1'
                        : message.type === 'error'
                        ? 'bg-[#ff3333] text-n-1'
                        : 'bg-n-6 text-n-1'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 leading-relaxed">{message.content}</div>
                      {message.type === 'ai' && !isTyping && (
                        <button
                          onClick={() => copyToClipboard(message.content)}
                          className="flex-shrink-0 p-1 hover:bg-n-5 rounded-lg transition-colors mt-0.5"
                          title="Copy to clipboard"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                    <div className="text-[10px] mt-1.5 opacity-60">
                      {formatDate(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading and Typing Indicators */}
              {isLoading ? (
                <div className="flex justify-start">
                  <div className="bg-n-6 text-n-1 p-3 rounded-xl flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-n-3 border-t-primary-1 rounded-full animate-spin"></div>
                  </div>
                </div>
              ) : isTyping && messages.length > 0 && !messages[messages.length - 1].content ? (
                <div className="flex justify-start">
                  <div className="bg-n-6 text-n-1 p-3 rounded-xl">
                    <span className="loading loading-dots loading-sm"></span>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="flex gap-2 p-4 border-t border-n-6">
              <input
                type="text"
                value={inputMessage}
                onChange={handleInputChange}
                placeholder="Ask a question..."
                className="flex-1 h-11 px-4 text-sm rounded-xl bg-n-6 border border-n-5 text-n-1 placeholder-n-3 focus:outline-none focus:border-primary-2"
                disabled={isLoading || isTyping}
              />
              <Button
                type={isLoading || isTyping ? "button" : "submit"}
                onClick={isLoading || isTyping ? handleStop : undefined}
                className="button relative inline-flex items-center justify-center h-11 px-6 rounded-xl transition-colors disabled:opacity-50 text-sm"
                red={isLoading || isTyping}
                disabled={(!isLoading && !isTyping) && !inputMessage.trim()}
              >
                <div className="flex items-center gap-2">
                  <span>{isLoading || isTyping ? 'Stop' : 'Send'}</span>
                  {isLoading || isTyping ? (
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                    </svg>
                  ) : (
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor"
                    >
                      <path 
                        d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewDialog; 