const authorizeUrl = async (z, bundle) => {
  const crypto = z.require("crypto");

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const state = bundle.inputData.state;
  const redirectUri = bundle.inputData.redirect_uri;

  const payload = `${clientId}:${state}:${redirectUri}:${timestamp}`;

  const signature = crypto
    .createHmac("sha256", clientSecret)
    .update(payload)
    .digest("hex");

  const url =
    `${process.env.NGROK_URL}/authorize/` +
    `?client_id=${clientId}` +
    `&state=${state}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&timestamp=${timestamp}` +
    `&signature=${signature}`;

  return url;
};

const getAccessToken = async (z, bundle) => {
  const options = {
    url: `${process.env.NGROK_URL}/token/`,
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      accept: "application/json",
    },
    params: {},
    body: {
      code: bundle.inputData.code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "authorization_code",
      redirect_uri: bundle.inputData.redirect_uri,
    },
    removeMissingValuesFrom: {
      body: false,
      params: false,
    },
  };

  return z.request(options).then((response) => {
    const results = response.json;
    return results;
  });
};

const refreshAccessToken = async (z, bundle) => {
  const options = {
    url: `${process.env.NGROK_URL}/auth_refresh/`,
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      accept: "application/json",
    },
    params: {},
    body: {
      token: bundle.authData.refresh_token,
      grant_type: "refresh_token",
    },
    removeMissingValuesFrom: {
      body: false,
      params: false,
    },
  };

  return z.request(options).then((response) => {
    const data = response.json;
    const results = {
      access_token: data.access_token ?? "",
      refresh_token: data.refresh ?? "",
    };
    return results;
  });
};

module.exports = {
  type: "oauth2",
  test: { url: "{{process.env.NGROK_URL}}/get_user_info" },
  oauth2Config: {
    authorizeUrl: authorizeUrl,
    getAccessToken: getAccessToken,
    refreshAccessToken: refreshAccessToken,
    autoRefresh: true,
    scope:
      "deal.read, deal.write, project.read, project.write, company.read, company.write, contact.read, contact.write, template.read, template.write, user.read, user.write",
  },
  fields: [],
  connectionLabel: "{{bundle.inputData.name}} ({{bundle.inputData.email}})",
};
