import React, { Component } from 'react';
import _ from 'lodash'
import './styles/index.css'
import {api} from "./API";
import FlightInfo from "./components/flightInfo";
import StopsFilter from "./components/stopsFilter";
import Checkbox from "./components/Checkbox";

const currencyOptions = [ 'RUB', 'USD', 'EUR']

class App extends Component {
    constructor(){
        super();
        this.state = {
            tickets: [],
            originalTickets: [],
            stops: [],
            appliedFilters: {
                stops: []
            },
            currency: {
                USD: null,
                EUR: null
            },
            selectedCurrency: null
        }
    }

    componentDidMount() {
        this.getTickets();
        this.getCurrency()
    }

    getTickets = async () => {
        const tickets = await api.getTickets();
        const stops = _.uniq(tickets.tickets.map(ticket => ticket.stops)).sort();
        this.setState({tickets: tickets.tickets, stops, originalTickets: tickets.tickets});



    };

    getCurrency = async () => {
        const currency = await api.getCurrentCurrency()
        const USD = currency && currency.Valute.USD.Value;
        const EUR = currency && currency.Valute.EUR.Value;

        this.setState({currency: {
                USD: Math.round(USD),
                EUR: Math.round(EUR)
            }})
    }

    filterTickets = (unfilteredTickets, appliedFilters) => {
        const filtrationResults = [];

        if (unfilteredTickets && unfilteredTickets.length > 0){
            const stops = appliedFilters.stops || [];

            for (let i = 0; i < unfilteredTickets.length; i++) {
                const ticket = unfilteredTickets[i];
                const stop = ticket.stops;
                if (stops.length > 0 && !stops.includes(stop)) continue;

                filtrationResults.push(ticket)
            }
        } else return unfilteredTickets; //by default

        return filtrationResults
    }

    onChangeAllStops = (item) => {
        const {appliedFilters, originalTickets} = this.state;
        const exist = appliedFilters.stops.some(s=> item.includes(s))
        if (exist){
            appliedFilters.stops = []
            item.map(stop => appliedFilters.stops.filter(r => r !== stop))
        } else {
            appliedFilters.stops = item
        }
        let tickets = this.filterTickets(originalTickets, appliedFilters)

        this.setState({appliedFilters, tickets})
    }

    onChangeStops = (item, only = false) => {
        const {appliedFilters, originalTickets} = this.state;
        if (only){
            appliedFilters.stops = [item]
        } else{

            const existing = appliedFilters.stops.findIndex(c => c === item);
            if (existing >= 0) { // remove
                appliedFilters.stops = appliedFilters.stops.filter(r => r !== item);
            }
            else {
                appliedFilters.stops.push(item);
            }

        }
        let tickets = this.filterTickets(originalTickets, appliedFilters)

        this.setState({appliedFilters, tickets})
    }

    renderTicket = (ticket, key) => {
        const {selectedCurrency} = this.state;
        if (!ticket) return;

        const flightInfoValues ={
            price: selectedCurrency!==null ? Math.round(ticket.price / selectedCurrency.value) + selectedCurrency.symbol : ticket.price + '₽',
            departureTime: ticket.departure_time,
            departureDate: ticket.departure_date,
            arrivalTime: ticket.arrival_time,
            arrivalDate: ticket.arrival_date,
            stops: ticket.stops,
            originName: ticket.origin_name,
            destinationName: ticket.destination_name,
            origin: ticket.origin,
            destination: ticket.destination
        };

        return (
            <div className='ticket' key={key}>
                <FlightInfo values = {flightInfoValues}/>
            </div>
        )
    }

    renderStopsCount = (stop, ind) => {
                const {appliedFilters} = this.state
                return (
                    <div className='stop' key={ind}>
                        <StopsFilter stop={stop} selectedStops={appliedFilters.stops} onChangeStops={this.onChangeStops}/>
                    </div>
                )
    }

    handleCurrency = (name) => {
        const {currency} = this.state;
        switch (name) {
            case 'USD':
                this.setState({selectedCurrency: {value: currency.USD, symbol: '$'}});
                break;
            case 'EUR':
                this.setState({selectedCurrency: {value: currency.EUR, symbol: '€'}});
                break;
            default:
                this.setState({selectedCurrency: null})
        }
    };

    render() {
        const {tickets, stops, appliedFilters} = this.state;
        console.log(appliedFilters.stops)
        return (
            <div className='app-container'>
                <div className = 'header'>
                    <div className = 'logo' />
                </div>
                <div className='content'>
                    <div className='content left-pane'>
                        {
                            <div className='currency'>
                                <div className='filter-label'>Валюта</div>
                                <div className='currency-row'>
                                    {
                                        currencyOptions.map((curr, index) => {
                                            return <a key={index} className='currency-btn' onClick={() => this.handleCurrency(curr)}>{curr}</a>
                                        })
                                    }
                                </div>
                            </div>
                        }
                        {stops.length > 0 &&
                            <div className='stops'>
                                <div className='filter-label'>количество пересадок</div>
                                <div className='stop'>
                                    <div className='stop-control'>
                                        <Checkbox
                                            htmlId={`StopsCheckBox-all`}
                                            checked = {stops.length === appliedFilters.stops.length}
                                            onChange={()=>this.onChangeAllStops(stops)}
                                        />
                                        Все
                                    </div>
                                </div>
                                {
                                    stops.map((stop, ind) => {
                                        return this.renderStopsCount(stop, ind)
                                    })
                                }
                            </div>
                        }
                    </div>
                    <div className='content right-pane'>
                        <div className='tickets'>
                            {
                                tickets.map((ticket, key) => {
                                    return this.renderTicket(ticket, key)
                                })
                            }
                            {
                                tickets.length === 0 && <div>Подождите, идет поиск перелетов!</div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
