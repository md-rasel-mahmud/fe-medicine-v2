// import moment from "moment";
import TitleCard from "../../Cards/TitleCard";
import PropType from "prop-types";
import TableHeader from "./TableHeader";
import { useMemo } from "react";

const Table = ({
  data = [],
  hasSearchBar,
  hasFilter,
  hasAddButton,
  rounded,
  columns,
  title,
  tableDependency,
  tableHeight,
}) => {
  const tableData = useMemo(
    () => data,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, tableDependency && [...tableDependency]]
  );
  return (
    <TitleCard
      {...{
        title,
        topMargin: "mt-1",
        rounded,
        TopSideButtons: (
          <TableHeader
            {...{
              hasAddButton,
              hasSearchBar,
              hasFilter,
            }}
          />
        ),
      }}
    >
      {/* TABLE CONTAINER */}
      <div
        className={`overflow-auto h-[${tableHeight}vh] rounded-${rounded} w-full border border-base-200`}
      >
        <table className={`table w-full rounded-${rounded} bg-base-100`}>
          <thead className="bg-base-200 sticky top-0 z-10 text-sm">
            <tr>
              {columns.map((theadCol, index) => (
                <th key={index}>
                  {theadCol.component ? (
                    <theadCol.component {...theadCol.theadColProps}>
                      {theadCol.heading}
                    </theadCol.component>
                  ) : (
                    <div {...theadCol.theadColProps}>{theadCol.heading}</div>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {tableData.map((item, index) => {
              return (
                <tr key={index}>
                  {columns.map((tbodyCol, i) => {
                    if (tbodyCol.Cell) {
                      return (
                        <td key={i}>
                          <div {...tbodyCol.tbodyColProps}>
                            {tbodyCol.Cell(item)}
                          </div>
                        </td>
                      );
                    } else {
                      return (
                        <td {...tbodyCol.tbodyColProps} key={i}>
                          {item[tbodyCol.accessor]}
                        </td>
                      );
                    }
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </TitleCard>
  );
};

Table.defaultProps = {
  hasSearchBar: false,
  hasFilter: false,
  hasAddButton: false,
  rounded: "2xl",
  tableDependency: [],
  tableHeight: 75,
};

Table.propTypes = {
  data: PropType.array.isRequired,
  hasSearchBar: PropType.bool,
  columns: PropType.array.isRequired,
  title: PropType.string.isRequired,
  rounded: PropType.string,
  hasFilter: PropType.bool,
  hasAddButton: PropType.bool,
  tableDependency: PropType.array,
  tableHeight: PropType.number,
};

export default Table;
