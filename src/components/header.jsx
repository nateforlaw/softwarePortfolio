import React from 'react';

class Header extends React.Component {
    render(){
        return <div id="header">
            <button onClick={() => this.props.headerHandler(0)}><span>Home </span></button>
            <button onClick={() => this.props.headerHandler(1)}><span>Java </span></button>
            <button onClick={() => this.props.headerHandler(2)}><span>JS </span></button>
            <button onClick={() => this.props.headerHandler(3)}><span>PHP </span></button>
            <button onClick={() => this.props.headerHandler(4)}><span>SQL </span></button>
        </div>
    }
}

export default Header;