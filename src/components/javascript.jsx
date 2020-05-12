import React from 'react';
import js_uno from '../bin/js_uno.png';
import Snippet from './code_snippets.jsx';

class Javascript extends React.Component {
    render(){
        return <div className="page">
            <h1>I am an artist.</h1>
            <p>
                As you may noticed, JavaScript is one of my favorite languages to use. 
                Not neccecarily by iteself, but since it is so widley used, it has a lot of support and libraries.
                In fact, I like to use JavaScript with the React framework.
            </p>
            <p>
                My uno project is my largest project to date by far. 
                Nearly everything is animated using CSS and there are computers that play against you.
                You can play my game <a href='https://nlawrence162.github.io/unoGameSimulator/' rel="noopener noreferrer" target="_blank">Here</a>.
            </p>
            <img src={js_uno} alt='' width="85%"></img>
            <p>
                You may have also noticed the randomized names, too. Feast your eyes:
            </p>
            <Snippet type='js'/>
        </div>
    }
}

export default Javascript;