import React from 'react';
import { useTranslation } from 'react-i18next';
import ButtonPagination from './ButtonPagination';

const Pagination = ({ currentPage, totalCount, pageSize, onPageChange }) => {
  const { t } = useTranslation();
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));
  const visiblePages = getVisiblePages(currentPage, pageCount);

  return (
    <nav
      aria-label={t('paginationLabel')}
      className="flex justify-center items-center space-x-3 w-full mb-10"
    >
      <ButtonPagination
        number="<"
        ariaLabel={t('previousPage')}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        isActive={false}
      />
      {visiblePages.map((page) =>
        typeof page.value === 'number' ? (
          <ButtonPagination
            key={page.key}
            number={page.value}
            ariaLabel={t('pageLabel', { page: page.value })}
            onClick={() => onPageChange(page.value)}
            disabled={false}
            isActive={currentPage === page.value}
          />
        ) : (
          <span key={page.key} aria-hidden="true" className="text-white">
            …
          </span>
        ),
      )}
      <ButtonPagination
        number=">"
        ariaLabel={t('nextPage')}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === pageCount}
        isActive={false}
      />
    </nav>
  );
};

function getVisiblePages(currentPage, pageCount) {
  const pages = [];
  let key = 0;

  if (pageCount === 1) return [{ key: 'page-1', value: 1 }];

  if (currentPage > 1) {
    pages.push({ key: `page-${currentPage - 1}`, value: currentPage - 1 });
  }
  pages.push({ key: `page-${currentPage}`, value: currentPage });
  if (currentPage < pageCount) {
    pages.push({ key: `page-${currentPage + 1}`, value: currentPage + 1 });
  }

  if (currentPage - 2 > 1) {
    pages.unshift({ key: `ellipsis-${key++}`, value: '...' });
  }
  if (currentPage + 2 < pageCount) {
    pages.push({ key: `ellipsis-${key++}`, value: '...' });
  }

  if (currentPage > 2) pages.unshift({ key: 'page-1', value: 1 });
  if (currentPage < pageCount - 1) {
    pages.push({ key: `page-${pageCount}`, value: pageCount });
  }

  return pages;
}

export default Pagination;
