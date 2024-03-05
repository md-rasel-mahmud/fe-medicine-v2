import PropTypes from "prop-types";
import Subtitle from "../Typography/Subtitle";
import Flexbox from "../layouts/Flexbox";

const TitleCard = ({
  title,
  children,
  topMargin,
  TopSideButtons,

  rounded,
  bgColor,
}) => {
  return (
    <div
      className={`card w-full p-4 ${bgColor} shadow-xl rounded-${rounded} ${
        topMargin || "mt-6"
      }`}
    >
      {/* Title for Card */}
      <Flexbox alignItems="center" justifyContent="between" gap="2">
        <Subtitle>{title}</Subtitle>

        {/* Top side button, show only if present */}
        {TopSideButtons && <div>{TopSideButtons}</div>}
      </Flexbox>

      <div className="divider mt-1"></div>

      {/** Card Body */}
      <div className={`h-full w-full rounded-${rounded}`}>{children}</div>
    </div>
  );
};

TitleCard.defaultProps = {
  bgColor: "bg-base-100",
  rounded: "2xl",
};

TitleCard.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  topMargin: PropTypes.string,
  TopSideButtons: PropTypes.node,
  rounded: PropTypes.string,
  bgColor: PropTypes.string,
};

export default TitleCard;
