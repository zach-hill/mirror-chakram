require('dotenv').config();
var chakram = require('chakram'), 
expect = chakram.expect,
assert = chakram.assert;


const utils = require('../utils');
const INPUT_DATA = require('../inputdata.json');
const WORKOUT_ID = 'h6TJfbTeTJa3Unxkpp4K9g';
const INVALID_HEADER_OPTIONS = {
    "headers": {
        "Cookie": "user_token=foobar"
    }
}

describe('Mirror API', function() {
    const BASE_URL = process.env.BASE_URL;

    var userToken;
    before(async function() {
        return utils.authLogin(process.env.MIRROR_EMAIL, process.env.MIRROR_PASSWORD)
        .then(function(response) {
            if(response.response.statusCode === 200) {
                userToken = "user_token=" + response.body.data.user_token;
                chakram.setRequestDefaults({
                    "headers": {
                        "Cookie": userToken
                    }
                })
            }
        });
    });

    describe('Auth endpoint tests', function() {

        it('should have returned a user_token', function() {
            return expect(userToken).to.not.be.equal(undefined);
        });

        it('should fail with invalid password', function() {
            return utils.authLogin(process.env.MIRROR_EMAIL, "foo").then(function(response) {
                return expect(response).to.have.status(400);
            });
        });

        it('should fail with an invalid user', function() {
            return utils.authLogin("fakeemail@fakedomain.com", "foo").then(function(response) {
                return expect(response).to.have.status(404);
            });
        });

        //This one works too good and now I'm banned and EVERYTHING FAILS

        /*
        it('should fail after too many login attempts', async function() {
            while(true) {
                var response = await utils.authLogin(process.env.MIRROR_EMAIL, "foo");
                if(response.response.statusCode === 403)
                    return expect(response).to.have.status(403);
            }
        })
        */
    });

    describe('Workout endpoint tests', function() {

        describe('/v1/workout tests', function() {
            it('should succeed with a valid token', function() {
                return chakram.get(BASE_URL + "v1/workout").then(function(response) {
                    expect(response).to.have.status(200);
                });
            });
    
            it('should fail with invalid token', function() {
                return chakram.get(BASE_URL + "v1/workout", INVALID_HEADER_OPTIONS).then(function(response) {
                    expect(response).to.have.status(401);
                });
            })

            it('should patch workout data', function() {
                var data = Object.assign(INPUT_DATA);
                data.completed_at = utils.unixTimestamp();
                return chakram.patch(BASE_URL + "v1/workout/" + WORKOUT_ID, data).then(function(response) {
                    expect(response).to.have.status(200);
                });
            });

            it('should not patch with invalid token', function() {
                var data = Object.assign(INPUT_DATA);
                data.completed_at = utils.unixTimestamp();
                return chakram.patch(BASE_URL + "v1/workout/" + WORKOUT_ID, data, INVALID_HEADER_OPTIONS).then(function(response) {
                    expect(response).to.have.status(401);
                });
            })

            it('PUT should be not allowed', function() {
                return chakram.put(BASE_URL + "v1/workout/" + WORKOUT_ID).then(function(response) {
                    expect(response).to.have.status(405);
                });
            })
        });

        describe('/v1/workout/completed tests', function() {
            it('should succeed with a valid token', function() {
                return chakram.get(BASE_URL + "v1/workout/completed").then(function(response) {
                    expect(response).to.have.status(200);
                });
            });

            it('should fail with an invalid token', function() {
                return chakram.get(BASE_URL + "v1/workout/completed", INVALID_HEADER_OPTIONS).then(function(response) {
                    expect(response).to.have.status(401);
                });
            })
        }); 
    });
});