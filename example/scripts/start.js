Ether.include.JavaScript("scripts/welcome.js");
alert(welcome);

Ether.debug.block.start();
alert('This message won\'t be seen in release mode');
Ether.include.JavaScript("scripts/debug.js");
Ether.debug.block.end();

alert(Ether.include.HTML('assets/coolmsg.html'));

alert(include);
var a = function ()
{
    Ether.include.JavaScript('scripts/include.js');
}();
alert(include);