var DocChecker;
if (!DocChecker) DocChecker = {};

(function(ctx) {
    "use strict";

    var document_manager = null;
    var dm_promise = ctx.DocumentManager.load();

    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        var async_call = true;
        ctx.Misc.async(function*() {
            try {
                document_manager = (document_manager || (yield dm_promise));

                var method = message.method;
                var args = JSON.parse(message.args, ctx.Misc.reviver([ ctx.Document ]));

                var ret = document_manager[method].apply(document_manager, args);
                if (ret instanceof Promise) {
                    ret = yield ret;
                }

                if (ret === undefined) {
                    ret = null;  // 'undefined' cannot be converted to JSON string.
                }
                sendResponse({ "error": false, "return": JSON.stringify(ret) });
            } catch (e) {
                console.error(e);
                sendResponse({ "error": true, "return": e });
            }
            async_call = false;
        });
        return async_call;
    });

    chrome.browserAction.onClicked.addListener(function(tab) {
        chrome.tabs.sendMessage(tab.id, { type: "decorate" }, function() {
        });
    });
})(DocChecker);
