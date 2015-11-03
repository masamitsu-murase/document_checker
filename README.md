# Document Checker

This is a Chrome extension to check the update of documents.

Some companies release many documents in a Web page.  
This extension adds "Check" buttons to the Web page so that we can manage which document has already been checked.

You have to implement `page_parser.js` to parse your Web page as follows:
```js
    // Extend PageParser and override
    //   - PageParser.prototype.findElements
    //   - PageParser.prototype.parseElement
    //   - PageParser.match
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

    // Then, register PageParserSample1.
    PageParser.registerParser(PageParserSample1);
```

## License

Please refer to LICENSE.txt.

