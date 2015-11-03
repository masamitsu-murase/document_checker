var DocChecker;
if (!DocChecker) DocChecker = {};

(function(ctx) {
    "use strict";

    const id_sym = Symbol();
    const title_sym = Symbol();
    const date_sym = Symbol();
    var Document = class {
        constructor(id, title, date) {
            this[id_sym] = id;
            this[title_sym] = title;
            this[date_sym] = date;
        }

        get id() {
            return this[id_sym];
        }

        get title() {
            return this[title_sym];
        }

        get date() {
            return this[date_sym];
        }

        toJSON() {
            return {
                "class": "Document",
                "id": this.id,
                "title": this.title,
                "date": this.date.toUTCString()
            };
        }

        ////////////////////////////////////////////////////////////////
        static reviver(key, value) {
            if (!(value instanceof Object)) {
                return value;
            }

            if (value["class"] !== "Document") {
                return value;
            }

            return new Document(value.id, value.title, new Date(value.date));
        }
    };

    ctx.Document = Document;
})(DocChecker);
