var DocChecker;
if (!DocChecker) DocChecker = {};

(function(ctx) {
    "use strict";

    const root_sym = Symbol();

    var PageParser = class {
        constructor(root) {
            this[root_sym] = root;
        }

        findDocuments() {
            return this.findElements().map(elem => {
                try {
                    return {
                        "doc": this.parseElement(elem),
                        "elem": elem
                    };
                } catch (e) {
                    console.error(e);
                    return null;
                }
            }).filter(item => item);
        }

        findElements() {
            throw "Not implemented.";
        }

        parseElement() {
            throw "Not implemented.";
        }

        ////////////////////////////////////////////////////////////////
        static parser(root) {
            var parser_class = this.parser_list.find(parser => parser.match(root));
            if (!parser_class) {
                return null;
            }

            return new parser_class(root);
        };

        static registerParser(parser) {
            if (!this.parser_list) {
                this.parser_list = [];
            }

            this.parser_list.push(parser);
        };

        static match(root) {
            throw "Not implemented";
        }
    };

    var PageParserSample1 = class extends PageParser {
        findElements() {
            var elems = this[root_sym].getElementsByTagName("a");
            return Array.from(elems);
        }

        parseElement(elem) {
            var date = elem.querySelector(".date").textContent.split(", ");
            return new ctx.Document(parseInt(elem.getAttribute("id"), 10),
                                    elem.querySelector(".title").textContent,
                                    new Date(date[1] + " " + date[2] + ", " + date[0]));
        }

        static match(root) {
            return root.querySelector("h1").textContent.indexOf("Sample1") >= 0;
        }
    };

    var PageParserSample2 = class extends PageParser {
        findElements() {
            var elems = this[root_sym].getElementsByTagName("a");
            return Array.from(elems);
        }

        parseElement(elem) {
            var date = elem.nextSibling.nextSibling.textContent.split(", ");
            if (date.length != 3) {
                throw "Invalid date format";
            }
            return new ctx.Document(parseInt(elem.getAttribute("id"), 10),
                                    elem.querySelector(".title").textContent,
                                    new Date(date[1] + " " + date[2] + ", " + date[0]));
        }

        static match(root) {
            return root.querySelector("h1").textContent.indexOf("Sample2") >= 0;
        }
    };


    [ PageParserSample1, PageParserSample2 ].forEach(parser => PageParser.registerParser(parser));

    ctx.PageParser = PageParser;
})(DocChecker);
