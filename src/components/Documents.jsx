import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Section from "./Section";
import Button from "./Button";
import { gradient } from "../assets";
import authService from "../lib/appwrite";
import { useSession } from '../context/SessionContext';
import LoadingScreen from './LoadingScreen';
import DocumentCard from './DocumentCard';
import DocumentPreviewDialog from './DocumentPreviewDialog';
import ConfirmDialog from './ConfirmDialog';
import { enablePageScroll, disablePageScroll } from 'scroll-lock';
import Modal from './Modal';

const Documents = () => {
  const navigate = useNavigate();
  const { user, isLoading: isSessionLoading, checkSession } = useSession();
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [deletedDocument, setDeletedDocument] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUploadErrorModal, setShowUploadErrorModal] = useState(false);
  const [uploadErrorMessage, setUploadErrorMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadDocuments = async () => {
      if (!user?.userDocId) return;
      
      try {
        setIsLoading(true);
        const docs = await authService.getUserDocuments(user.userDocId);
        if (mounted) {
          setDocuments(docs);
        }
      } catch (error) {
        console.error('Error loading documents:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadDocuments();

    return () => {
      mounted = false;
    };
  }, [user?.userDocId]); // Only depend on userDocId

  // Handle scroll locking when any dialog is shown/hidden
  useEffect(() => {
    if (showPreview || showSignOutDialog) {
      disablePageScroll();
    } else {
      enablePageScroll();
    }
  }, [showPreview, showSignOutDialog]);

  const handleDelete = async (documentId) => {
    setDeletingId(documentId);
    try {
      // Find the document before deleting it
      const docToDelete = documents.find(doc => doc.$id === documentId);
      
      await authService.deleteDocument(documentId);
      setDocuments(prev => prev.filter(doc => doc.$id !== documentId));
      
      // Set the deleted document and show success modal
      if (docToDelete) {
        setDeletedDocument(docToDelete);
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('❌ Error deleting document:', error);
      setErrorMessage('We were unable to delete your document at this time.');
      setShowErrorModal(true);
    } finally {
      setDeletingId(null);
    }
  };

  const handlePreview = (doc) => {
    setSelectedDocument(doc);
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const handleOpenSignOutDialog = () => {
    setShowSignOutDialog(true);
  };

  const handleCloseSignOutDialog = () => {
    setShowSignOutDialog(false);
  };

  const handleSignOut = async () => {
    try {
      await authService.logout();
      await checkSession();
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setShowSignOutDialog(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await handleDelete(deletingId);
      setShowDeleteModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('❌ Error confirming delete:', error);
      setShowErrorModal(true);
    }
  };

  if (isSessionLoading || isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Section 
        className="pt-[12rem] -mt-[5.25rem]"
        crosses
        crossesOffset="lg:translate-y-[5.25rem]"
      >
        <div className="container relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[71.75rem] h-[50rem] opacity-50 mix-blend-color-dodge pointer-events-none">
            <img
              className="w-full h-full object-cover"
              src={gradient}
              alt="Gradient"
            />
          </div>

          <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[4rem]">
            <h1 className="h1 mb-6">
              Your Documents
            </h1>
            <p className="body-1 max-w-3xl mx-auto text-n-2">
              View and manage your analyzed documents
            </p>
          </div>

          <div className="relative z-1 max-w-[90rem] mx-auto">
            {documents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map((doc) => (
                  <DocumentCard
                    key={doc.$id}
                    document={doc}
                    onDelete={handleDelete}
                    isDeleting={deletingId === doc.$id}
                    onPreview={() => handlePreview(doc)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-n-3 mb-4">No documents yet. Start by uploading one!</p>
                <Button onClick={() => navigate('/upload')}>
                  Upload New Document
                </Button>
              </div>
            )}
          </div>

          {selectedDocument && (
            <DocumentPreviewDialog
              isOpen={showPreview}
              onClose={handleClosePreview}
              document={selectedDocument}
            />
          )}
        </div>
      </Section>

      <ConfirmDialog
        isOpen={showSignOutDialog}
        onClose={handleCloseSignOutDialog}
        onConfirm={handleSignOut}
        title="Sign Out Confirmation"
        message="You're about to sign out of DocuTalk. You'll need to sign in again to access your documents and continue your conversations."
      />

      <Modal
        isOpen={showSuccessModal && !!deletedDocument}
        onClose={() => {
          setShowSuccessModal(false);
          setDeletedDocument(null);
        }}
        title="Document Deleted"
        message={deletedDocument ? `"${deletedDocument.title}" has been successfully deleted from your documents.` : ''}
        type="success"
      />

      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Unable to Delete Document"
        message="We couldn't delete this document at this time. Please try again later or contact support if the problem persists."
        type="error"
      />

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Document"
        message={`Are you sure you want to delete "${selectedDocument?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Keep"
        type="confirm"
      />

      <Modal
        isOpen={showUploadErrorModal}
        onClose={() => setShowUploadErrorModal(false)}
        title="Upload Failed"
        message="We couldn't upload your document at this time. Please check your file and try again, or contact support if you need help."
        type="error"
      />
    </>
  );
};

export default Documents; 