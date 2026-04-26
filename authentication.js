module.exports = { 
    type: "oauth2", 
    test: {},
    oauth2config: {
        authorizeUrl: {
            method: "GET",
            url: "{{process.env.BASE_URL}}/auth/login",
            params: {
                client_id: "{{process.env.CLIENT_ID}}",
                redirect_uri: "{{bundle.inputData.redirect_uri}}",
                response_type: "code",
                state: "{{bundle.inputData.state}}"
            },
        },
        getAccessToken: {
            method: "POST",
            url: "{{process.env.BASE_URL}}/auth/token",
            body: {
                client_id: "{{process.env.CLIENT_ID}}",
                client_secret: "{{process.env.CLIENT_SECRET}}",
                redirect_uri: "{{bundle.inputData.redirect_uri}}",
                grant_type: "authorization_code"
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json"
            }
        },
        refreshAccessToken: {
            method: "POST",
            url: "{{process.env.BASE_URL}}/api/refresh_token",
            params: {
                refresh_token: "{{bundle.authData.refresh_token}}",
                grant_type: "refresh_token"
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json"
            }
        }
    }
};