const defaultHeaders = { "Content-Type": "application/json" };

module.exports = function responseHandler(method) {
  return function() {
    var [request, response, ...args] = Array.from(arguments);
    var scope = {
      request,
      response
    };

    method.apply(
      null,
      [scope].concat(args).concat(function(error, result) {
        var code, status;

        if (error) {
          var message = "An error occured";
          var code = 500;
          if (error.code) {
            code = error.code;
            message = error.message;
          }
          status = error.status || "ERROR";
          response.writeHead(code, defaultHeaders);
          response.end(
            JSON.stringify({
              status,
              data: message
            })
          );
          return;
        }

        code = result.code || 200;
        status = result.status || "SUCCESS";

        response.writeHead(code, defaultHeaders);
        response.write(
          JSON.stringify({
            ...result,
            status
          })
        );
        response.end();
      })
    );
  };
};
