#Ether
Ether is an development library and tool for JavaScript.
##What does it do?
Ether fixes two big issues in developing large applications with JavaScript. Includes and the separation between release and debug code.

---

###Includes
JavaScript isn't capable of including others files in runtime naturally. This leads to big files or has to dynamically load the code during runtime. While the first is good for release its bad for development contrary to the second which is good for development but most of the time bad for release.

Ether contains the namespace Ether.include under which you can find methods to include your code dynamically and in order. At runtime it act like one big file, with a bit performance loose, but you can separate each class.

    Ether.include.JavaScript("scripts/awesome-three-d-engine.js");
    Ether.include.JavaScript("scripts/jQuery.js");
    
    $("p.neat").addClass("ohmy").show("slow");

This alone would be nothing worth to use Ether. But with the bundeled ether.exe you can easily create a release file in which every include becomes replaced by the file it should include. Ether.exe take care that no JavaScript File will be inserted more than once.

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

---

###Separation  between debug and release code

Everyone knows the little <code>if(debug)</code> that should prevent the code to do some things during release. Then why not delete it in release mode?

In Ether.debug.block are two handy functions and one nice constant. With <code>Ether.debug.block.start()</code> you can start a debug block and with <code>Ether.debug.block.end()</code> end one. While developing this will not have any effect but after run through the ether.exe everything including the line where the block started until the end call will be deleted and can't be found in the outputted file.

####Example

__debug.js:__

    //Do some things and create variable
    Ether.debug.block.start();
    Console.log("Content of variable:"+variable);
    Ether.debug.block.end();
    //Do more with variable


__Start ether.exe with this:__

    ether.exe PATH/TO/THE/FILES debug.js PATH/WHERE/TO/SAVE/THE/OUTPUT/release.js

__release.js:__

    //Do some things and create variable
    //Do more with variable

To explicite delete only one line like it would make sense in the above example you can use <code>Ether.debug.block.line;Console.log("Content of variable:"+variable);</code>. This will delete just this single line after ether.exe but won't do anything in development.

---

##More Features

* Profiling in Ether.profiler (Thanks to [victorporof](https://github.com/victorporof) for his basis to start from)
* A log function with channel support in Ether.debug.console

##How do I use this awesome toolset?

Nothing easier than this. Just add to your HTML file the line `<script src="PATH/TO/ether.js" data-main="RELATIVE/PATH/TO/SCRIPT.js">` and take care that it is the first `<script>`-Tag in the document.

After developing you produce the release version with the following command

    ether.exe BASEPATH RELATIVE/PATH/TO/SCRIPT.js PATH/WHERE/THE/OUTPUTTED/FILE/SHOULD/BE.js

##Questions left?

Don't hesitate to send me an message. I will answer as fast as possible to help you.

Happy coding in JavaScript!