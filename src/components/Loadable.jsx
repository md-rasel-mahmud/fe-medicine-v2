import { Suspense } from "react";
import TopLoader from "./utils/TopLoader";

const Loadable = (Component) => {
  const LoadableComponent = (props) => {
    return (
      <Suspense fallback={<TopLoader />}>
        <Component {...props} />
      </Suspense>
    );
  };

  return LoadableComponent;
};

export default Loadable;
