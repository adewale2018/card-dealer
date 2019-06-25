import React, { Component } from 'react';
import Card from './Card';
import './Deck.css';
import axios from 'axios';

const API_BASE_URL = 'https://deckofcardsapi.com/api/deck';

class Deck extends Component {
  constructor(props){
    super(props);
    this.state = { deck: null, drawn: [] };
    this.getCard = this.getCard.bind(this);
  }
  async componentDidMount(){
    let deck = await axios.get(`${API_BASE_URL}/new/shuffle/`);
    this.setState({
      deck: deck.data
    });
  }
  async getCard() {
    // make request using deck-id
    let cardId = this.state.deck.deck_id;
    try {
      let cardUrl = `${API_BASE_URL}/${cardId}/draw/`;
      let cardRes = await axios.get(cardUrl);
      if(!cardRes.data.success) {
        throw new Error('No card remaining');
      }
      let card = cardRes.data.cards[0];
      // set state using new card info from api
      this.setState(st => ({
        drawn: [
          ...st.drawn, {
            id: card.code,
            image: card.image,
            name: `${card.value} of ${card.suit}`
          }
        ]
      }));
    } catch (err) {
      alert(err);
    }
  }
  render() {
    let cards = this.state.drawn.map(m => (
      <Card key={m.id} name={m.name} image={m.image}/>
    ));
    return (
      <div className="Deck">
        <h1 className="Deck-title"><span role="img" aria-label="diamond">🔹</span> Card-Dealer <span role="img" aria-label="diamond">🔹</span></h1>
        <h2 className="Deck-title subtitle"><span role="img" aria-label="diamond">🔹</span>A little Demo made with React<span role="img" aria-label="diamond">🔹</span></h2>
        <button className="Deck-btn" onClick={this.getCard}>Get Card!</button>
        <div className="Deck-cardarea">{cards}</div>
      </div>
    ); 
  }
}

export default Deck;
