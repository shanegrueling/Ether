window.addEventListener('load', function() {
    var btn = document.createElement('button');
    btn.addEventListener('click', function() {
        var profiler = window.open("", "Profiler", "width=800,height=600");
        profiler.document.write("<!DOCTYPE html>\
<html>\
<head>\
    <title>Profiler</title>\
    <style type=\"text/css\">\
        table {\
            margin: 1em;\
            border-collapse: separate;\
            border-spacing: 0 0;\
            width: 45em;\
        }\
        td {\
            border: 1px solid #999;\
            border-top: none;\
            border-left: none;\
        }\
        td:first-child {\
            border-left: 1px solid #999;\
        }\
        tr:nth-child(even) {\
            background-color: #ededed;\
        }\
        tr:nth-child(odd) {\
            background-color: #FFF;\
        }\
        th {\
            border: 1px solid #999;\
            border-top: none;\
            border-left: none;\
            background-color: #ededed;\
        }\
        th:first-child {\
            border-left: 1px solid #999;\
        }\
        thead th {\
            border-top: 1px solid #999;\
        }\
    </style>\
</head>\
<body>\
<p></p>\
<script>\
    function buildTable(blocks, column, reverse)\
    {\
        column = Math.min(1, Math.max(3, column));\
        reverse = reverse||false;\
        var arr = [];\
        for(var f in blocks) {\
            arr[arr.length] = [f, blocks[f].totalTime, blocks[f].averageTime, blocks[f].longestTime];\
        }\
        arr.sort(function(a, b) {\
            return b[column] - a[column];\
        });\
        if(reverse)\
        {\
            arr.reverse();\
        }\
        var table = document.createElement('table');\
        var thead = document.createElement('thead');\
        var heading = document.createElement('tr');\
        var headingTotalTime = document.createElement('th');\
        headingTotalTime.appendChild(document.createTextNode('Total time'));\
        var headingName = document.createElement('th');\
        headingName.appendChild(document.createTextNode('Name'));\
        var headingCalls = document.createElement('th');\
        headingCalls.appendChild(document.createTextNode('Calls'));\
        var headingAvgTime = document.createElement('th');\
        headingAvgTime.appendChild(document.createTextNode('Average time'));\
        var headingLongestTime = document.createElement('th');\
        headingLongestTime.appendChild(document.createTextNode('Longest time'));\
        var headingBtn = document.createElement('th');\
        var hBTN = document.createElement('button');\
        hBTN.appendChild(document.createTextNode('Refresh'));\
        hBTN.onclick = reload;\
        headingBtn.appendChild(hBTN);\
        heading.appendChild(headingTotalTime);\
        heading.appendChild(headingName);\
        heading.appendChild(headingCalls);\
        heading.appendChild(headingAvgTime);\
        heading.appendChild(headingLongestTime);\
        heading.appendChild(headingBtn);\
        thead.appendChild(heading);\
        table.appendChild(thead);\
        var tbody = document.createElement('tbody');\
        for(var sort, index = 0; sort = arr[index]; ++index) {\
            var f = sort[0];\
            var tr = document.createElement(\"tr\");\
            var tt = document.createElement(\"td\");\
            tt.appendChild(document.createTextNode(blocks[f].totalTime));\
            var name = document.createElement(\"td\");\
            name.appendChild(document.createTextNode(f));\
            var calls = document.createElement(\"td\");\
            calls.appendChild(document.createTextNode(blocks[f].calls));\
            var avgT = document.createElement(\"td\");\
            avgT.appendChild(document.createTextNode(blocks[f].averageTime));\
            var lT = document.createElement(\"td\");\
            lT.appendChild(document.createTextNode(blocks[f].longestTime));\
            tr.appendChild(tt);\
            tr.appendChild(name);\
            tr.appendChild(calls);\
            tr.appendChild(avgT);\
            tr.appendChild(lT);\
            tr.appendChild(document.createElement(\"td\"));\
            tbody.appendChild(tr);\
            /*Parents*/\
            if(blocks[f].parents)\
            {\
                var pTR = document.createElement('tr');\
                var pTD = document.createElement('td');\
                pTD.setAttribute('colspan', 6);\
                var pPlus = document.createElement('button');\
                pPlus.appendChild(document.createTextNode('Show Parents'));\
                pPlus.onclick = function()\
                {\
                    var name = f+'-parents';\
                    return function(e)\
                    {\
                        var p = document.getElementById(name);\
                        p.style.display = p.style.display==\"table\"?\"none\":\"table\";\
                        e.target.innerHTML=p.style.display==\"table\"?\"Hide Parents\":\"Show Parents\";\
                    };\
                }();\
                pTD.appendChild(pPlus);\
                var parents = buildTable(blocks[f].parents, column, reverse);\
                parents.setAttribute('id', f+'-parents');\
                parents.style.display = \"none\";\
                pTD.appendChild(parents);\
                pTR.appendChild(pTD);\
                tbody.appendChild(pTR);\
            }\
            if(blocks[f].childs)\
            {\
                var cTR = document.createElement('tr');\
                var cTD = document.createElement('td');\
                cTD.setAttribute('colspan', 6);\
                var cPlus = document.createElement('button');\
                cPlus.appendChild(document.createTextNode('Show Childs'));\
                cPlus.onclick = function()\
                {\
                    var name = f+'-childs';\
                    return function(e)\
                    {\
                        var c = document.getElementById(name);\
                        c.style.display = c.style.display==\"table\"?\"none\":\"table\";\
                        e.target.innerHTML=c.style.display==\"table\"?\"Hide Childs\":\"Show Childs\";\
                    };\
                }();\
                cTD.appendChild(cPlus);\
                var childs = buildTable(blocks[f].childs, column, reverse);\
                childs.setAttribute('id', f+'-childs');\
                childs.style.display = \"none\";\
                cTD.appendChild(childs);\
                cTR.appendChild(cTD);\
                tbody.appendChild(cTR);\
            }\
        }\
        table.appendChild(tbody);\
        return table;\
    }\
    function reload() {\
        var b = window.opener.Ether.profiler.blocks;\
        var l = document.createDocumentFragment();\
        document.body.replaceChild(buildTable(b, 1, false), document.body.firstChild);\
    }\
    reload();\
</script>\
</body>\
</html>");
    }, false);
    btn.appendChild(document.createTextNode('Profiler'));
    btn.style.position = "absolute";
    document.body.appendChild(btn);
}, false);