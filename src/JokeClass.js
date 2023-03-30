import axios from 'axios';
import React, { Component } from 'react';
import Joke from './Joke';

class JokeClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jokes : []

        };
        this.generateNewJokes = this.generateNewJokes.bind(this);
        this.vote = this.vote.bind(this);

    }
    

    async componentDidMount() {
        let { numJokesToGet } = this.props;
        let j = [...this.state.jokes];
        let seenJokes = new Set();
        try {
            while(j.length < numJokesToGet) {
                let res = await axios.get("https://icanhazdadjoke.com", {
                    headers: { Accept: "application/json" }
                  });
                
                  let { status, ...jokeObj } = res.data;

                  if (!seenJokes.has(jokeObj.id)) {
                    seenJokes.add(jokeObj.id);
                    j.push({ ...jokeObj, votes: 0 });
                  } else {
                    console.error("duplicate found!");
                  }
                
                


            }

            this.setState({ jokes: j });

        }catch (e){
            console.log(e)

        }
    }

    /* empty joke list and then call getJokes */
    
    generateNewJokes() {
        this.setState({jokes : []});
    }
    
    vote(id, delta) {
        this.setState(({ jokes }) => ({
          jokes: jokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))
        }));
      }
      componentDidUpdate() {
        if (this.state.jokes.length < this.props.numJokesToGet) this.componentDidMount();
    }
      
  render() {
    let { jokes } = this.state;
    if (jokes.length) {
        let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

        
      return (
        <div className="JokeClass">
          <button className="JokeClass-getmore" onClick={this.generateNewJokes}>
            Get New Jokes
          </button>

          {sortedJokes.map(j => (
            <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
          ))}
        </div>
      );
    }

    return null;
  }

}

JokeClass.defaultProps = {
  numJokesToGet: 5
};



export default JokeClass;
