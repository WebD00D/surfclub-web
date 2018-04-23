import React from 'react'

import '../layouts/index.css';

import cx from 'classnames';


class Board extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      showDetails: false
    }
  }

  render() {

    let boardDeetsClass = cx({
       'board__deets': true,
       'board__deets--open': this.state.showDetails,
    });

    return (
      <div className="board">
        <div className="board__image" style={{ backgroundImage: `url(${this.props.photo})` }}>
          <div className={boardDeetsClass}>
            <div className="board-deets__meta-sm">This board is being sold by:</div>
            <div className="board-deets__meta-title"><b>{this.props.shopName}</b></div>
            <div className="board-deets__meta-sm board-deets__spacing">{this.props.location}</div>
            <a className="board-deets__meta-button" href={`tel:+1${this.props.shopPhone}`}>{this.props.shopPhone}</a>
          </div>
        </div>
        <div className="board__meta-wrap">
        <div className="board__meta"><b>{this.props.name}</b></div>
        <div className="board__meta" style={{color: '#cccccc'}}>{`${this.props.fins}`}-Fin | {`${this.props.location}`} | ${`${this.props.price}`}</div>
        <div className="board__meta" style={{color: '#edcbb9', fontSize: '10px'}}>- {this.props.shopName} -</div>
        <button onClick={()=> this.setState({ showDetails: !this.state.showDetails })}>Check Availability</button>
        </div>

        <div className="board-mask"></div>

      </div>
    )

  }
}

export default Board;
