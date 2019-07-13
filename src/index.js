import React from 'react';
import ReactDOM from 'react-dom';
//import Header from './header'
//import CountryList from './countryList';
import Map from './map';

class Main extends React.Component {
    render() {
        return (
            <div>
                {/*<Header />
                <CountryList />*/}
                <Map/>
            </div>
        )
    }
}

ReactDOM.render(
    <Main />
,document.getElementById('root'));
