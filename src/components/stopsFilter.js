import React, {Fragment} from 'react'
import {numberText} from "../helpers";
import Checkbox from "./Checkbox";

class StopsFilter extends React.Component {

    shouldComponentUpdate(nextProps) {
        if (nextProps) return true
    }

    showOnly = (stop) => {
        const { onChangeStops } = this.props;

        onChangeStops(stop, true);
    };

    render() {
        const {stop, onChangeStops, selectedStops} = this.props;
        const stopsCount = stop ? stop + numberText(stop, [' Пересадка', ' Пересадки', ' Пересадок']) : 'Без пересадок';
        const htmlId = `StopsCheckBox-${stop}`;
        const checked = selectedStops && selectedStops.includes(stop);
        return (
            <Fragment>
                <div className='stops-control'>
                    <Checkbox
                        htmlId={htmlId}
                        onChange={()=>onChangeStops(stop)}
                        checked={checked}
                    />
                </div>
                <div className='stops-label'>{stopsCount}</div>
                <button
                    className="stops__button"
                    onClick={() => this.showOnly(stop)}
                >
                    только
                </button>
            </Fragment>
        )
    }
}

export default StopsFilter
