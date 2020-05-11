import React from 'react';

class Header extends React.Component {
    render(){
        return <div id="header">
            <button className={(this.props.page===0)?"expand":""} onClick={() => this.props.headerHandler(0)}><span>Home </span></button>
            <button className={(this.props.page===1)?"expand":""} onClick={() => this.props.headerHandler(1)}><span>Java </span></button>
            <button className={(this.props.page===2)?"expand":""} onClick={() => this.props.headerHandler(2)}><span>JS </span></button>
            <button className={(this.props.page===3)?"expand":""} onClick={() => this.props.headerHandler(3)}><span>PHP </span></button>
            <button className={(this.props.page===4)?"expand":""} onClick={() => this.props.headerHandler(4)}><span>SQL </span></button>
        </div>
    }
}

export default Header;