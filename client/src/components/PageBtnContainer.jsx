import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import Wrapper from "../assets/wrappers/PageBtnContainer";
import { useLocation, useNavigate } from "react-router-dom";
import { useAllCandidatesContext } from "../pages/AllCandidates";

const PageBtnContainer = () => {
const {
  data: { numOfPages },
  selectedParams,
} = useAllCandidatesContext();

const currentPage = parseInt(selectedParams.page || "1", 10);

  const { search, pathname } = useLocation();
  const navigate = useNavigate();

  const handlePageChange = (pageNumber) => {
    const searchParams = new URLSearchParams(search);
    searchParams.set("page", pageNumber);
    navigate(`${pathname}?${searchParams.toString()}`);
  };

  const addPageButton = ({ pageNumber, activeClass }) => {
    return (
      <button
        className={`btn page-btn ${activeClass && "active"}`}
        key={pageNumber}
        onClick={() => handlePageChange(pageNumber)}
      >
        {pageNumber}
      </button>
    );
  };

  const renderPageButtons = () => {
  const pageButtons = [];

  const maxPagesToShow = 10;
  const pagesToShowEachSide = Math.floor(maxPagesToShow / 2);

  let start = Math.max(2, currentPage - pagesToShowEachSide);
  let end = Math.min(numOfPages - 1, currentPage + pagesToShowEachSide);

  // Adjust range if near the start or end
  if (currentPage <= pagesToShowEachSide) {
    end = Math.min(numOfPages - 1, maxPagesToShow + 1);
  }
  if (currentPage >= numOfPages - pagesToShowEachSide) {
    start = Math.max(2, numOfPages - maxPagesToShow);
  }

  // Always show first page
  pageButtons.push(
    addPageButton({ pageNumber: 1, activeClass: currentPage === 1 })
  );

  // Left ellipsis
  if (start > 2) {
    pageButtons.push(
      <span className="page-btn dots" key="dots-start">...</span>
    );
  }

  // Page numbers in range
  for (let i = start; i <= end; i++) {
    pageButtons.push(
      addPageButton({ pageNumber: i, activeClass: currentPage === i })
    );
  }

  // Right ellipsis
  if (end < numOfPages - 1) {
    pageButtons.push(
      <span className="page-btn dots" key="dots-end">...</span>
    );
  }

  // Always show last page
  if (numOfPages > 1) {
    pageButtons.push(
      addPageButton({ pageNumber: numOfPages, activeClass: currentPage === numOfPages })
    );
  }

  return pageButtons;
};


  return (
    <Wrapper>
      <button
        className="prev-btn"
        onClick={() => {
          let prevPage = currentPage - 1;
          if (prevPage < 1) prevPage = numOfPages;
          handlePageChange(prevPage);
        }}
      >
        <HiChevronDoubleLeft />
        prev
      </button>
      <div className="btn-container">{renderPageButtons()}</div>
      <button
        className="btn next-btn"
        onClick={() => {
          let nextPage = currentPage + 1;
          if (nextPage > numOfPages) nextPage = 1;
          handlePageChange(nextPage);
        }}
      >
        next
        <HiChevronDoubleRight />
      </button>
    </Wrapper>
  );
};

export default PageBtnContainer;
