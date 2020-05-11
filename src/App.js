import React from 'react';
import Header from './components/header.jsx';
import Home from './components/home.jsx';
import Java from './components/java.jsx';
import Javascript from './components/javascript.jsx';
import PHP from './components/php.jsx';
import SQL from './components/sql.jsx';
import './styles/app.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageLoaded: 0
    }
  }

  headerHandler = (value) => {
    this.setState({pageLoaded: value});
  }

  renderPage() {
    switch (this.state.pageLoaded) {
      default: return <Home/>;
      case 0: return <Home/>;
      case 1: return <Java/>;
      case 2: return <Javascript/>;
      case 3: return <PHP/>;
      case 4: return <SQL/>;
    }
  }

  render() {
    return <div>
      <Header headerHandler={this.headerHandler}/>
      {this.renderPage()}
    </div>
  }
}

export default App;
