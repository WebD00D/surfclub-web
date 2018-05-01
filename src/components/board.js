import React from 'react'

import '../layouts/index.css'

import cx from 'classnames'
import fire from '../fire'

class Board extends React.Component {
  constructor(props) {
    super(props)

    this.incrementLove = this.incrementLove.bind(this)

    this.state = {
      showDetails: false,
      love: '',
      opacity: '0'
    }
  }

  componentDidMount() {
    fire
      .database()
      .ref('boards/' + this.props.id)
      .once('value')
      .then(
        function(snapshot) {
          console.log('BOARD LOVE', snapshot.val())
          if (snapshot.val()) {
            this.setState({
              love: snapshot.val().love,
            })
          } else {
            this.setState({
              love: 0,
            })
          }
        }.bind(this)
      )


      setTimeout(function(){
        this.setState({
          opacity: '1'
        })
      }.bind(this),3000)


  }

  incrementLove() {
    let currentLove = parseInt(this.state.love)
    let newLove = currentLove + 1

    this.setState({
      love: newLove,
    })

    fire
      .database()
      .ref('boards/' + this.props.id)
      .set({
        love: newLove,
      })
  }

  render() {
    let boardDeetsClass = cx({
      board__deets: true,
      'board__deets--open': this.state.showDetails,
    })


    return (
      <div className="board">
      <div className="board-image-mask">
        <div className="loader"></div>
      </div>

        <div
          className="board__image"
          style={{ backgroundImage: `url(${this.props.photo})`, opacity: this.state.opacity, backgroundColor: '#808080' }}
        >
          <div className={boardDeetsClass}>
            <div className="board-deets__meta-sm">
              {this.props.forSale
                ? 'This board is being sold by:'
                : 'This board was sold by'}
            </div>
            <div className="board-deets__meta-title">
              <b>{this.props.shopDeets.name}</b>
            </div>
            <div className="board-deets__meta-sm board-deets__spacing">
              {this.props.shopDeets.shopLocation}
            </div>
            {this.props.forSale ? (
              <div style={{flexDirection:'column', display: 'flex',alignItems: 'center'}}>
              <a
                className="board-deets__meta-button"
                href={`tel:+1${this.props.shopDeets.shopPhone}`}
              >
                {this.props.shopDeets.shopPhone}
              </a>


              </div>
            ) : (
              ''
            )}
          </div>
          <div onClick={() => this.incrementLove()} className="show-love">
            <i className="fa fa-heart" />
            <span>{this.state.love}</span>
          </div>
        </div>
        <div className="board__meta-wrap">
          <div className="board__meta" style={{fontSize: '10px'}}>
            <b>{this.props.name}</b>
          </div>


          <div className="board__meta" style={{ color: '#cccccc' }}>
            {`${this.props.fins}`}-Fin | {`${
              this.props.price
            } USD` }
          </div>

          <button
            onClick={() =>
              this.setState({ showDetails: !this.state.showDetails })
            }
          >
            {this.props.forSale ? 'FOR SALE' : "SOLD OUT"}
          </button>
        </div>

        <div className="board-mask" />
      </div>
    )
  }
}

export default Board
