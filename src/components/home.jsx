import React from 'react';
import scratch_circles from '../bin/scratch_circles.png';

class Home extends React.Component {
    render(){
        return <div className="page">
            <h1>I am a developer.</h1>
            <p>
                Starting in middle school, I picked any class that had anything to do with software. 
                By freshman year in high school, I was already prepared to conquer any projects that involved computer accelerated development.</p>
            <p>
                Like many developers, some of my first endeavors into programming was heavily comprised of <a href='https://scratch.mit.edu/studios/8793695/' rel="noopener noreferrer" target="_blank">Scratch</a>.
            </p>
            <img src={scratch_circles} alt=''></img>
            <p>
                Naturally, I couldn't simply stop there. I was proud of my work and was interested to see what I could do with a bit more freedom.
                As it turns out, it is a lot harder than I had initially thought, but I accepted the challenge and I am still learning new things to this day.
            </p>
            <p>
                Feel free to use the navigator at the top of the page to see of my other projects and demonstrations.
            </p>
        </div>
    }
}

export default Home;