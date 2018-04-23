import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'

import Header from '../components/header'
import Board from '../components/board'
import BoardSample from '../components/BoardSample'
import './index.css'
import fire from '../fire'

class Layout extends PureComponent {
  constructor(props) {
    super(props)

    this.authenticateUser = this.authenticateUser.bind(this)

    this.state = {
      email: '',
      authenticated: false,
      error: '',
    }
  }

  authenticateUser() {
    // check if they are user..

    let emailEncoded = this.state.email

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
                  })
                }.bind(this)
              )
          }
        }.bind(this)
      )
  }

  componentDidMount() {
    // check if they've signed up and we've got it stored already..

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
          name={board.node.boardName}
          fins={board.node.finCount}
          location={board.node.location}
          photo={board.node.photo.file.url}
          price={board.node.price}
          shopEmail={board.node.shopEmail}
          shopPhone={board.node.shopPhone}
          shopName={board.node.shopName}
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
          style={{
            margin: '0 auto',
            maxWidth: 1600,
            paddingTop: 0,
          }}
        >
          <div className="surf-club-wrap">
            <div className="nav">
              <img
                style={{ height: '50px', marginBottom: '0px' }}
                src={require('../srflogonew_1@2x.png')}
              />
              <a
                className="insta-link"
                target="_blank"
                href="https://www.instagram.com/surfclub.la/"
              >
                INSTA
              </a>
            </div>

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
                  <div className="coming-soon">MARK YOUR CALENDAR</div>
                  <div className="coming-soon--sub" style={{width: '280px'}}>
                    We're busy onboarding a few more shops and will be
                    live May 5th.
                  </div>
                  <div
                    className="coming-soon--sub"
                    style={{
                      color: '#cccccc',
                      marginBottom: '40px',
                      marginTop: '20px',
                    }}
                  >
                    In the meantime{' '}
                    <a
                      style={{ color: 'black' }}
                      target="_blank"
                      href="https://new.surfline.com/surf-forecasts/south-los-angeles/58581a836630e24c4487900b"
                    >
                      {' '}
                      pray for waves
                    </a>
                  </div>

                  <BoardSample />
                  <BoardSample />
                  <BoardSample />
                  <BoardSample />
                  <BoardSample />
                  <BoardSample />
                  <BoardSample />
                  <BoardSample />
                  <BoardSample />
                  <BoardSample />
                  <BoardSample />
                  <BoardSample />
                  <BoardSample />
                  <BoardSample />
                  <BoardSample />
                  <BoardSample />
                  <BoardSample />
                  <BoardSample />
                  <BoardSample />
                  <BoardSample />
                </div>
              ) : (
                <div className="authentication">
                  <div className="authentication__form">
                    <div className="auth__title">BECOME A MEMBER</div>
                    <div className="auth__sub">
                      DISCOVER UNIQUE, ONE OF A KIND, OR SIMPLY BEATIFUL
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
                      Enter Site
                    </button>
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
          shopName
          boardName
          photo {
            id
            file {
              url
            }
          }
          finCount
          price
          location
          shopPhone
          shopEmail
        }
      }
    }
  }
`
