import React from 'react';
import Snippet from './code_snippets.jsx';

class SQL extends React.Component {
    render(){
        return <div className="page">
            <p>
                Imagining a world without SQL is like imagining a world without processors. 
                If the internet were a person SQL would be the brain stem in my eyes.
            </p>
            <p>
                Sadly, just because something is important doesn't inherently make it interesting.
                The following is a stored procedure that is used to either insert or update a record into a table:
            </p>
            <Snippet type='sql'/>
            <p>
                I am familiar with SSMS, but I shine in the front-end side of things.
            </p>
        </div>
    }
}

export default SQL;