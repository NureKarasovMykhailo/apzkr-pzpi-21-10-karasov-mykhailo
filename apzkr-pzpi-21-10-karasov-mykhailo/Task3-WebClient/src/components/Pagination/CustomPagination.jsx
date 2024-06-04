import React from 'react';
import {Pagination} from "react-bootstrap";
import {getPaginationArray} from "../../utils/getPaginationArray";

const CustomPagination = ({pageCount, currentPage, onClick}) => {
    const pages = getPaginationArray(pageCount);
    const currentPageNumber = parseInt(currentPage);

    return (
        <div className={"w-100 d-flex justify-content-center"}>
            <Pagination>
                {pages.map(page => (
                    <Pagination.Item
                        active={page === currentPageNumber}
                        key={page}
                        onClick={() => onClick(page)}
                    >
                        {page}
                    </Pagination.Item>
                ))}
            </Pagination>
        </div>
    );
};

export default CustomPagination;