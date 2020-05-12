import React from 'react';
import php_input from '../bin/php_input.png';
import php_output from '../bin/php_output.png';
import Snippet from './code_snippets.jsx';

class PHP extends React.Component {
    render(){
        return <div className="page">
            <p>
                PHP has quite a reputation behind it and I quickly understood why when I first used it. 
                Here is a project for a midterm that takes works hours and hourly wage to compute the salary.
            </p>
            <img src={php_input} alt='' height="200px"></img>
            <img src={php_output} alt='' height="200px"></img>
            <Snippet type='php'/>
        </div>
    }
}

export default PHP;