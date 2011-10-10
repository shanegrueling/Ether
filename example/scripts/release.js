var include="This will be available in global scope.\
In Development first after calling the function and in release immediately. Remember this difference!";
var welcome = "Hello and welcome to ether-release";

alert(welcome);
alert("This comes from assets/coolmsg.html but in release it will be hardcoded in your sourcecode.");
alert(include);
var a = function ()
{
}();
alert(include);