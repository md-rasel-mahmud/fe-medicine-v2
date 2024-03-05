// import SearchBar from "../../Input/SearchBar";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import FunnelIcon from "@heroicons/react/24/outline/FunnelIcon";
import PropTypes from "prop-types";
import Flexbox from "../../layouts/Flexbox";
import { useSearchParams } from "react-router-dom";
import CommonInputType from "../../Input/common-input-types/CommonInputType";

const TableHeader = ({ hasAddButton, hasSearchBar, hasFilter }) => {
  const [queryParams] = useSearchParams();
  const filterParam = queryParams.get("filter");
  return (
    <Flexbox alignItems="center" justifyContent="center">
      {/* <SearchBar
        searchText={searchText}
        styleClass="mr-4"
        setSearchText={setSearchText}
      />
      {filterParam != "" && (
        <button
          onClick={() => removeAppliedFilter()}
          className="btn btn-xs mr-2 btn-active btn-ghost normal-case"
        >
          {filterParam}
          <XMarkIcon className="w-4 ml-2" />
        </button>
      )}
      <div className="dropdown dropdown-bottom dropdown-end">
        <label tabIndex={0} className="btn btn-sm btn-outline">
          <FunnelIcon className="w-5 mr-2" />
          Filter
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52"
        >
          {locationFilters.map((l, k) => {
            return (
              <li key={k}>
                <a onClick={() => showFiltersAndApply(l)}>{l}</a>
              </li>
            );
          })}
          <div className="divider mt-0 mb-0"></div>
          <li>
            <a onClick={() => removeAppliedFilter()}>Remove Filter</a>
          </li>
        </ul>
      </div> */}
      {hasAddButton && <button className="btn btn-sm btn-primary">Add</button>}

      {hasSearchBar && (
        <CommonInputType
          {...{
            startLabel: "",
            size: "sm",
            type: "search",
            placeholder: "Search",
            inputProps: {
              id: "search",
              name: "search",
            },
          }}
        />
      )}
      {hasFilter && filterParam != "" && (
        <button
          onClick={() => {
            console.log({ filterParam });
          }}
          className="btn btn-xs mr-2 btn-active btn-ghost normal-case"
        >
          {filterParam}
          <FunnelIcon className="w-4 ml-2" />

          {/* <XMarkIcon className="w-4 ml-2" /> */}
        </button>
      )}
    </Flexbox>
  );
};

TableHeader.defaultProps = {
  hasAddButton: false,
  hasSearchBar: false,
  hasFilter: false,
};

TableHeader.propTypes = {
  hasAddButton: PropTypes.bool,
  hasSearchBar: PropTypes.bool,
  hasFilter: PropTypes.bool,
};

export default TableHeader;
