import Table from "./Table";
import { RECENT_TRANSACTIONS } from "../../../utils/dummyData";
import moment from "moment";

const RenderedTable = () => {
  const data = RECENT_TRANSACTIONS;
  const columns = [
    {
      accessor: "name",
      heading: "Name",
      Cell: (item) => (
        <div className="flex items-center space-x-3">
          <div className="avatar">
            <div className="mask mask-circle w-12 h-12">
              <img src={item.avatar} alt="Avatar" />
            </div>
          </div>
          <div>
            <div className="font-bold">{item.name}</div>
          </div>
        </div>
      ),
    },

    {
      accessor: "email",
      heading: "Email",
    },
    {
      accessor: "email",
      heading: "Email",
    },
    {
      accessor: "email",
      heading: "Email",
    },
    {
      accessor: "email",
      heading: "Email",
    },
    {
      accessor: "email",
      heading: "Email",
    },
    {
      accessor: "email",
      heading: "Email",
    },
    {
      accessor: "email",
      heading: "Email",
    },
    {
      accessor: "location",
      heading: "Location",
    },
    {
      accessor: "amount",
      heading: "Amount",
    },
    {
      heading: "Date",
      accessor: "date",
      component: "h2",
      theadColProps: {
        className: "w-24",
      },
      Cell: (item) => moment(item.date).format("D MMM"),
    },
  ];

  return (
    <div className="m-2">
      <Table
        {...{
          data,
          hasAddButton: true,
          hasFilter: true,
          hasSearchBar: true,
          title: "Rendered Table",
          columns,
          rounded: "2xl",
        }}
      />
    </div>
  );
};

export default RenderedTable;
