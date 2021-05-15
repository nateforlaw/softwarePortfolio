import React from 'react';
import blowfish from '../bin/blowfish.png';

class C extends React.Component {
    render(){
        return <div className="page">
            <h1>I am an organizer.</h1>
            <p>
                In college I was challenged in a particular class where I had to connect all my previous smaller projects together as a final project.
                These projects are comprised entirely of the C language, and each one was resposible for encoding and decoding some data.
            </p>
            <p>
                Out of everyone taking the class that semester, I was the only one to successfully deliver a working final project. 
                And in retrospect it was clear that I excelled because of my code organizational skills and my implementation techniques.
            </p>
            <p>
                In the end I ended up with a program comprised of five individual componets, that would compress an image in the PGM format.
            </p>
            <img src={blowfish} alt='' width="80%"></img>
            <p>
                While the other students implemented each stage of the encoding and decoding process in order,
                I integrated my projects outward in. Meaning that I started with the first part of the encoding process, and the last part of the decoding proccess.
                That meant that I could test each componet before implementing the next one.
            </p>
            <p>
                The reason I did it this way, is because there is no way to know when something is misbehaving untill you actually have an output to observe.
            </p>
            <p>
                When I encountered an integration issue, instead of trying to glue the two peices together,
                I reopened the componets themselves and smoothed out the issues, then re-implemented them.
                I rinsed and repeated untill I had something that worked, and It didn't take very long either.
            </p>

        </div>
    }
}

export default C;