import React from 'react';
import ReactDOM from 'react-dom';
import Header from './header'
import CountryList from './countryList';
import Map from './map';
import './css/index.css';
import './css/contant.css';
import './css/footer.css';


let test = [{ 'Ukraine': [] }, { 'Spain': [] }, { 'France': [] }, { 'Germany': [] }];

function Footer() {
    return (
        <div className='footer'>
            Some text
        </div>
    )
}

class Main extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            countrys: null,
            openWindow: false,
        }
    }

    setMainState(country) {
        this.setState({
            countrys: country,
            openWindow: true,
        })
        console.log(country)//получает страну при нажатии add
    }

    render() {
        return (
            <div className={'main'}>
                <Header />
                <div className={'contant'}>
                    <CountryList setMainState={this.setMainState.bind(this)} />
                    <Map activCountry={test} setMainState={this.setMainState.bind(this)}/>
                </div>
                <Footer />
            </div>
        )
    }
}

ReactDOM.render((
    <Main />
), document.getElementById('root'));
