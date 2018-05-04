import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'

import Header from '../components/header'
import Board from '../components/board'
import BoardSample from '../components/BoardSample'
import './index.css'
import fire from '../fire'
import _ from 'lodash'

import cx from 'classnames'

import { Fullpage, Slide, HorizontalSlider } from 'fullpage-react'

import ReactGA from 'react-ga'
ReactGA.initialize('UA-118033416-1')

ReactGA.initialize('UA-118033416-1', {
  debug: true,
  titleCase: false,
})

ReactGA.pageview(window.location.pathname + window.location.search)

class Layout extends PureComponent {
  constructor(props) {
    super(props)

    this.authenticateUser = this.authenticateUser.bind(this)
    this.getUrlVars = this.getUrlVars.bind(this)
    this.setDetails = this.setDetails.bind(this)

    this.state = {
      email: '',
      authenticated: false,
      error: '',
      loginButtonText: 'Enter Site',
      sell: false,
      paid: false,

      boardName: '',
      fins: 0,
      price: 0,
      location: '',
      photoURL: '',
      brand: '',
      number: '',
      listDate: '',

      menuHidden: true,

      loaderOpacity: '1',
      photoOpacity: '0',
      opacity: '0',
      loaderOpacity: '1',
    }
  }

  getUrlVars() {
    var vars = {}
    var parts = window.location.href.replace(
      /[?&]+([^=&]+)=([^&]*)/gi,
      function(m, key, value) {
        vars[key] = value
      }
    )
    return vars
  }

  setDetails(name, fins, price, location, photo, shop, number, listdate) {

    ReactGA.event({
      category: 'BOARD CLICK',
      action: `User clicked on ${name}`,
    })

    window.scrollTo(0, 0)

    this.setState({
      opacity: '0',
      menuHidden: !this.state.menuHidden,
      boardName: name,
      fins: fins,
      price: price,
      location: location,
      photoURL: photo,
      brand: shop,
      number: number,
      listDate: listdate,
    })

    setTimeout(
      function() {
        this.setState({
          opacity: '1',
          loaderOpacity: '0',
        })
      }.bind(this),
      1000
    )
  }

  authenticateUser() {
    // check if they are user..

    this.setState({
      loginButtonText: 'LOADING...',
    })

    let emailEncoded = this.state.email

    if (emailEncoded.trim() === '') {
      this.setState({
        error: 'Invalid email',
      })
      return
    }

    emailEncoded = emailEncoded.replace(/@/g, '*')
    emailEncoded = emailEncoded.replace(/\./g, '^')

    // christian@stabmag.com >>  christian*stabmag^com

    ReactGA.event({
      category: 'Account Created',
      action: `A user has registered for an account`,
    })

    fire
      .database()
      .ref('users/' + emailEncoded)
      .once('value')
      .then(
        function(snapshot) {
          if (snapshot.val()) {
            localStorage.setItem('surfclub_member', true)
            this.setState({
              authenticated: true,
            })
          } else {
            fire
              .auth()
              .createUserWithEmailAndPassword(this.state.email, 'SURFCLUB-LA!')
              .then(
                function(user) {
                  localStorage.setItem('surfclub_member', true)

                  fire
                    .database()
                    .ref('users/' + emailEncoded)
                    .set({
                      email: this.state.email,
                      joined: Date.now(),
                    })

                  this.setState({
                    authenticated: true,
                  })

                  // fetch(
                  //   `https://stabnewsletter-api.herokuapp.com/welcome-to-surfclub?email=${
                  //     this.state.email
                  //   }`
                  // ).then(function(response) {
                  //   console.log('RESPONSE', response)
                  // })
                }.bind(this)
              )
              .catch(
                function(error) {
                  // handle errors.
                  const errorCode = error.code
                  const errorMessage = error.message
                  this.setState({
                    error: errorMessage,
                    loginButtonText: 'Enter Site',
                  })
                }.bind(this)
              )
          }
        }.bind(this)
      )
  }

  componentDidMount() {
    // check if they've signed up and we've got it stored already..

    var paid = this.getUrlVars()['paid']

    if (paid) {
      this.setState({
        sell: true,
        paid: true,
      })
    }

    const surfclub_member = localStorage.getItem('surfclub_member')
    if (surfclub_member) {
      this.setState({
        authenticated: true,
      })

      ReactGA.event({
        category: 'Returning Member',
        action: `An already registered user came back`,
      })


    }
  }

