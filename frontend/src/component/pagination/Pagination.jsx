import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, limit, setLimit }) => {
    const getPages = () => {
        const pages = [1];
        const startPage = Math.max(2, currentPage - 2);
        const endPage = Math.min(totalPages - 1, currentPage + 2);

        if (currentPage > 3) {
            pages.push(1);
        }

        if (currentPage > 4) {
            pages.push('...');
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - 3) {
            pages.push('...');
        }

        if (currentPage < totalPages - 2) {
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <nav className='flex items-center justify-end py-4'>
            <ul className="inline-flex space-x-2 text-sm">
                {/* <li>
                    <button
                        onClick={() => onPageChange(1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 text-ms dark:bg-gray-700 dark:text-white"
                    >
                        &laquo;
                    </button>
                </li> */}
                <li>
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-2 py-2 border border-gray-300 cursor-pointer text-md dark:bg-gray-700 dark:text-white hover:bg-gray-100"
                    >
                        ត្រលប់
                    </button>
                </li>
                {getPages().map((page, index) => (
                    <li key={index}>
                        {page === '...' ? (
                            <li className="px-2 py-2 text-md dark:bg-gray-700 dark:text-white">...</li>
                        ) : (
                            <button
                                onClick={() => onPageChange(page)}
                                className={`px-4 py-2  text-sm  dark:bg-gray-700 dark:text-white ${currentPage === page ? 'bg-blue-500 text-white' : ''}`}
                            >
                                {page}
                            </button>

                        )}
                    </li>
                ))}
                <li>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-2 py-2 border border-gray-300 cursor-pointer text-md dark:bg-gray-700 dark:text-white hover:bg-gray-100"
                    >
                        បន្ទាប់
                    </button>
                </li>
                {/* <li>
                    <button
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 text- dark:bg-gray-700 dark:text-white"
                    >
                        &raquo;
                    </button>
                </li> */}
            </ul>

        </nav>
    );
};

export default Pagination;


