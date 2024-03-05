import PropTypes from "prop-types";

const Subtitle = ({ styleClass, children }) => {
  return (
    <div className={`text-xl font-semibold ${styleClass}`}>{children}</div>
  );
};

Subtitle.propTypes = {
  styleClass: PropTypes.string,
  children: PropTypes.node,
};

export default Subtitle;
