'use strict';

// GET https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id={your_client_id}&redirect_uri={your_callback_url}&state=foobar&scope=r_liteprofile%20r_emailaddress%20w_member_social

const authorizeUrl = 'https://www.linkedin.com/oauth/v2/authorization';
const options = {
  response_type:'code',
  client_id: '77kuxl6dv41crm',
  redirect_uri: 'https://oauth-maq.herokuapp.com/oauth',
  state: 'some_random_string',
  scope: 'r_liteprofile',
};

const queryString = Object.keys(options)
  .map((key) => {
    return `${key}=${encodeURIComponent(options[key])}`;
    // client_id=f99cc8c339968475c82d&scope=readEncodeColon&state=some_randome_string
    // response_type=code&client_id=77kuxl6dv41crm&redirect_uri=http%3A%2F%2Flocalhost.com%2F3000%2Foauth&state=some_random_string&scope=read%3Auser
  }).join('&');

console.log('query string: ', queryString);

const authUrl = `${authorizeUrl}?${queryString}`;
const a = document.getElementById('oauth');
a.setAttribute('href', authUrl);
