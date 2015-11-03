var DocChecker;
if (!DocChecker) DocChecker = {};

(function(ctx) {
    "use strict";

    const STYLE_CLASS_MAP = {
        "updated": "doc_checker_updated",
        "checked": "doc_checker_checked",
        "new":     "doc_checker_new"
    };
    const BUTTON_CLASS = "doc_checker_button";
    const CHECK_BUTTON_CLASS = "doc_checker_check_button";
    const UNCHECK_BUTTON_CLASS = "doc_checker_uncheck_button";

    const doc_sym = Symbol();
    const elem_sym = Symbol();
    const manager_sym = Symbol();
    const style_sym = Symbol();

    var CheckButtonDecorator = class {
        constructor(doc, elem, manager) {
            this[doc_sym] = doc;
            this[elem_sym] = elem;
            this[manager_sym] = manager;
            this[style_sym] = null;
        }

        get doc() {
            return this[doc_sym];
        }

        get manager() {
            return this[manager_sym];
        }

        decorateDocument() {
            var self = this;
            return ctx.Misc.async(function*() {
                var style = null;
                switch (yield self.manager.status(self.doc)) {
                  case "updated":
                  case "unchecked":
                    style = "updated";
                    break;
                  case "checked":
                    style = "checked";
                    break;
                  case "new":
                    style = "new";
                    break;
                }
                self.setStyle(style);
            });
        }

        setStyle(style) {
            if (Object.keys(STYLE_CLASS_MAP).indexOf(style) < 0) {
                throw "Invalid style: " + style;
            }

            this[style_sym] = style;
            for (var i in STYLE_CLASS_MAP) {
                if (i === style) {
                    this[elem_sym].classList.add(STYLE_CLASS_MAP[i]);
                } else {
                    this[elem_sym].classList.remove(STYLE_CLASS_MAP[i]);
                }
            }

            if (style === "updated" || style === "new") {
                this.addCheckButton();
            } else {
                this.addUncheckButton();
            }
        }

        addButton(text, add, remove) {
            // Remove unnecessary buttons.
            var buttons = this[elem_sym].getElementsByClassName(remove);
            Array.from(buttons).forEach(button => button.parentNode.removeChild(button));

            buttons = this[elem_sym].getElementsByClassName(add);
            if (buttons.length > 0) {
                return buttons[0];
            }

            // Add button.
            var button = document.createElement("button");
            button.appendChild(document.createTextNode(text));
            button.classList.add(add, BUTTON_CLASS);
            this[elem_sym].appendChild(button);

            return button;
        }

        addCheckButton() {
            var button = this.addButton("Check", CHECK_BUTTON_CLASS, UNCHECK_BUTTON_CLASS);
            button.addEventListener("click", (e) => { e.preventDefault(); this.check(); }, false);
        }

        addUncheckButton() {
            var button = this.addButton("Uncheck", UNCHECK_BUTTON_CLASS, CHECK_BUTTON_CLASS);
            button.addEventListener("click", (e) => { e.preventDefault(); this.uncheck(); }, false);
        }

        updateStatus(status) {
            var button = this[elem_sym].getElementsByClassName(BUTTON_CLASS)[0];
            if (button) {
                button.disabled = true;
            }

            var self = this;
            return ctx.Misc.async(function*() {
                yield self.manager.updateStatus(self.doc, status);
                self.decorateDocument();
            });
        }

        check() {
            return this.updateStatus("checked");
        }

        uncheck() {
            return this.updateStatus("unchecked");
        }

        ////////////////////////////////////////////////////////////////
        static clearAll() {
            Object.keys(STYLE_CLASS_MAP).forEach((k) => {
                var elems = document.getElementsByClassName(STYLE_CLASS_MAP[k]);
                Array.from(elems).forEach(elem => elem.classList.remove(STYLE_CLASS_MAP[k]));
            });

            [ CHECK_BUTTON_CLASS, UNCHECK_BUTTON_CLASS ].forEach((class_name) => {
                var elems = document.getElementsByClassName(class_name);
                Array.from(elems).forEach(elem => elem.parentNode.removeChild(elem));
            });
        }
    };

    ctx.CheckButtonDecorator = CheckButtonDecorator;
})(DocChecker);

