import { useNavigate } from "react-router-dom";
import { memo, useState, useEffect } from 'react';
import Button from "./Button";
import { pdfIcon } from "../assets";  // Import directly from assets
import Modal from './Modal';

const DocumentCard = memo(({ document, onDelete, isDeleting, disabled, onPreview }) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  
  const documentName = document.name || document.title || 'Untitled Document';
  const documentDate = document.$createdAt || document.createdAt;

  const handleDelete = async () => {
    console.log('\n🔄 Starting delete confirmation flow for:', documentName);
    setShowDeleteModal(false);
    try {
        console.log('\n📤 Calling onDelete function');
        await onDelete(document.$id);
    } catch (error) {
        console.error('\n❌ Error in handleDelete:', error);
    }
  };

  const handleClick = () => {
    if (!disabled && !isDeleting) {
      onPreview();
    }
  };

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

  // Add log to Modal state changes
  useEffect(() => {
    console.log('\n📊 Modal states:', {
        showDeleteModal,
        showSuccessModal
    });
  }, [showDeleteModal, showSuccessModal]);

  // Don't render anything if the document is deleted
  if (isDeleted && !showSuccessModal) {
    return null;
  }

  return (
    <>
      <div 
        className={`relative p-6 rounded-2xl bg-n-8 border border-n-6 transition-all duration-200 
          ${disabled ? 'opacity-50' : 'hover:border-n-5'} 
          ${isDeleting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={(e) => {
          // Only trigger click if not disabled and not deleting
          if (!disabled && !isDeleting) {
            handleClick();
          }
        }}
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-n-7 flex items-center justify-center">
              <img
                src={pdfIcon}
                alt="PDF"
                className="w-8 h-8"
              />
            </div>
            <div>
              <h3 className="font-bold text-n-1 mb-1">{documentName}</h3>
              <p className="text-sm text-n-3">{formatDate(documentDate)}</p>
            </div>
          </div>
          
          <Button
            className={`p-2 hover:bg-n-7 rounded-lg transition-colors ${isDeleting || disabled ? 'cursor-not-allowed' : ''}`}
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click when clicking delete button
              setShowDeleteModal(true);
            }}
            disabled={isDeleting || disabled}
          >
            {isDeleting ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" />
              </svg>
            )}
          </Button>
        </div>

        <div 
          className="w-full h-40 rounded-lg bg-n-6/50 overflow-hidden flex items-center justify-center hover:bg-n-6 transition-colors"
        >
          {document.thumbnail ? (
            <div className="w-full h-full flex items-center justify-center bg-n-7">
              <img
                src={document.thumbnail}
                alt={documentName}
                className="w-auto h-auto max-w-[80%] max-h-[80%] object-contain"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-n-3">
              No Preview
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete "${documentName}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        type="confirm"
      />

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          setIsDeleted(false);
        }}
        title="Success"
        message={`"${documentName}" has been successfully deleted.`}
        type="success"
      />
    </>
  );
});

DocumentCard.displayName = 'DocumentCard';

export default DocumentCard;