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


import ReactMarkdown from 'react-markdown';

import ReactGA from 'react-ga'

class Layout extends PureComponent {
  constructor(props) {
    super(props)

    this.authenticateUser = this.authenticateUser.bind(this)
    this.getUrlVars = this.getUrlVars.bind(this)
    this.setDetails = this.setDetails.bind(this)

    this.setPreview = this.setPreview.bind(this)

    this.state = {
      email: '',
      authenticated: true,
      error: '',
      loginButtonText: 'Enter Site',
      sell: false,
      paid: false,

      headline: '',
      brand: 'brand',
      photo: 'photo',
      name: 'name',
      productLink: 'productLink',
      description: 'description',
      price: 'price',
      listDate: 'listdate',
      productType: '',
      spotify: '',
      longDescription: "",

      menuHidden: true,

      loaderOpacity: '1',
      photoOpacity: '0',
      opacity: '0',
      loaderOpacity: '1',

      previewPhoto: '',
      previewOpacity: '0',
    }
  }

  componentDidMount() {

    ReactGA.initialize('UA-118033416-1')

    ReactGA.initialize('UA-118033416-1', {
      debug: true,
      titleCase: false,
    })

    ReactGA.pageview(window.location.pathname + window.location.search)
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

  setDetails(
    headline,
    brand,
    photo,
    name,
    productLink,
    description,
    price,
    listdate,
    productType,
    spotify,
    longDescription
  ) {
    ReactGA.event({
      category: 'PRODUCT CLICK',
      action: `User viewed a board`,
    })

    window.scrollTo(0, 0)

    console.log(longDescription)

    this.setState({
      opacity: '0',
      menuHidden: !this.state.menuHidden,
      headline: headline,
      brand: brand,
      photo: photo,
      name: name,
      productLink: productLink,
      description: description,
      price: price,
      listDate: listdate,
      productType: productType,
      spotify: spotify,
      longDescription: longDescription
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

  setPreview(photo) {
    this.setState({ previewPhoto: photo, previewOpacity: '1' })

    setTimeout(
      function() {
        this.setState({
          previewOpacity: '0',
        })
      }.bind(this),
      100
    )
  }

  render() {
    const boards = this.props.data.allContentfulProductPost.edges

    let boardList = boards.map(
      function(board, idx) {
        return (
          <Board
            key={board.node.id}
            handleMouseOver={() =>
              this.setPreview(board.node.productImage.file.url)
            }
            handleMouseOut={() => this.setState({ previewPhoto: '' })}
            handleClick={() =>


              {
              let longDescription = '';

              if (board.node.longDescription !== null) {
                longDescription = board.node.longDescription.longDescription;
              }


              this.setDetails(
                board.node.headline,
                board.node.brand,
                board.node.productImage.file.url,
                board.node.productName,
                board.node.purchaseLink,
                board.node.description,
                board.node.price,
                board.node.createdAt,
                board.node.productType.type,
                board.node.spotifyEmbedCode,
                longDescription
              )
            }
            }
            id={board.node.id}
            headline={board.node.headline}
            brand={board.node.headline}
            photo={board.node.productImage.file.url}
            productName={board.node.productName}
            purchaseLink={board.node.purchaseLink}
            description={board.node.description}
            price={board.node.price}
            productType={board.node.productType.type}
            listDate={board.node.createdAt}
            spotify={board.node.spotifyEmbedCode}
            featured={board.node.featured}

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
            {
              name: 'description',
              content:
                'A curated buyers guide for beautifully designed surfboards and surf inspired goods',
            },
            {
              name: 'keywords',
              content:
                'surf, surfing, surboard, surfboards, buyers guide, collections',
            },
          ]}
        />

        <div className="site-wrapper">
          <div className="brand-column">
            <div className="brand-logo">SURF CLUB 서프 클럽</div>
            <div className="brand-byline">
              A curated buyers guide for beautifully designed surfboards and
              surf inspired goods
            </div>

            <div className="flex-wrap">
              {this.state.authenticated ? (
                <ReactGA.OutboundLink
                  eventLabel="List a Board Clicked"
                  to="https://surfclub.typeform.com/to/O2TMlF"
                  target="_blank"
                  className="brand-byline"
                  style={{ color: 'blue', paddingRight: '0px' }}
                >
                  LIST A BOARD
                </ReactGA.OutboundLink>
              ) : (
                ''
              )}

              <ReactGA.OutboundLink
                eventLabel="Went to our INSTA"
                to="https://www.instagram.com/joinsurfclub/"
                target="_blank"
                className="brand-byline"
                style={{ color: 'blue' }}
              >
                INSTA
              </ReactGA.OutboundLink>
            </div>

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
                <div className="board-list">
                  {boardList}

                  {this.state.previewPhoto ? (
                    <div
                      style={{
                        backgroundImage: `url(${this.state.previewPhoto})`,
                      }}
                      className="board-preview"
                    >
                      <div
                        className="board-preview-mask"
                        style={{ opacity: this.state.previewOpacity }}
                      >
                        <div
                          className="board-detail--date spin-me"
                          style={{
                            color: 'black',
                            fontSize: '10px',
                            textAlign: 'center',
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              ) : (
                <div className="board-details">
                  <div className="board-detail--date">
                    {this.state.listDate}
                  </div>
                  <div className="board-detail--name">
                    {this.state.headline}
                  </div>
                  <div
                    className="board-meta"
                    style={{
                      marginBottom: '14px',
                      marginTop: '0px',
                      maxWidth: '600px',
                      paddingLeft: '0px',
                    }}
                  >
                    <div>{this.state.description} </div>
                  </div>
                  <div
                    className="board-meta"
                    style={{
                      marginBottom: '14px',
                      marginTop: '0px',
                      maxWidth: '600px',
                      paddingLeft: '0px',
                    }}
                  >
                    <div><ReactMarkdown source={this.state.longDescription} /> </div>
                  </div>
                  <div className="board-meta-wrap">
                    {this.state.productType === 'MUSIC' ? (
                      <iframe
                        src={this.state.spotify}
                        width="300"
                        height="380"
                        frameBorder="0"
                        allowTransparency="true"
                      />
                    ) : (
                      <div
                        className="board-photo"
                        style={{
                          backgroundImage: `url(${this.state.photo})`,
                          opacity: this.state.opacity,
                        }}
                      />
                    )}

                    <div
                      className="loader"
                      style={{ zIndex: 1, opacity: this.state.loaderOpacity }}
                    />
                    <div className="board-meta">
                      <div>{this.state.price} </div>
                      <div>{this.state.brand}</div>
                      <div>{this.state.name}</div>

                      {this.state.spotify ? (
                        <div>
                          <ReactGA.OutboundLink
                            eventLabel="Product Purchase Link Clicked"
                            to={this.state.spotify}
                            target="_blank"
                            style={{ color: 'blue' }}
                          >
                            LISTEN
                          </ReactGA.OutboundLink>
                        </div>
                      ) : (
                        <div>

                          { this.state.productLink ? <ReactGA.OutboundLink
                            eventLabel="Product Purchase Link Clicked"
                            to={this.state.productLink}
                            target="_blank"
                            style={{ color: 'blue' }}
                          >
                            BUY IT
                          </ReactGA.OutboundLink> : "" }

                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="content content-auth" />
          )}

          <a target="_blank" href="https://www.instagram.com/joinsurfclub/">
            <div className="filter-bar">
              HAVE A PRODUCT TO FEATURE? SLIDE INTO OUR DMS.
            </div>
          </a>
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

  allContentfulProductPost {
    edges {
      node {
        id
        headline
        brand
        productName
        purchaseLink
        description
        featured
        longDescription {
          id
          longDescription
        }
        productType {
          type
        }
        productImage {
          id
          file {
            url
          }
        }
      }
    }
  }
}

`
