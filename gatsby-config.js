module.exports = {
  siteMetadata: {
    title: 'Gatsby Default Starter',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
    resolve: `gatsby-source-contentful`,
    options: {
      spaceId: `cn4bn1z4mmvm`,
      accessToken: `89f445937699f5cd53910a8589e655ef64a9ba2f7213a9345aa58598ecc3b347`,
    },
  },
  ],
}
