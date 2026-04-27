module.exports = {
  type: 'oauth2',
  test: { url: '{{process.env.NGROK_AUTH_URL}}/api/get_user_info' },
  oauth2Config: {
    authorizeUrl: {
      url: '{{process.env.NGROK_AUTH_URL}}/api/auth/login',
      params: {
        name: '{{bundle.inputData.name}}',
        client_id: '{{process.env.CLIENT_ID}}',
        state: '{{bundle.inputData.state}}',
        redirect_uri: '{{bundle.inputData.redirect_uri}}',
        response_type: 'code',
      },
    },
    getAccessToken: {
      body: {
        code: '{{bundle.inputData.code}}',
        client_id: '{{process.env.CLIENT_ID}}',
        client_secret: '{{process.env.CLIENT_SECRET}}',
        grant_type: 'authorization_code',
        redirect_uri: '{{bundle.inputData.redirect_uri}}',
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        accept: 'application/json',
      },
      method: 'POST',
      url: '{{process.env.NGROK_AUTH_URL}}/api/auth/token',
    },
    refreshAccessToken: {
      body: {
        refresh_token: '{{bundle.authData.refresh_token}}',
        grant_type: 'refresh_token',
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        accept: 'application/json',
      },
      method: 'POST',
      url: '{{process.env.BASE_URL}}/api/auth_refresh/',
    },
    autoRefresh: true,
  },
  fields: [],
};
