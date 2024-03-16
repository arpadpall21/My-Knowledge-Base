$(document).ready(function(){
var preCollection = $("pre[class!='syntax']");
// -> only target pre element with no syntax class    
    for(let i = 0; i < preCollection.length; i++) {
        // let pre = document.getElementsByTagName("pre")[i].innerHTML;
let pre = preCollection[i].innerHTML;       
        var commentRegExp = new RegExp("// -&gt;.{1,}", "g");
            // -> target the desired comment line until new line "// - >"
            // -> the "." (any character except new line is a big help here) in order to filter the whole comment line
        var lineRegExp = new RegExp(".{1,}", "g");
            // -> get one line 
        var newPre = "", store = "", lineCount = 0;
        while(lineRegExp.exec(pre) != null) {
            lineCount++;
        }
        for(; lineCount > 0; lineCount--){
            let testLine = lineRegExp.exec(pre)[0];
            testLine = testLine.replace(/\/\/ -&gt;.{1,}/, "$&".fontcolor("cornflowerblue"));
            testLine = testLine.replace(/\/\/ [^-].{1,}/, "$&".fontcolor("grey"));
                // -> replaceing the desired string parts
            newPre += store.concat(testLine + "\n");
                // -> the "\n" adds a new line (enter) at the end of every line
        }
    // document.getElementsByTagName("pre")[i].innerHTML = newPre;
    preCollection[i].innerHTML = newPre;
    }
});