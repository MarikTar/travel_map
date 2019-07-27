import React from 'react';
import Header from '../component_header'
import CountryList from './component_countryList';
import Footer from '../component_footer';
import Map from './component_map';
import './style/index.css';
import './style/contant.css';

let test = [{ 'Ukraine': [] }, { 'Spain': [] }, { 'France': [] }, { 'Germany': [] }];

export default class Main extends React.Component {
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
