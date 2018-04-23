import React from 'react'

import '../layouts/index.css'

import cx from 'classnames'

class BoardSample extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showDetails: false,
      showLoader: true,
    }
  }

  componentDidMount() {
    setTimeout(
      function() {
        this.setState({
          showLoader: false,
        })
      }.bind(this),
      1500
    )
  }

  render() {
    let boardDeetsClass = cx({
      board__deets: true,
      'board__deets--open': this.state.showDetails,
    })



    return (
      <div className="board-sample">
        <div
          className="board__image"
          style={{
            backgroundImage: `url(https://images.ctfassets.net/cn4bn1z4mmvm/2FWdIjbpl6MCqEGgKqY2WY/626aa8693ade3c2bcf0b793aaf9381b9/BLURRED_BOARD_2x.png)`,
          }}
        >
          <div className={boardDeetsClass}>
            <div className="board-deets__meta-sm">
              This board is being sold by:
            </div>
            <div className="board-deets__meta-title">
              <b>{this.props.shopName}</b>
            </div>
            <div className="board-deets__meta-sm board-deets__spacing">
              {this.props.location}
            </div>
            <a
              className="board-deets__meta-button"
              href={`tel:+1${this.props.shopPhone}`}
            >
              {this.props.shopPhone}
            </a>
          </div>

          {this.state.showLoader ? (
            <div className="board-loader">
              <div className="loader">Loading...</div>
            </div>
          ) : (
            ''
          )}
        </div>

        <div className="board__meta-wrap">
          <div className="board__meta" style={{ color: '#cccccc' }}>
            FIND OUT MAY 5TH
          </div>
        </div>

        <div className="board-mask" />
      </div>
    )
  }
}

export default BoardSample
