import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Section from "./Section";
import { gradient } from "../assets";
import Button from "./Button";
import { useSession } from '../context/SessionContext';
import authService from "../lib/appwrite";
import LoadingScreen from './LoadingScreen';
import Modal from './Modal';
import config from '../config/config';

const Upload = () => {
  const navigate = useNavigate();
  const { user, isLoading: isSessionLoading } = useSession();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState('file'); // 'file' or 'url'
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [documentTitle, setDocumentTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const fileInputRef = useRef(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [documentCount, setDocumentCount] = useState(0);
  const [isCountLoading, setIsCountLoading] = useState(true);
  const STANDARD_MAX_DOC_COUNT = config.standardMaxDocCount;

  const fetchDocumentCount = async () => {
    setIsCountLoading(true);
    try {
      if (user) {
        const count = await authService.getUserDocumentCount(user.userDocId);
        setDocumentCount(count);
        console.log('Current document count:', count, 'Max allowed:', STANDARD_MAX_DOC_COUNT);
      }
    } catch (error) {
      console.error('Error fetching document count:', error);
    } finally {
      setIsCountLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentCount();
  }, [user]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      setErrorMessage('Please select a valid PDF file.');
      setShowErrorModal(true);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/dashboard');
  };

  const validatePdfUrl = (url) => {
    try {
      // First check if it's a valid URL
      new URL(url);
      
      // Check if URL ends with .pdf OR contains /pdf/ in the path
      return url.toLowerCase().endsWith('.pdf') || url.toLowerCase().includes('/pdf/');
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    await fetchDocumentCount();

    if (documentCount >= STANDARD_MAX_DOC_COUNT) {
      const message = documentCount === STANDARD_MAX_DOC_COUNT 
        ? `You have reached the maximum limit of ${STANDARD_MAX_DOC_COUNT} document${STANDARD_MAX_DOC_COUNT === 1 ? '' : 's'} for regular users.`
        : `You currently have ${documentCount} document${documentCount === 1 ? '' : 's'}, which exceeds the limit of ${STANDARD_MAX_DOC_COUNT} for regular users.`;

      setErrorMessage(
        `${message} Please upgrade your account to upload more documents and unlock additional features.`
      );
      setShowErrorModal(true);
      return;
    }

    setIsUploading(true);

    if (uploadType === 'file' && !selectedFile) {
      fileInputRef.current?.click();
      return;
    }

    if (uploadType === 'url' && !validatePdfUrl(fileUrl)) {
      setErrorMessage('Please enter a valid PDF URL');
      setShowErrorModal(true);
      return;
    }

    if (!documentTitle.trim()) {
      setErrorMessage('Please enter a document title');
      setShowErrorModal(true);
      return;
    }

    try {
      if (uploadType === 'url') {
        console.log('\n🔄 Fetching PDF from URL:', fileUrl);
        try {
          const response = await fetch(fileUrl);
          if (!response.ok) {
            throw new Error('Failed to fetch file from URL');
          }
          
          // Check content type
          const contentType = response.headers.get('content-type');
          if (!contentType?.includes('application/pdf')) {
            throw new Error('URL does not point to a valid PDF file');
          }

          const blob = await response.blob();
          const fileName = documentTitle.trim() + '.pdf';
          const file = new File([blob], fileName, { type: 'application/pdf' });
          
          console.log('\n📄 Created file from URL:', fileName);

          const uploadResponse = await authService.uploadDocument(file, user.userDocId, {
            title: documentTitle.trim(),
            author: author.trim(),
            description: description.trim()
          });

          console.log('\n✅ Upload Response:', uploadResponse);

          // Check for timeout response
          if (uploadResponse?.message === "Endpoint request timed out" || uploadResponse?.success) {
            await fetchDocumentCount(); // Refresh count after successful upload
            const remainingSlots = STANDARD_MAX_DOC_COUNT - (documentCount + 1);
            const successMessage = remainingSlots > 0
              ? `Your document has been successfully uploaded. You can upload ${remainingSlots} more document${remainingSlots === 1 ? '' : 's'}.`
              : 'Your document has been successfully uploaded. You have now reached your document limit.';
            
            setShowSuccessModal(true);
            setUploadedFileName(fileName);
            return;
          }

          throw new Error('Upload failed');
        } catch (error) {
          throw error;
        }
      } else {
        const uploadResponse = await authService.uploadDocument(selectedFile, user.userDocId, {
          title: documentTitle.trim(),
          author: author.trim(),
          description: description.trim()
        });

        console.log('\n✅ Upload Response:', uploadResponse);

        // Check for timeout response
        if (uploadResponse?.message === "Endpoint request timed out" || uploadResponse?.success) {
          await fetchDocumentCount(); // Refresh count after successful upload
          const remainingSlots = STANDARD_MAX_DOC_COUNT - (documentCount + 1);
          const successMessage = remainingSlots > 0
            ? `Your document has been successfully uploaded. You can upload ${remainingSlots} more document${remainingSlots === 1 ? '' : 's'}.`
            : 'Your document has been successfully uploaded. You have now reached your document limit.';
          
          setShowSuccessModal(true);
          setUploadedFileName(selectedFile.name);
          return;
        }

        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('❌ Error uploading document:', error);
      setShowErrorModal(true);
      setErrorMessage('We were unable to upload your document at this time.');
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (isSessionLoading || isUploading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="container relative">
          <div className="relative z-1 max-w-[62rem] mx-auto text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-[80px] h-[80px] border-4 border-n-1/10 border-t-color-1 rounded-full animate-spin mb-6"></div>
              <p className="h4 text-n-1/50">Loading...</p>
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
      </div>
    );
  }

  return (
    <Section className="pt-[12rem] -mt-[5.25rem]" crosses>
      <div className="container relative">
        {/* Background gradient */}
        <div className="absolute top-0 -left-[10rem] w-[56.625rem] h-[56.625rem] opacity-50 mix-blend-color-dodge pointer-events-none">
          <img
            className="absolute top-1/2 left-1/2 w-[79.5625rem] h-[88.5625rem] -translate-x-1/2 -translate-y-1/2"
            src={gradient}
            alt="Gradient"
          />
        </div>

        {/* Header Section */}
        <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-12">
          <h1 className="h1 mb-6">
            Upload Document
          </h1>
          <p className="body-1 max-w-3xl mx-auto text-n-2">
            Upload your PDF document to start analyzing
          </p>
        </div>

        {/* Main Content */}
        <div className="relative z-1 max-w-[40rem] mx-auto">
          <div className="bg-n-8 border border-n-6 rounded-2xl overflow-hidden p-8">
            {/* Document Counter */}
            <div className="flex justify-center mb-8">
              <div className="px-4 py-2 rounded-xl bg-n-6">
                <p className="text-sm text-n-3">
                  Documents: <span className="text-n-1">{documentCount}/{STANDARD_MAX_DOC_COUNT}</span>
                </p>
              </div>
            </div>

            {/* Upload Type Toggle */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-n-6 rounded-lg p-1">
                <button
                  className={`px-4 py-2 rounded-md transition-colors ${
                    uploadType === 'file' ? 'bg-n-5 text-n-1' : 'text-n-3'
                  }`}
                  onClick={() => setUploadType('file')}
                >
                  Local File
                </button>
                <button
                  className={`px-4 py-2 rounded-md transition-colors ${
                    uploadType === 'url' ? 'bg-n-5 text-n-1' : 'text-n-3'
                  }`}
                  onClick={() => setUploadType('url')}
                >
                  URL Link
                </button>
              </div>
            </div>

            {/* Upload Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Document Title */}
              <div>
                <label className="block mb-2 text-n-1">
                  Document Title <span className="text-color-1">*</span>
                </label>
                <input
                  type="text"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  className="w-full h-12 px-4 bg-n-6 rounded-lg border border-n-6 focus:border-n-5 outline-none transition-colors"
                  placeholder="Enter document title"
                  required
                />
              </div>

              {/* Author */}
              <div>
                <label className="block mb-2 text-n-1">Author</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full h-12 px-4 bg-n-6 rounded-lg border border-n-6 focus:border-n-5 outline-none transition-colors"
                  placeholder="Enter author name"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block mb-2 text-n-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-32 px-4 py-3 bg-n-6 rounded-lg border border-n-6 focus:border-n-5 outline-none transition-colors resize-none"
                  placeholder="Enter document description"
                />
              </div>

              {/* File Upload or URL Input */}
              <div>
                <label className="block mb-2 text-n-1">
                  {uploadType === 'url' ? 'PDF URL' : 'PDF File'} <span className="text-color-1">*</span>
                </label>
                
                {uploadType === 'url' ? (
                  <input
                    type="url"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    className="w-full h-12 px-4 bg-n-6 rounded-lg border border-n-6 focus:border-n-5 outline-none transition-colors"
                    placeholder="Enter PDF URL"
                    required
                  />
                ) : (
                  <div className="flex items-center gap-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf"
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex-1 h-12 px-4 bg-n-6 rounded-lg border border-n-6 hover:border-n-5 cursor-pointer transition-colors flex items-center"
                    >
                      {selectedFile ? selectedFile.name : 'Choose PDF file'}
                    </label>
                    {selectedFile && (
                      <Button
                        className="h-12 px-4"
                        onClick={() => {
                          setSelectedFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                )}
              </div>

              <Button className="w-full h-12" type="submit" disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Upload Document'}
              </Button>
            </form>
          </div>
        </div>

        {/* Modals */}
        <Modal
          isOpen={showSuccessModal}
          onClose={handleSuccessModalClose}
          title="Upload Successful"
          message={`Your document has been successfully uploaded${
            documentCount < STANDARD_MAX_DOC_COUNT 
              ? `. You can upload ${STANDARD_MAX_DOC_COUNT - documentCount} more document${STANDARD_MAX_DOC_COUNT - documentCount === 1 ? '' : 's'}.`
              : ' and you have now reached your document limit.'
          }`}
          type="success"
        />

        <Modal
          isOpen={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          title={documentCount >= STANDARD_MAX_DOC_COUNT ? "Document Limit Reached" : "Upload Failed"}
          message={errorMessage}
          type="error"
        />
      </div>
    </Section>
  );
};

export default Upload; 