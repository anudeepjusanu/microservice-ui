import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const defaultButton = (props) => <button {...props}>{props.children}</button>;

export default class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.changePage = this.changePage.bind(this);
    const TotalPages = props.totalRows / 20;
    this.state = {
      visiblePages: this.getVisiblePages(null, TotalPages),
      TotalPages: props.totalRows / 20,
      startRowCount: 20 * props.page + 1,
      endRowCount:
        props.totalRows < 20 ? props.totalRows : 20 * (props.page + 1),
    };
  }

  static propTypes = {
    pages: PropTypes.number,
    page: PropTypes.number,
    PageButtonComponent: PropTypes.any,
    onPageChange: PropTypes.func,
    previousText: PropTypes.string,
    nextText: PropTypes.string,
    TotalPages: PropTypes.any,
  };

  componentWillReceiveProps(nextProps) {
    const TotalPages = nextProps.totalRows / 20;

    if (this.props.pages !== nextProps.pages) {
      this.setState({
        visiblePages: this.getVisiblePages(null, TotalPages),
        TotalPages: nextProps.totalRows / 20,
      });
    }
    this.setState({
      startRowCount: 20 * nextProps.page + 1,
      endRowCount:
        nextProps.totalRows < 20
          ? nextProps.totalRows
          : 20 * (nextProps.page + 1),
    });
  }

  filterPages = (visiblePages, totalPages) => {
    return visiblePages.filter((page) => page <= totalPages);
  };

  getVisiblePages = (page, total) => {
    if (total < 7) {
      return this.filterPages([1, 2, 3, 4, 5, 6], total);
    } else {
      if (page % 5 >= 0 && page > 4 && page + 2 < total) {
        return [1, page - 1, page, page + 1, total];
      } else if (page % 5 >= 0 && page > 4 && page + 2 >= total) {
        return [1, total - 3, total - 2, total - 1, total];
      } else {
        return [1, 2, 3, 4, 5, total];
      }
    }
  };

  changePage(page) {
    const visiblePages = this.getVisiblePages(page, this.state.TotalPages);
    this.setState({
      visiblePages: this.filterPages(visiblePages, this.state.TotalPages),
    });
    this.props.onPageChange(page);
  }

  render() {
    const { PageButtonComponent = defaultButton } = this.props;
    const { visiblePages } = this.state;
    const activePage = this.props.page + 1;
    return (
      <div className="Table__pagination">
        {this.props.totalRows < 20 ? (
          <div style={{ fontSize: "15px" }}>{this.props.totalRows} records</div>
        ) : (
          <div style={{ fontSize: "15px" }}>
            {this.state.startRowCount} to {this.state.endRowCount} out of{" "}
            {this.props.totalRows} records
          </div>
        )}
        {this.props.totalRows >= 20 && (
          <div className="Table_rightPagination">
           { activePage != 1 && <div className="Table__prevPageWrapper">
              <PageButtonComponent
                className="Table__pageButton"
                onClick={() => {
                  if (activePage === 1) return;
                  this.changePage(this.props.page - 1);
                }}
                disabled={activePage === 1}
              >
                <FontAwesomeIcon className="icon" icon={faArrowLeft} />
               {" "} {this.props.previousText}
            </PageButtonComponent> 
              </div> }
            <div className="Table__visiblePagesWrapper">
              {visiblePages.map((page, index, array) => {
                return (
                  <PageButtonComponent
                    key={page}
                    className={
                      activePage === page
                        ? "Table__pageButton Table__pageButton--active"
                        : "Table__pageButton"
                    }
                    onClick={() => this.changePage(page - 1)}
                  >
                    {array[index - 1] + 2 < page ? `...` : page}
                  </PageButtonComponent>
                );
              })}
            </div>
            <div className="Table__nextPageWrapper">
              <PageButtonComponent
                className="Table__pageButton"
                onClick={() => this.changePage(this.props.page + 1)}
                disabled={
                  activePage === this.state.TotalPages ||
                  this.state.TotalPages == 0
                }
              >
                {this.props.nextText}{"  "}
                <FontAwesomeIcon className="icon" icon={faArrowRight} />
              </PageButtonComponent>
            </div>
          </div>
        )}
      </div>
    );
  }
}
