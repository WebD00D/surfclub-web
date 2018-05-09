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
      1000
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

    let boardListClass = cx({
      'board-list-item': true,
      'board-list-item--sponsored': this.props.productType === "SPONSORED",
    })

    let postTypeClass = cx({
      'board-list-price': true,
      'board-list-price--sponsored': this.props.productType === "SPONSORED",
    })


    return (

      <div
        onMouseOver={ () => this.props.handleMouseOver() }
        onMouseOut={ () => this.props.handleMouseOut() }
        onClick={()=> this.props.handleClick()}  className={boardListClass}>
        <div className={postTypeClass}>{this.props.productType}</div>

        <div className="board-list-name">
          <div>{this.props.headline}</div>
          <div className="flex-wrap">
          <div className="board-list-type-price">{this.props.price}</div>
            <i className="fa fa-chevron-right" style={{fontSize: "10px"}}></i>
          </div>
        </div>


      </div>
    )
  }
}

export default Board
