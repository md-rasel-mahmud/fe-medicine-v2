import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import FaceFrownIcon from "@heroicons/react/24/solid/FaceFrownIcon";
import { useRouteError } from "react-router-dom";

function InternalPage() {
  const dispatch = useDispatch();
  const data = useRouteError();
  console.log({ data });

  useEffect(() => {
    dispatch(setPageTitle({ title: "" }));
  }, []);

  return (
    <div className="hero h-4/5 bg-base-200 min-h-[100vh]">
      <div className="hero-content text-error text-center">
        <div className="max-w-md flex flex-col items-center gap-3">
          <FaceFrownIcon className="h-48 w-48 inline-block" />
          {/* <h1 className="text-5xl font-bold">404 - Not Found</h1> */}
          <h1 className="text-5xl font-bold">
            {data.status || data.statusText
              ? `${data.status} ${data.statusText}`
              : "Compiler Error"}
          </h1>
          <p className="text-sm ">{data.stack || data.data}</p>
        </div>
      </div>
    </div>
  );
}

export default InternalPage;
