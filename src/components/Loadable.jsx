import { Suspense } from "react";
import TopLoader from "./utils/TopLoader";

const Loadable = (Component) => {
  const LoadableComponent = (props) => (
    <Suspense fallback={<TopLoader />}>
      <Component {...props} />
    </Suspense>
  );

  LoadableComponent.displayName = `Loadable(${
    Component.displayName || Component.name || "Component"
  })`;

  return LoadableComponent;
};

export default Loadable;
