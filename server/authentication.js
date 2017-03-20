const { isProduction } = require( './config' )

const init = function( expressApp, config ) {
  const {
    addUserToRequestFromJWT
  } = require('@learnersguild/idm-jwt-auth/lib/middlewares')

  if( !isProduction()) {
    process.env.JWT_PUBLIC_KEY = config.auth.JWT_PUBLIC_KEY
  }

  expressApp.use( addUserToRequestFromJWT )
  const ensureUserLoggedIn = ( req, res, next ) => {
    const redirectTo = encodeURIComponent( config.host_fully_qualified )
    if ( !req.user ) {
      return res.redirect( `${config.auth.IDM_BASE_URL}/sign-in?redirect=${redirectTo}` )
    }
    next()
  }
  expressApp.use( ensureUserLoggedIn )
}

module.exports = { init }
