import React from 'react';
import Snippet from './code_snippets.jsx';
import java_desktop from '../bin/java_desktop.png';
import maze from '../bin/maze.gif';

class Java extends React.Component {
    render(){
        return <div className="page">
            <h1>I am a creator.</h1>
            <p>
                When developing in Java, I most commonly use BlueJ. 
                It was introduced to me during my sophmore year of highschool, and it's my go-to for developing small projects in Java.
                I love it because it is lightweight, portable, and easy to use.
            </p>
            <p>
                One of the projects I hold near my heart is a failed attempt at over-engineering a custom built music player.
                The end result met the project requirements, but I later edited it to see what would happen if I played every single sound in a couple of my favorite games,
                all at once.
            </p>
            <i style={{margin: "10px"}}>(Volume Warning: Loud)</i><br/>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/b2_xi8xjNyY" title="TerrariaPlaylistVideo" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullscreen></iframe>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/6dPNpdMZPKY" title="MinecraftPlaylistvideo" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullscreen></iframe>
            <p>
                My largest Java project to date, however, is a movie theater project meant to show my competence in the use of arrays and lists.
                However, I decided a console interface was quite boring, and dove into JavaFX and multi-threading. 
                The best part was that using a custom user interface meant I didn't have to worry about validating user inputs, although I do enjoy developing regex.
            </p>
            <i style={{margin: "10px"}}>Here is the result diplayed on my desktop.</i><br/>
            <img src={java_desktop} alt='' width="80%"></img>
            <p>
                Code snippet:
            </p>
            <Snippet type='java'/>
            <p style={{marginBottom: "5px"}}>
                Bonus maze project (Implementing A* pathfinding):
            </p>
            <img src={maze} alt='' width="35%"></img>

        </div>
    }
}

export default Java;