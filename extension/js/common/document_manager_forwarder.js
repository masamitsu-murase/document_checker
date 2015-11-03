var DocChecker;
if (!DocChecker) DocChecker = {};

(function(ctx) {
    "use strict";

    var sendMessage = function(method, args) {
        return new Promise(function(resolve, reject) {
            var obj = {
              method: method,
              args: JSON.stringify(args)
            };

            chrome.runtime.sendMessage(obj, (ret) => {
                if (ret["error"]) {
                    reject(ret["return"]);
                } else {
                    resolve(JSON.parse(ret["return"], ctx.Misc.reviver([ ctx.Document ])));
                }
            });
        });
    };

    // If Proxy can be used, rewrite this class.
    var DocumentManager = class {
    };
    [ "allDocuments", "status", "updateStatus" ].forEach((method) => {
        DocumentManager.prototype[method] = function() {
            return sendMessage(method, Array.from(arguments));
        };
    });

    ctx.DocumentManagerForwarder = DocumentManager;
})(DocChecker);
