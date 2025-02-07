import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
};

const modalVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 }
};

const Modal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = 'Confirm', 
    cancelText = 'Cancel',
    type = 'confirm' // 'confirm', 'error', or 'success'
}) => {
    useEffect(() => {
        console.log('\n🔍 Modal props:', {
            isOpen,
            title,
            message,
            type
        });
    }, [isOpen, title, message, type]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={overlayVariants}
                    className="fixed inset-0 bg-n-8/90 flex items-center justify-center z-50"
                    onClick={onClose}
                >
                    <motion.div
                        variants={modalVariants}
                        className="relative p-8 bg-n-7 rounded-[2rem] max-w-md w-full mx-4"
                        onClick={e => e.stopPropagation()}
                    >
                        <h2 className={`h4 mb-3 ${type === 'error' ? 'text-red-500' : 'text-n-1'}`}>
                            {title}
                        </h2>
                        <p className="body-2 mb-8 text-n-3">
                            {message}
                        </p>
                        <div className="flex justify-end gap-4">
                            {type === 'confirm' ? (
                                <>
                                    <Button
                                        className="button relative inline-flex items-center justify-center h-11 px-7"
                                        variant="primary"
                                        onClick={onClose}
                                    >
                                        {cancelText}
                                    </Button>
                                    <Button
                                        className="button relative inline-flex items-center justify-center h-11 px-7"
                                        red
                                        onClick={onConfirm}
                                    >
                                        {confirmText}
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    className="button relative inline-flex items-center justify-center h-11 px-7"
                                    variant="primary"
                                    onClick={onClose}
                                >
                                    OK
                                </Button>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal; 