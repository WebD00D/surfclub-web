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
        <script src="https://use.fontawesome.com/e197efd770.js" />

        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function(p,u,s,h){
                p._pcq=p._pcq||[];
                p._pcq.push(['_currentTime',Date.now()]);
                s=u.createElement('script');
                s.type='text/javascript';
                s.async=true;
                s.src='https://cdn.pushcrew.com/js/afdedadfa7941ed085b14be78480d7a3.js';
                h=u.getElementsByTagName('script')[0];
                h.parentNode.insertBefore(s,h);
            })(window,document);
          `,
          }}
        />
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
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=UA-118033416-1"
        />
        <link rel="stylesheet" href="https://use.typekit.net/lct0zqh.css" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'UA-118033416-1');

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
