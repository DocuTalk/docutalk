import { useEffect } from 'react';
import Button from './Button';
import { createPortal } from 'react-dom';
import { enablePageScroll, disablePageScroll } from 'scroll-lock';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  useEffect(() => {
    if (isOpen) {
      disablePageScroll();
    }
    return () => {
      enablePageScroll();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Dialog panel */}
        <div 
          className="relative bg-n-7 border border-n-6 p-8 rounded-2xl shadow-xl w-full max-w-[400px]"
          onClick={(e) => e.stopPropagation()}
          style={{ position: 'relative', zIndex: 10000 }}
        >
          <div className="flex flex-col">
            <h3 className="h4 mb-3 text-n-1">
              {title}
            </h3>
            <p className="body-2 mb-8 text-n-3">
              {message}
            </p>
            
            <div className="flex justify-end gap-4">
              <Button
                className="button relative inline-flex items-center justify-center h-11 px-7"
                variant="primary"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                className="button relative inline-flex items-center justify-center h-11 px-7"
                red
                onClick={onConfirm}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmDialog; 