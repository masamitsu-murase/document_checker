var DocChecker;
if (!DocChecker) DocChecker = {};

(function(ctx) {
    "use strict";

    var onload = function() {
        ctx.Misc.async(function*() {
            var manager = new ctx.DocumentManagerForwarder();
            var all_documents = yield manager.allDocuments();

            var elem = document.getElementById("doc_list");
            all_documents.forEach(doc => {
                var tr = document.createElement("tr");

                var td = document.createElement("td");
                td.appendChild(document.createTextNode(`${doc.id}`));
                tr.appendChild(td);

                td = document.createElement("td");
                td.appendChild(document.createTextNode(doc.title));
                tr.appendChild(td);

                td = document.createElement("td");
                td.appendChild(document.createTextNode(`${doc.date.getFullYear()}-${doc.date.getMonth() + 1}-${doc.date.getDate()}`));
                tr.appendChild(td);

                elem.appendChild(tr);
            });
        });
    };

    document.addEventListener("DOMContentLoaded", onload);
})(DocChecker);
