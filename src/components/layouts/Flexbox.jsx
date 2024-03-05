import PropTypes from "prop-types";

/**
 * @description
 * Flexbox is a layout component that allows you to create a flexbox layout.
 * It accepts children, className, justifyContent, alignItems, flexDirection as props.
 * It has default values for className, justifyContent, alignItems, flexDirection.
 * It returns a div with the children and the className.
 * @param {node} children - The content to be displayed.
 * @param {string} className - The class name to be added to the div.
 * @param {string} justifyContent - The value for the justify-content property.
 * @param {string} alignItems - The value for the align-items property.
 * @param {string} flexDirection - The value for the flex-direction property.
 * @returns {JSX} A div with the children and the className.
 * @example
 * <Flexbox justifyContent="center" alignItems="center" flexDirection="column">
 *  <div>Content 1</div>
 *  <div>Content 2</div>
 * </Flexbox>
 * **/

const Flexbox = ({
  children,
  className,
  justifyContent,
  alignItems,
  flexDirection,
  gap,
}) => {
  return (
    <div
      className={`flex 
        justify-${justifyContent}
        items-${alignItems}
        flex-direction-${flexDirection}
        gap-${gap}   
      ${className}`}
    >
      {children}
    </div>
  );
};

Flexbox.defaultProps = {
  className: "",
  justifyContent: "start",
  alignItems: "center",
  flexDirection: "row",
  gap: "2",
};

Flexbox.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  justifyContent: PropTypes.oneOf([
    "start",
    "end",
    "center",
    "between",
    "around",
    "evenly",
  ]),
  alignItems: PropTypes.oneOf([
    "start",
    "end",
    "center",
    "stretch",
    "baseline",
  ]),
  flexDirection: PropTypes.oneOf([
    "row",
    "row-reverse",
    "column",
    "column-reverse",
  ]),
  gap: PropTypes.string,
};

export default Flexbox;
