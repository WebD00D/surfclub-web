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

class Layout extends PureComponent {
  constructor(props) {
    super(props)

    this.authenticateUser = this.authenticateUser.bind(this)
    this.getUrlVars = this.getUrlVars.bind(this)

    this.state = {
      email: '',
      authenticated: false,
      error: '',
      loginButtonText: 'Enter Site',
      sell: false,
      paid: false,

      sellers_name: '',
      sellers_email: '',
      shaper_model: '',
      length: '',
      fins: 0,
      price: 0,
      location: '',
      photoURL: '',
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
                  console.log('ERROR', error)
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
    }
  }

  render() {
    const boards = this.props.data.allContentfulBoard.edges

    let allBoards = boards.map(function(board) {
      console.log(board)

      return (
        <Board
          key={board.node.id}
          id={board.node.id}
          name={board.node.boardName}
          fins={board.node.finCount}
          location={board.node.location}
          photo={board.node.photo.file.url}
          price={board.node.price}
          forSale={board.node.forSale}
          dims={board.node.dimensions}
          shopDeets={board.node.surfShopName}
        />
      )
    })

    return (
      <div>
        <Helmet
          title="Surf Club"
          meta={[
            { name: 'description', content: 'Sample' },
            { name: 'keywords', content: 'sample, something' },
          ]}
        />
        <Header />

        <div
          className="cta--bottom"
          onClick={() => {
            this.setState({ sell: true })
          }}
        >
          LIST YOUR BOARD ON SURF CLUB
        </div>

        <div className="nav">
          <div className="surf-club-logo">SURF CLUB</div>
          <div className="surfclubloves-wrap">
            {this.state.sell ? (
              <a
                className="surfclubloves"
                href=""
                onClick={e => {
                  e.preventDefault()
                  this.setState({
                    sell: false,
                  })
                }}
              >
                BOARDS
              </a>
            ) : (
              <a
                className="surfclubloves"
                href=""
                onClick={e => {
                  e.preventDefault()
                  this.setState({
                    sell: true,
                  })
                }}
              >
                SELL A BOARD
              </a>
            )}

            <a
              target="_blank"
              className="surfclubloves"
              href="https://instagram.com/joinsurfclub"
            >
              INSTA
            </a>
          </div>
        </div>
        <div
          style={{
            margin: '0 auto',
            maxWidth: 1600,
            paddingTop: 0,
          }}
        >
          <div className="surf-club-wrap">
            <div className="surf-club-left">
              <div className="surf-club-banner">
                <div className="banner">
                  A CURATED COLLECTION OF SURFBOARDS FOR SALE IN SUNNY LA
                </div>
              </div>
            </div>
            <div className="surf-club-right">
              {this.state.authenticated ? (
                <div className="board-wrap">
                  {this.state.sell ? (
                    <div>
                      {this.state.paid ? (
                        <div>
                        <div className="coming-soon">THANK YOU FOR YOUR PAYMENT</div>
                        <div style={{marginTop: '22px'}} className="coming-soon--sub"><b>Now What?</b></div>
                        <div style={{marginTop: '22px', maxWidth: '300px', marginLeft: 'auto', marginRight: 'auto'}} className="coming-soon--sub">
                          WE'LL REVIEW YOUR LISTING WITHIN 1-2 DAYS AND EMAIL YOU WHEN IT'S BEEN POSTED OR IF
                          WE HAVE ANY QUESTIONS.
                        </div>

                        <div style={{marginTop: '22px', maxWidth: '300px', marginLeft: 'auto', marginRight: 'auto'}} className="coming-soon--sub">
                          UNTIL THEN, <a href="https://new.surfline.com/surf-forecasts/south-los-angeles/58581a836630e24c4487900b" style={{color: 'black'}}>PRAY FOR WAVES
                           </a>
                          <br /> <div style={{marginTop: '12px'}}>🙏 🌊</div>
                        </div>

                        </div>
                      ) : (
                        <div>
                          <div className="coming-soon">SELL A BOARD</div>
                          <div
                            className="coming-soon--sub"
                            style={{
                              padding: '20px',
                              maxWidth: '400px',
                              paddingTop: '12px',
                              textAlign: 'center',
                              textAlignLast: 'center',
                            }}
                          >
                            HAVE A BOARD FOR SALE AND LIVE IN LA? WE CAN HELP
                            YOU SELL IT.
                            <div
                              style={{
                                marginTop: '22px',
                                borderBottom: '1px solid black',
                                width: '140px',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                              }}
                            >
                              <b>$1 PER BOARD</b>
                            </div>
                            <div
                              style={{
                                marginTop: '32px',
                                fontSize: '9px',
                                textTransform: 'capitalize',
                              }}
                            >
                              14 Day Listing, Daily Instagram Story, 1 Instagram
                              Post, 1 Facebook Post, 1 Push Notification, and a
                              Newsletter Listing.
                            </div>
                            <div
                              className="authentication__form"
                              style={{ marginTop: '0px' }}
                            >
                              <label className="label">YOUR NAME</label>
                              <input />

                              <label className="label">EMAIL</label>
                              <input />

                              <label className="label">SHAPER / MODEL</label>
                              <input />

                              <label className="label">LENGTH</label>
                              <input />

                              <label className="label">FIN COUNT</label>
                              <input type="number" />

                              <label className="label">PRICE</label>
                              <input type="number" />

                              <label className="label">LOCATION</label>
                              <input placeholder="Venice, Hermosa, etc." />

                              <label className="label">LINK TO PHOTOS</label>
                              <small style={{ marginBottom: '8px' }}>
                                (We'll pick the best one <br /> and touch it up)
                              </small>
                              <input placeholder="Dropbox, Google Drive, etc." />


                              <form
                                action="https://www.paypal.com/cgi-bin/webscr"
                                method="post"
                                target="_top"
                              >
                                <input
                                  type="hidden"
                                  name="cmd"
                                  value="_s-xclick"
                                />
                                <input
                                  type="hidden"
                                  name="hosted_button_id"
                                  value="79KFKZKVBFX7L"
                                />
                                <button name="submit" type="submit">CHECKOUT WITH PAYPAL</button>


                                <img
                                  alt=""
                                  border="0"
                                  src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif"
                                  width="1"
                                  height="1"
                                />
                              </form>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="coming-soon">WELCOME TO SURF CLUB</div>

                      <div
                        className="coming-soon--sub"
                        style={{
                          padding: '20px',
                          maxWidth: '400px',
                          paddingTop: '12px',
                          textAlign: 'center',
                          textAlignLast: 'center',
                        }}
                      >
                        WE CATALOGUE COLLECTIONS OF UNIQUE, ONE OF A KIND, OR
                        SIMPLY BEAUTIFUL SURFBOARDS FOR SALE IN LOS ANGELES.
                      </div>

                      {_.reverse(allBoards)}
                    </div>
                  )}
                </div>
              ) : (
                <div className="authentication">
                  <div className="authentication__form">
                    <div className="auth__title">BECOME A MEMBER</div>
                    <div className="auth__sub">
                      DISCOVER UNIQUE, ONE OF A KIND, OR SIMPLY BEAUTIFUL
                      SURFBOARDS FOR SALE IN LOS ANGELES
                    </div>
                    <div className="auth__btw">( IT’S 100% FREE, BTW. )</div>
                    <label className="auth__label">
                      JUST YOUR EMAIL PLEASE
                    </label>
                    <input
                      onChange={e =>
                        this.setState({
                          email: e.target.value,
                        })
                      }
                      type="text"
                    />
                    <button onClick={() => this.authenticateUser()}>
                      {this.state.loginButtonText}
                    </button>
                    {this.state.error ? (
                      <div className="error-msg">Please enter an email </div>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
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
