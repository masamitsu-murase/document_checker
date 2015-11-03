var DocChecker;
if (!DocChecker) DocChecker = {};

(function(ctx) {
    "use strict";

    class UnsupportedPageError extends Error
    {
    }

    var decorate = function() {
        return new Promise(function(resolve, reject) {
            try {
                ctx.CheckButtonDecorator.clearAll();

                var manager = new ctx.DocumentManagerForwarder();
                var parser = ctx.PageParser.parser(document);
                if (!parser) {
                    reject(new UnsupportedPageError("This page is not supported."));
                    return;
                }

                var items = parser.findDocuments();
                var decorators = items.map(i => new ctx.CheckButtonDecorator(i.doc, i.elem, manager));

                Promise.all(decorators.map(i => i.decorateDocument())).then(resolve, reject);
            } catch (e) {
                reject(e);
            }
        });
    };

    var decorating = false;
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        switch (message.type) {
          case "decorate":
            {
                if (decorating) {
                    sendResponse("error");
                    return;
                }

                decorating = true;
                let async_call = true;
                ctx.Misc.async(function*() {
                    try {
                        yield decorate();
                        sendResponse();
                    } catch (e) {
                        if (e instanceof UnsupportedPageError) {
                            sendResponse("error");
                            alert(e.message);
                        } else {
                            sendResponse("error");
                            console.error(e);
                        }
                    }
                    decorating = false;
                    async_call = false;
                });
                return async_call;
            }

          default:
            {
                console.error("Unknown message");
                sendResponse();
                break;
            }
        }
    });
})(DocChecker);
