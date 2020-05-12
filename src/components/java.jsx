import React from 'react';
import Snippet from './code_snippets.jsx';
import java_desktop from '../bin/java_desktop.png';

class Java extends React.Component {
    render(){
        return <div className="page">
            <h1>I am a creator.</h1>
            <p>
                When developing in Java, I most commonly use BlueJ. 
                It was introduced to me during my sophmore year of highschool, and it's my go-to for developing anything in Java.
                I love it because it is lightweight, portable, and super easy to use.
            </p>
            <p>
                My favorite project was a somewhat failed attempt at over-engineering a custom built music player.
                The end result met the project requirements, but I later edited it to see what would happen if I played every single sound in a couple of my favorite games,
                all at once.
            </p>
            <i style={{margin: "10px"}}>(Volume Warning: It's quite loud and truly terrifying.)</i><br/>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/b2_xi8xjNyY" title="TerrariaPlaylistVideo" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullscreen></iframe>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/6dPNpdMZPKY" title="MinecraftPlaylistvideo" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullscreen></iframe>
            <p>
                My largest project to date, however, is a movie theater project in whitch was meant to show my competence in the use of arrays and lists.
                However, I decided a console interface was quite boring, and dove into JavaFX and multi-threading. 
                The best part was that using a custom user interface meant I didn't have to worry about validating user inputs.
            </p>
            <i style={{margin: "10px"}}>Here is the result diplayed on my current desktop (an infrared photo of the center of the universe from NASA's spitzer space telescope).</i><br/>
            <img src={java_desktop} alt='' width="80%"></img>
            <p>
                Without further adue, the code:
            </p>
            <Snippet type='java'/>

        </div>
    }
}

export default Java;