  render() {
    const boards = this.props.data.allContentfulBoard.edges

    let boardList = boards.map(
      function(board, idx) {
        return (
          <Board
            key={board.node.id}
            handleClick={() =>
              this.setDetails(
                board.node.boardName,
                board.node.finCount,
                board.node.price,
                board.node.surfShopName.shopLocation,
                board.node.photo.file.url,
                board.node.surfShopName.name,
                board.node.surfShopName.shopPhone,
                board.node.createdAt
              )
            }
            id={board.node.id}
            name={board.node.boardName}
            photo={board.node.photo.file.url}
            fins={board.node.finCount}
            location={board.node.location}
            price={board.node.price}
            forSale={board.node.forSale}
            dims={board.node.dimensions}
            shopDeets={board.node.surfShopName}
            listDate={board.node.createdAt}
          />
        )
      }.bind(this)
    )

    let menuClass = cx({
      'menu-bar': true,
      'menu-bar--hidden': this.state.menuHidden,
    })

    let formattedDate = this.state.listDate

    formattedDate = new Date(formattedDate)

    return (
      <div>
        <Helmet
          title="Surf Club"
          meta={[
            { name: 'description', content: 'Sample' },
            { name: 'keywords', content: 'sample, something' },
          ]}
        />

        <div className="site-wrapper">
          <ReactGA.OutboundLink
            eventLabel="Banner Ad"
            to="http://deuscustoms.com/wetsuits/"
            target="_blank"
          >
            <div
              className="fixed"
              style={{ backgroundColor: '#FFFFFF', zIndex: '2' }}
            >
              <img
                className="mobile-top-ad"
                src={require('../ads/DuesAd.jpg')}
              />
            </div>
          </ReactGA.OutboundLink>

          <div className="brand-column">
            <div className="brand-logo">SURF CLUB 서핑 클럽</div>
            <div className="brand-byline">
              A CURATED COLLECTION OF UNIQUE, ONE OF A KIND, OR SIMPLY BEAUTIFUL
              SURFBOARDS FOR SALE IN LOS ANGELES
            </div>

            <ReactGA.OutboundLink
              eventLabel="List a Board Clicked"
              to="https://christianbryant.typeform.com/to/O2TMlF"
              target="_blank"
              className="brand-byline"
            >

            LIST A BOARD
            </ReactGA.OutboundLink>

            <div
              onClick={() =>
                this.setState({
                  menuHidden: true,
                  photoOpacity: '0',
                  loaderOpacity: '1',
                })
              }
              className={menuClass}
            >
              <i className="fa fa-long-arrow-left" />
            </div>
          </div>

          {this.state.authenticated ? (
            <div className="content">
              {this.state.menuHidden ? (
                <div className="board-list">{boardList}</div>
              ) : (
                <div className="board-details">
                  <div className="board-detail--date">
                    {this.state.listDate}
                  </div>
                  <div className="board-detail--name">
                    {this.state.boardName}
                  </div>
                  <div className="board-meta-wrap">
                    <div
                      className="board-photo"
                      style={{
                        backgroundImage: `url(${this.state.photoURL})`,
                        opacity: this.state.opacity,
                      }}
                    />
                    <div
                      className="loader"
                      style={{ zIndex: 1, opacity: this.state.loaderOpacity }}
                    />
                    <div className="board-meta">
                      <div>{this.state.price} USD</div>
                      <div>{this.state.fins}-FIN</div>
                      <div>{this.state.brand}</div>
                      <div>{this.state.location}</div>
                      <div>{this.state.number}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="content content-auth">
              <div className="auth-box">
                <div className="brand-byline" style={{ padding: '0px' }}>
                  <b>BROWSE, SHOP, AND SELL KICKASS SURFBOARDS.</b>
                </div>
                <div
                  className="brand-byline"
                  style={{ padding: '0px', marginTop: '0px' }}
                >
                  JUST YOUR EMAIL PLEASE.
                </div>
                <input
                  type="text"
                  onChange={e => this.setState({ email: e.target.value })}
                />
                <br />
                <button onClick={() => this.authenticateUser()}>
                  JOIN SURF CLUB
                </button>

                {this.state.error ? (
                  <div
                    className="brand-byline"
                    style={{ padding: '0px', marginTop: '12px', color: 'red' }}
                  >
                    INVALID EMAIL
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

Layout.propTypes = {
  children: PropTypes.func,
}

const mapStateToProps = ({ sampleProp }) => {
  return { sampleProp }
}

export default connect(mapStateToProps)(Layout)

export const query = graphql`
  query BoardQuery {
    allContentfulBoard {
      edges {
        node {
          id
          createdAt
          surfShopName {
            id
            name
            shopLocation
            shopPhone
          }
          boardName
          photo {
            id
            file {
              url
            }
          }
          finCount
          price
          forSale
          dimensions
        }
      }
    }
  }
`
