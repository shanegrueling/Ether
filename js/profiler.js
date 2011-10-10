window.addEventListener('load', function() {
    var btn = document.createElement('button');
    btn.addEventListener('click', function() {
        var profiler = window.open("", "Profiler", "width=500,height=400");
        profiler.document.write('<!DOCTYPE html>\
        <html>\
        <head>\
        <title>Profiler</title>\
        </head>\
        <body>\
        <table id="table">\
        <thead><tr>\
        <th>Names</th>\
        <th>Calls</th>\
        <th>average Time</th>\
        <th><button onclick="reload()">Reload</button><th>\
        </tr></thead>\
        <tbody>\
        </tbody>\
        </table>\
        <script>\
        function reload()\
        {\
            var b = window.opener.Ether.profiler.blocks;\
            var l = document.createDocumentFragment();\
            for(var f in b)\
            {\
                var tr = document.createElement("tr");\
                var name = document.createElement("td");\
                name.appendChild(document.createTextNode(f));\
                var calls = document.createElement("td");\
                calls.appendChild(document.createTextNode(b[f].calls));\
                var avgT = document.createElement("td");\
                avgT.appendChild(document.createTextNode(b[f].averageTime));\
                tr.appendChild(name);\
                tr.appendChild(calls);\
                tr.appendChild(avgT);\
                tr.appendChild(document.createElement("td"));\
                l.appendChild(tr);\
            }\
            var tbOld = document.getElementsByTagName("tbody")[0];\
            var tbNew = document.createElement("tbody");\
            tbNew.appendChild(l);\
            document.getElementById("table").replaceChild(tbNew, tbOld);\
        }\
        </script>\
        </body>\
        </html>');
    }, false);
    btn.appendChild(document.createTextNode('Profiler'));
    btn.style.position = "absolute";
    document.body.appendChild(btn);
}, false);