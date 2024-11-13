require('dotenv').config();

const axios = require('axios');

let cachedToken = null;
let tokenExpiry = null;

const getAzureToken = async () => {
    // Return cached token if still valid
    if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
        return cachedToken;
    }

    const tenantId = process.env.REACT_APP_AZURE_TENANT_ID;
    const clientId = process.env.REACT_APP_AZURE_CLIENT_ID;
    const scope = process.env.REACT_APP_AZURE_SCOPE;

    console.log('!!!!Azure Auth Debug:', {
        tenantId,
        clientId,
        scope,
        username: process.env.DOMAIN_USER,
        url: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`
    });

    const params = new URLSearchParams({
        grant_type: 'password',
        client_id: clientId,
        scope: scope,
        username: process.env.DOMAIN_USER,
        password: process.env.DOMAIN_PASSWORD
    });

    console.log('Request params:', params.toString());

    const response = await axios.post(
        `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
        params,
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );
    
    cachedToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in * 1000);
    
    return cachedToken;
};
module.exports = {
    getAzureToken
};
