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
      opacity: '0',
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

    setTimeout(
      function() {
        this.setState({
          opacity: '1',
        })
      }.bind(this),
      2000
    )
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


    return (

      <div onClick={()=> this.props.handleClick()}  className="board-list-item">
        { this.props.forSale ? <div className="board-list-price">{this.props.price}</div> : <div className="board-list-sold">SOLD</div>  }
        <div className="board-list-name">
          <div>{this.props.name}</div>
          <div className="flex-wrap heart-wrap"><i className="fa fa-chevron-right"></i></div>
        </div>
      </div>
    )
  }
}

export default Board
