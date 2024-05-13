import React from 'react';

const BubbleFilter = ({ label, onRemove }) => {
    return (
        <div className="flex items-center justify-between bg-gray-800 text-white px-4 py-2 rounded-full border border-gray-400">
            <span>{label}</span>
            <button onClick={onRemove} className="ml-2">
                <img src="/images/icons/cross.png" alt="Remove" className="w-4 h-4" />
            </button>
        </div>
    );
};

export default BubbleFilter;