"use strict";

var avatarCache = {};

module.exports = function(nodecg) {
  const twitchApi = nodecg.extensions["lfg-twitchapi"];

  function fetchUserAvatar(username, callback) {
    if (avatarCache.hasOwnProperty(username)) {
      callback(avatarCache[username]);
      return;
    }

    twitchApi
      .get("/users?login=" + username, {})
      .then(response => {
        if (response.statusCode !== 200) {
          nodecg.log.error(response.body.error, response.body.message);
          return;
        }

        nodecg.log.info("Fetched avatar for " + username + " from Twitch");
        if (response.body.data.length === 0) {
          nodecg.log.error(`Could not fetch avatar for ${username}`);
          return;
        }
        var avatar = response.body.data[0].profile_image_url;
        avatarCache[username] = avatar;
        callback(avatar);
      })
      .catch(err => {
        nodecg.log.error(err);
      });
  }

  return fetchUserAvatar;
};
