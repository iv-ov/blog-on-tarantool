import React from 'react';

function Pagination({page, setPage, totalPages}) {
    return (
        <nav>
            <button
                className="btn btn-secondary btn-sm"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
            >
                &lt;
            </button>
            <span className="alert alert-light">{page} of {totalPages}</span>
            <button
                className="btn btn-secondary btn-sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
            >
                &gt;
            </button>
        </nav>
    );
}

export default Pagination;
