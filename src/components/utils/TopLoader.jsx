import PropTypes from "prop-types";
const TopLoader = () => {
  return (
    <div className="fixed left-0 m-0 p-0 -top-[14px] z-50">
      <progress className="progress h-1 progress-warning w-[100vw] m-0 p-0"></progress>
    </div>
  );
};

TopLoader.propTypes = {
  value: PropTypes.number,
};

export default TopLoader;
