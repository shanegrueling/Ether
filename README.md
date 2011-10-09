#Ether
Ether is an development library and tool for JavaScript.
##What does it do?
Ether should fix two big issues in developing large applications with JavaScript. Includes and the separation between release and debug code.

###Includes
JavaScript doesn't have the ability to include others files in runtime naturally. This leads to big files or dynamically load the code while runtime. While the first is good for release its bad for development contrary to the second which is good for development but most of the time bad for release.

Ether comes with the namespace Ether.include under which you can find methods to include your code dynamically, synchronically while developing. At runtime it is like one big file, with a bit performance loose, but while developing you can separate each class.

    Ether.include.JavaScript("scripts/awesome-three-d-engine.js");
    Ether.include.JavaScript("scripts/jQuery.js");
    
    $("p.neat").addClass("ohmy").show("slow");

This alone would be nothing worth to use Ether but ether is not alone the JavaScript-File. With ether.exe you can easily create a release file in which every include becomes replaced by the file it should include except the file is already included.

####Example:

__File one.js:__

    Ether.include.JavaScript("two.js");
    Ether.include.JavaScript("three.js");

__File two.js:__

    var hello = "world";

__File three.js:__

    alert("Hello "+hello+"!");

__Start ether.exe with this:__

    ether.exe PATH/TO/THE/FILES one.js PATH/WHERE/TO/SAVE/THE/OUTPUT/hello_world.js

__hello_world.js:__

    var hello = "world";
    alert("Hello "+hello+"!");

In Ether.include are more functions to find that handle different file formats. This allows to seperate JSON-Files or HTML-Files from the javascript code.