var DocChecker;
if (!DocChecker) DocChecker = {};

(function(ctx) {
    "use strict";

    const FORMAT_VERSION = 1;

    const document_info_sym = Symbol();

    var DocumentManager = class {
        constructor(map) {
            // {
            //    id: {
            //      "doc": Document,
            //      "status": "checked"
            //    }
            // }
            this[document_info_sym] = (map ? new Map(map) : new Map());
        }

        status(doc) {
            var id = doc.id;
            var saved_doc = this[document_info_sym].get(id);
            if (!saved_doc) {
                return "new";
            }

            if (doc.date.getTime() > saved_doc.doc.date.getTime()) {
                return "updated";
            }

            if (saved_doc.status === "checked") {
                return "checked";
            }

            return "unchecked";
        }

        updateStatus(doc, status) {
            this[document_info_sym].set(doc.id, { "doc": doc, "status": status });
            return this.save();
        }

        allDocuments() {
            return Array.from(this[document_info_sym].entries())
                .map(item => item[1].doc)
                .sort((a, b) => (b.date.getTime() - a.date.getTime()));
        }

        toJSON() {
            return {
                "class": "DocumentManager",
                "data": Array.from(this[document_info_sym].entries())
            }
        }

        save() {
            return new Promise((resolve, reject) => {
                chrome.storage.local.set({
                    "format_version": FORMAT_VERSION,
                    "DocumentManager": JSON.stringify(this)
                }, function() {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve();
                    }
                });
            });
        }

        ////////////////////////////////////////////////////////////////
        static load() {
            return new Promise(function(resolve, reject) {
                chrome.storage.local.get([ "format_version", "DocumentManager" ], function(items) {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                        return;
                    }

                    var dm;
                    switch (items.format_version) {
                      case 1:
                        dm = JSON.parse(items.DocumentManager,
                                        ctx.Misc.reviver([ DocumentManager, ctx.Document ]));
                        break;

                      default:
                        dm = new DocumentManager();
                        break;
                    }
                    resolve(dm);
                });
            });
        }

        static reviver(key, value) {
            if (!(value instanceof Object)) {
                return value;
            }

            if (value["class"] !== "DocumentManager") {
                return value;
            }

            return new DocumentManager(value["data"]);
        }
    };

    ctx.DocumentManager = DocumentManager;
})(DocChecker);
