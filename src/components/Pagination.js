import React from 'react';
import ButtonPagination from './ButtonPagination';

const Pagination = ({ currentPage, totalCount, pageSize, onPageChange }) => {
  const pageCount = Math.ceil(totalCount / pageSize);
  const visiblePages = getVisiblePages(currentPage, pageCount);

  return (
    <div className="flex justify-center items-center space-x-6 w-full mb-10">
      <ButtonPagination
        number="&lt;"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        isActive={false}
      />
      {visiblePages.map(page => (
        <ButtonPagination
          key={page}
          number={page}
          onClick={() => typeof page === 'number' ? onPageChange(page) : null}
          disabled={typeof page !== 'number'}
          isActive={currentPage === page}
        />
      ))}
      <ButtonPagination
        number="&gt;"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === pageCount}
        isActive={false}
      />
    </div>
  );
};

function getVisiblePages(currentPage, pageCount) {
  let pages = [];
  pages.push(currentPage);
  if (currentPage > 1) pages.unshift(currentPage - 1);
  if (currentPage < pageCount) pages.push(currentPage + 1);

  if (currentPage - 1 > 1) pages.unshift('...');
  if (currentPage + 1 < pageCount) pages.push('...');

  if (pages[0] !== 1) pages.unshift(1);
  if (pages[pages.length - 1] !== pageCount) pages.push(pageCount);

  return pages;
}

export default Pagination;