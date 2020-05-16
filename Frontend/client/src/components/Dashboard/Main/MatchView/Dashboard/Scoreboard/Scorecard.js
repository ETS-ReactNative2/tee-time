import React, { Component } from "react";
import GolfAPI from "../../../../../utils/golfGeniusAPI";
import axios from "axios";
import "./stylesheet.css";

const saveIconStyles = {
    "--fa-secondary-opacity": "1.0",
    "--fa-primary-color": "white",
    "--fa-secondary-color": "limegreen",
};

class Scorecard extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loading: true,
          username: "",
          course: "",
          players: [],
          holes: "",
          sideOut: [],
          sideIn: [],
          parData: [],
          hcpData: [],
          yardageData: [],
          viewSideOut: true
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
    
        GolfAPI.findCourses().then(res => {
            const allCourseData = res.data.courses;
            let matchCourseData;
            for (let i = 0; i < allCourseData.length; i++) {
                if (allCourseData[i].name === this.state.course) {
                    matchCourseData = allCourseData[i];
                }
            }
    
            const holes = matchCourseData.hole_labels
            this.setState({ holes: holes });

            const sideOut = (this.state.holes).splice(0, 9);
            this.setState({ sideOut: sideOut});

            const sideIn = (this.state.holes).splice(0, 9);
            this.setState({ sideIn: sideIn });
    
            const parData = matchCourseData.tees[0].hole_data.par;
            this.setState({ parData: parData });
    
            const hcpData = matchCourseData.tees[0].hole_data.handicap;
            this.setState({ hcpData: hcpData });
    
            const yardageData = matchCourseData.tees[0].hole_data.yardage;
            this.setState({ yardageData: yardageData });
    
            console.log(this.state);
        }).then(() => {
            this.setState({ loading: false });
        })
    }

    handleSideViewChange(event) {
        if (event.target.id === "side-out") {
            this.setState({ viewSideOut: true });
        } else {
            this.setState({ viewSideOut: false });
        }
    }

    render() {
        if (!this.state.loading) {
            const sideOut = this.state.sideOut;
            const sideIn = this.state.sideIn;
            console.log(sideIn);
            const parData = this.state.parData;
            const hcpData = this.state.hcpData;
            return(
                <div className="scorecard">
                    <p className="player-name">Player1</p>
                    <div className="side-container">
                        <p 
                            id="side-out"
                            onClick={this.handleSideViewChange.bind(this)}
                        >
                            OUT
                        </p>
                        <p 
                            id="side-in"
                            onClick={this.handleSideViewChange.bind(this)}
                        >
                            IN
                        </p>
                    </div>
                    <table className="score-table">
                        <thead>
                            <tr>
                                <th>Hole</th>
                                <th>Par</th>
                                <th>Hcp</th>
                                <th>Score</th>
                                <th></th>
                            </tr>
                        </thead>
    
                        <tbody className={this.state.viewSideOut ? "out show" : "out hide"}>
                            {sideOut.map((value, index) => {
                                return <tr 
                                key={index}>
                                    <td className="hole">
                                        <span>{value}</span>
                                    </td>
                                    <td className="par">{parData[index]}</td>
                                    <td className="hcp">{hcpData[index]}</td>
                                    <td className="score">
                                        <form>
                                            <input className="score-input"/>
                                        </form>
                                    </td>
                                    <td>
                                        <button>
                                            <i 
                                                className="fad fa-check-square fa-2x" 
                                                style={saveIconStyles}
                                            >
                                            </i>
                                        </button>
                                    </td>
                                </tr>
                            })}
                        </tbody>
                        <tbody className={this.state.viewSideOut ? "in hide" : "in show"}>
                            {sideIn.map((value, index) => {
                                return <tr 
                                key={index}>
                                    <td className="hole">
                                        <span>{value}</span>
                                    </td>
                                    <td className="par-cell">{parData[index + 9]}</td>
                                    <td className="hcp-cell">{hcpData[index + 9]}</td>
                                    <td className="score-cell">
                                        <form>
                                            <input className="score-input"/>
                                        </form>
                                    </td>
                                    <td className="save-btn-cell">
                                        <button>
                                            <i 
                                                className="fad fa-check-square fa-2x" 
                                                style={saveIconStyles}
                                            >
                                            </i>
                                        </button>
                                    </td>
                                </tr>
                            })}  
                        </tbody>
                    </table>
                </div>
            )
        } else {
            return(
                <div>
                    <p>Loading...</p>
                </div>
            )
        }

        
    }
};

export default Scorecard;