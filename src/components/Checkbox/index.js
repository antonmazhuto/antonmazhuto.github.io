import React from "react";

import "./index.styl";

export const Checkbox = ({htmlId, className, readonly,onChange,...restProps}) => {
    return (
        <span className="Checkbox">
            <input
                readOnly={readonly}
                id={htmlId}
                type="checkbox"
                className="Checkbox-control"
                onChange={onChange}
                {...restProps}
            />
            <label htmlFor={htmlId} className="Checkbox-label" />
        </span>
    )
};

export default Checkbox;
