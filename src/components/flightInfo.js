import React, {Fragment} from 'react'
import moment from 'moment'
import 'moment/locale/ru'
import {numberText} from "../helpers";
import TurkishImg from '../images/turkish_airlines.png'

const FlightInfo = ({values}) => {
    const stopsCount = values.stops ? values.stops + numberText(values.stops, [' Пересадка', ' Пересадки', ' Пересадок']) : null;
    return(
        <Fragment>
            <div className = 'price'>
                <img
                    alt = 'turkish_airlines'
                    className = 'airline-img'
                    src = {TurkishImg}
                />
                <button className = 'buy-ticket'>
                    <span className = 'buy'>Купить</span> за {values.price}
                </button>
            </div>
            <div className = 'ticket-info'>
                <div className = 'flight-time'>
                    <div className = 'departure_time'>{values.departureTime}</div>
                    <div className = 'flight-stops'>{stopsCount}</div>
                    <div className = 'arrival_time'>{values.arrivalTime}</div>
                </div>
                <div className = 'flight-airport'>
                    <div className = 'airport'>
                        {values.origin}, {values.originName}
                    </div>
                    <div className = 'airport'>
                        {values.destination}, {values.destinationName}
                    </div>
                </div>
                <div className = 'flight-date'>
                    <div className = 'date'>
                        {moment(values.departureDate, 'DD-MM-YY').format('DD MMMM YYYY, dd')}
                    </div>
                    <div className = 'date'>
                        {moment(values.arrivalDate, 'DD-MM-YY').format('DD MMMM YYYY, dd')}
                    </div>
                </div>
            </div>
        </Fragment>
    )
};

export default FlightInfo
