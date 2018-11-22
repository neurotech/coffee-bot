var test = require('tape');
var proxyquire = require('proxyquire');

test('buildCoffeeResponse', function(t){
    t.plan(2);

    var buildCoffeeResponse = proxyquire('../coffee', { 'tiny-json-http': {
        get: (options, callback) => {
            if(options.url === 'image'){
                return callback(null, 'image');
            }

            if(~options.url.indexOf('unsplash')){
                return callback(null, {
                    statusCode: 302,
                    headers: {
                        location: 'image'
                    }
                });
            }

            if(~options.url.indexOf('giphy')){
                return callback(null, {
                    statusCode: 200,
                    data: {
                        images: {
                            downsized_large: {
                                url: 'image'
                            }
                        }
                    }
                });
            }

            if(~options.url.indexOf('profile')){
                t.ok('requested profile');
                return callback(null, {
                    body: {
                        profile: {
                            display_name_normalized: 'foo'
                        }
                    }
                });
            }

            t.fail('unexpected request');
        },
        post: (options, callback) => {
            t.equal(options.data.response_type, 'in_channel', 'Got expected payload')
            callback(null, {})
        }
    } }).buildCoffeeResponse;

    buildCoffeeResponse({
        response_url: 'abc',
        user_id: 123
    })
});