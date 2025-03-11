// components/ui/modal.js
import React from 'react';
import { Button } from './button'; // Assuming you have a Button component
import TagSelector from '../../app/updateUserProfile/components/TagSelector'; // Import the TagSelector

const Modal = ({ isOpen, onClose, children, title, onTagsSelected,style  }) => {
    if (!isOpen) return null; // If modal is not open, render nothing

    return (
        <div className="fixed  inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50" style={style}>
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold text-gray-800">
                        {title || 'Modal Title'}  {/* Default to 'Modal Title' if no title is passed */}
                    </h3>
                    <Button
                        onClick={onClose}
                        variant="link"
                        className="text-gray-600 hover:text-gray-900 text-lg"
                    >
                        ✕
                    </Button>
                </div>
                <div className="space-y-6">
                    {children}
                    
                </div>
                
            </div>
        </div>
    );
};

export default Modal;
