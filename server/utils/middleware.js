var R = require('ramda');

/*
 * Middleware to migrate users from fragmented challenge structure to unified
 * challenge structure
 *
 * @param req
 * @param res
 * @returns null
 */
exports.userMigration = function userMigration(req, res, next) {
  if (!req.user || req.user.completedChallenges.length !== 0) {
    return next();
  }
  req.user.completedChallenges = R.filter(function (elem) {
    // getting rid of undefined
    return elem;
  }, R.concat(
      req.user.completedCoursewares,
      req.user.completedBonfires.map(function (bonfire) {
        return ({
          completedDate: bonfire.completedDate,
          id: bonfire.id,
          name: bonfire.name,
          completedWith: bonfire.completedWith,
          solution: bonfire.solution,
          githubLink: '',
          verified: false,
          challengeType: 5
        });
      })
    )
  );
  return next();
};
