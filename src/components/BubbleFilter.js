import React from 'react';
import { useTranslation } from 'react-i18next';

const BubbleFilter = ({ label, onRemove }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between bg-gray-800 text-white px-4 py-2 rounded-full border border-gray-400">
      <span>{label}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={t('removeFilter', { label })}
        className="ml-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-mikado-yellow"
      >
        <img
          src="/images/icons/cross.png"
          alt=""
          aria-hidden="true"
          className="w-4 h-4"
        />
      </button>
    </div>
  );
};

export default BubbleFilter;
