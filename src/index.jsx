import React from 'react';
import ReactDOM from 'react-dom';
import Header from './header'
import CountryList from './countryList';
import Map from './map';
import './css/index.css';
import './css/contant.css';


class Main extends React.Component {
    render() {
        return (
            <div className={'main'}>
                <Header />
                <div className={'contant'}>
                    <CountryList />
                    <Map />
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <Main />
    , document.getElementById('root'));
