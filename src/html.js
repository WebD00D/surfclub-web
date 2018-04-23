import React from 'react'
import Helmet from 'react-helmet'

let stylesStr
if (process.env.NODE_ENV === 'production') {
  try {
    stylesStr = require('!raw-loader!../public/styles.css')
  } catch (e) {
    console.log(e)
  }
}

module.exports = props => {
  let css
  if (process.env.NODE_ENV === 'production') {
    css = (
      <style
        id="gatsby-inlined-css"
        dangerouslySetInnerHTML={{ __html: stylesStr }}
      />
    )
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {props.headComponents}
        {css}
        <link
          href="https://fonts.googleapis.com/css?family=Work+Sans:400,500,700"
          rel="stylesheet"
        />
        <script src="https://use.fontawesome.com/9aa665cf7f.js" />
      </head>
      <body className="sans-serif black">
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function(w, d){
             var id='embedly-platform', n = 'script';
             if (!d.getElementById(id)){
               w.embedly = w.embedly || function() {(w.embedly.q = w.embedly.q || []).push(arguments);};
               var e = d.createElement(n); e.id = id; e.async=1;
               e.src = ('https:' === document.location.protocol ? 'https' : 'http') + '://cdn.embedly.com/widgets/platform.js';
               var s = d.getElementsByTagName(n)[0];
               s.parentNode.insertBefore(e, s);
             }
            })(window, document);
          `,
          }}
        />

        <div className="site-wrapper">
          <div
            id="___gatsby"
            dangerouslySetInnerHTML={{ __html: props.body }}
          />
          {props.postBodyComponents}
        </div>
      </body>
    </html>
  )
}
