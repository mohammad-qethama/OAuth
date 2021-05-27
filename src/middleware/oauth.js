'use strict';

require('dotenv').config();
const superagent = require('superagent');
/***
 * required @superagent to cummunicate with the OAuth api
 * dotenv required and configed to use .env parameters
***/
const User = require('../auth/models/users.js');
const tokenServerUrl =  'https://www.linkedin.com/oauth/v2/accessToken';

const accessAPI = 'https://api.linkedin.com/v2/me';

const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CLIENT_ID = process.env.CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;



module.exports = async (req, res, next) => {

  try {

    const code = req.query.code;
    const remoteToken = await exchangeCodeForToken(code);
    const remoteUser = await getRemoteUserInfo(remoteToken);
    const [user, token] = await getUser(remoteUser);
    console.log('after save to db', user, token);
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    next(error.message);
  }
};
async function exchangeCodeForToken(code){
  console.log( 'code', code);
  try{
    const tokenResponse = await superagent.post(tokenServerUrl).type('form').send(
      {
        grant_type: 'authorization_code',
        code: code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,

      });

    console.log('responseTokenBody',tokenResponse.body);
    const accessToken = tokenResponse.body.access_token;
    console.log('aT',{accessToken});
    return accessToken;}catch (error) {
    console.error('errorinfun',error);
  }

}
// async function exchangeCodeForToken(code) {
//   const tokenResponse = await superagent.post(tokenServerUrl).send({
//     code: code,
//     client_id: CLIENT_ID,
//     client_secret: CLIENT_SECRET,
//     redirect_uri: REDIRECT_URI,
//     grant_type: 'authorization_code',
//   });
//   const accessToken = tokenResponse.body.access_token;
//   return accessToken;
// }

async function getRemoteUserInfo(token) {
  const userResponse = await superagent.get(accessAPI)
    .set('Authorization', `Bearer ${token}`)
    .set('user-agent', 'express-app');

  const user = userResponse.body;
  return user;
}


async function getUser(remoteUser) {
  const user = {
    username: remoteUser.localizedFirstName,
    password: 'this_should_be_empty',
  };

  const userObj = new User(user);
  const userDoc = userObj.save();

  const token = userDoc.token;
  return [user, token];
}
