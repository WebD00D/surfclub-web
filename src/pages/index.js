import React, { Component } from 'react'
import Link from 'gatsby-link'

import ReactMarkdown from 'react-markdown';




class IndexPage extends Component {
  constructor(props) {
    super(props)

  }

  componentWillMount() {
    // const boards = this.props.data.allContentfulBoard.edges

  }

  render(data) {
    console.log("PROPS", data)

    return (
      <div>
      Page 2
    </div>)
  }
}

// <h3>Intro</h3>
// <ReactMarkdown escapeHtml={false} skipHtml={false} source={this.state.intro.lessonContent.lessonContent} />
// <h3>Rules</h3>
// <ReactMarkdown escapeHtml={false} skipHtml={false} source={this.state.rules.lessonContent.lessonContent} />



export default IndexPage
