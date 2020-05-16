import React, { Component } from "react";
import axios from "axios";
import CardSelector from "./CardSelector";
import Scorecard from "./Scorecard";
import "./stylesheet.css";

class Scoreboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
          username: "",
          players: [],
          course: "",
        };
    }
    
    getMatchData = username => {
        return axios
          .put("/api/match/current", {username})
    }
    
    componentDidMount() {
        const username = this.props.username;
        this.getMatchData(username).then(res => {
            console.log(res.data);
            const players = res.data[0].currentMatch[0].players;
            const course = res.data[0].currentMatch[0].courseName;
    
            this.setState({ username: username });
            this.setState({ players: players });
            this.setState({ course: course });
        });
    }

    render() {
        return(
            <div id="scoreboard">
                <CardSelector 
                    username={this.props.username} 
                    players={this.state.players}
                />
                <Scorecard 
                    username={this.props.username} 
                />
            </div>
        )
    }
};

export default Scoreboard;
