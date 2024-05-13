import React from 'react';
import ButtonPagination from './ButtonPagination';

const Pagination = ({ currentPage, totalCount, pageSize, onPageChange }) => {
  const pageCount = Math.ceil(totalCount / pageSize);
  const visiblePages = getVisiblePages(currentPage, pageCount);

  return (
    <div className="flex justify-center items-center space-x-3 w-full mb-10">
      <ButtonPagination
        number="&lt;"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        isActive={false}
      />
      {visiblePages.map(page => (
        <ButtonPagination
          key={page.key}
          number={page.value}
          onClick={() => typeof page.value === 'number' ? onPageChange(page.value) : null}
          disabled={typeof page.value !== 'number'}
          isActive={currentPage === page.value}
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
  let key = 0;  // Contador para asignar claves únicas

  if (pageCount === 1) return [{ key: 'page-1', value: 1 }]; // Si solo hay una página

  if (currentPage > 1) pages.push({ key: `page-${currentPage - 1}`, value: currentPage - 1 });
  pages.push({ key: `page-${currentPage}`, value: currentPage });
  if (currentPage < pageCount) pages.push({ key: `page-${currentPage + 1}`, value: currentPage + 1 });

  // Agregar claves únicas a los puntos suspensivos
  if (currentPage - 2 > 1) pages.unshift({ key: `ellipsis-${key++}`, value: '...' });
  if (currentPage + 2 < pageCount) pages.push({ key: `ellipsis-${key++}`, value: '...' });

  if (currentPage > 2) pages.unshift({ key: `page-1`, value: 1 });
  if (currentPage < pageCount - 1) pages.push({ key: `page-${pageCount}`, value: pageCount });

  return pages;
}

export default Pagination;