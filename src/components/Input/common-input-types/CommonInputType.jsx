import PropTypes from "prop-types";

const CommonInputType = ({
  size = "md",
  type,
  startLabel,
  endLabel,
  errorMsg,
  placeholder,
  inputProps,
  color,
  id,
}) => {
  return (
    <>
      <label htmlFor={id} className="form-control w-full max-w-xs">
        {(startLabel || endLabel) && (
          <div className="label">
            {!!startLabel && <span className="label-text">{startLabel}</span>}
            {!!endLabel && <span className="label-text-alt">{endLabel}</span>}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          className={`input input-bordered w-full max-w-xs ${
            !!errorMsg && "input-error"
          } input-${size} ${color && `input-${color}`}`}
          {...inputProps}
          id="id"
        />
        {!!errorMsg && (
          <div className="label">
            <span className="label-text-alt">{errorMsg}</span>
          </div>
        )}
      </label>
    </>
  );
};

CommonInputType.propTypes = {
  size: PropTypes.string,
  type: PropTypes.string,
  startLabel: PropTypes.string,
  endLabel: PropTypes.string,
  errorMsg: PropTypes.string,
  accessor: PropTypes.string,
  placeholder: PropTypes.string,
  inputProps: PropTypes.object,
  color: PropTypes.string,
  id: PropTypes.string,
};

export default CommonInputType;
