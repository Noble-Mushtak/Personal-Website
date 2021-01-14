//This is our namespace:
var popups = {};

//These are the beginning and closing of our HTML documents for domobj.
popups._dombeg = "<!DOCTYPE html><html><head><title>HTML Parser</title></head><body>";
popups._domend = "</body></html>";
//This is our DOMParser for parsing HTML messages and therefore mimicking the deprecated innerHTML.
popups._domobj = new DOMParser();

//This is the box containing all of the messages:
popups._box = document.createElement("div");
popups._box.classList.add("popups-invisible");
popups._box.id = "popups-box";
setInterval(function() {
    /*This function is called 10 times every second and adjusts box's CSS according to its height:*/
    //Get the height of the window and of the box:
    var windowHeight = window.innerHeight, boxHeight = popups._box.scrollHeight;
    //If the box's height is less than 60% of the window's height, let the box take its own height:
    if (boxHeight < 0.6*windowHeight) popups._box.style.bottom = "auto";
    //Otherwise, stop it at 20% before the bottom of the screen:
    else popups._box.style.bottom = "20%";
}, 100);
//This adds the box element to the DOM when the document loads.
document.addEventListener("DOMContentLoaded", function() {
    document.body.insertBefore(popups._box, document.body.firstChild);
});

//These are some elements we're going to use in the function:
popups._message = document.createElement("div");
popups._message.classList.add("popups-message");
popups._input = document.createElement("textarea");
popups._input.classList.add("popups-prompt");
popups._hide = function(elem, callback, param) {
    /*This utility function returns a closure that removes an element from box and calls a callback function.*/
    
    return function() {
        //This removes elem from box, calls callback while passing in param, and, if box has no messages after elem is removed, makes box invisible.
        popups._box.removeChild(elem);
        if (callback) if (param) callback(param.value); else callback();
        if (!popups._box.childNodes.length) popups._box.classList.add("popups-invisible");
    };
};

popups.alert = function(msg, button, callback) {
    /*This function inserts a message into box.*/
    
    //This shows box if it's not already showing.
    if (popups._box.classList.contains("popups-invisible")) popups._box.classList.remove("popups-invisible");

    //This document contains the elements we are going to insert into box.
    var doc = popups._domobj.parseFromString(popups._dombeg+"<div class=\"popups-message\"><div>"+msg+"</div></div><button>"+button+"</button>"+popups._domend, "text/html");
    
    //This is the message we're going to insert into box. It has the CSS popups-message class and we're going to put some other stuff in it, too.
    var message = doc.body.childNodes[0];
    
    //This button hides the message and calls the callback function. We insert this into message.
    var hider = doc.body.childNodes[1];
    hider.onclick = popups._hide(message, callback);
    message.appendChild(hider);
    
    //This inserts message into box:
    popups._box.appendChild(message);
};
popups.confirm = function(msg, button1, button2, callback) {
    /*This function inserts a message into box and gives the user two choices.*/
    
    //This shows box if it's not already showing.
    if (popups._box.classList.contains("popups-invisible")) popups._box.classList.remove("popups-invisible");

    //This document contains the elements we are going to insert into box.
    var doc = popups._domobj.parseFromString(popups._dombeg+"<div class=\"popups-message\"><div>"+msg+"</div></div><button>"+button1+"</button><button>"+button2+"</button>"+popups._domend, "text/html");
    
    //This is the message we're going to insert into box. It has the CSS popups-message class and we're going to put some other stuff in it, too.
    var message = doc.body.childNodes[0];
    
    //This button hides the message and calls the callback function while passing in true. We insert this into message.
    var hider1 = doc.body.childNodes[1];
    hider1.onclick = popups._hide(message, callback, { value: true });
    message.appendChild(hider1);
    
    //This button hides the message and calls the callback function while passing in false. We insert this into message.
    //The index is 1 and not 2 because hider1 is no longer in doc.body.childNodes after being inserted inside message.
    var hider2 = doc.body.childNodes[1];
    hider2.onclick = popups._hide(message, callback, { value: false });
    message.appendChild(hider2);
    
    //This inserts message into box:
    popups._box.appendChild(message);
};
popups.prompt = function(msg, placeholder, button, callback) {
    /*This function inserts a message into box and asks for a text input from the user.*/
    
    //This shows box if it's not already showing.
    if (popups._box.classList.contains("popups-invisible")) popups._box.classList.remove("popups-invisible");

    //This document contains the elements we are going to insert into box.
    var doc = popups._domobj.parseFromString(popups._dombeg+"<div class=\"popups-message\"><div>"+msg+"</div></div><textarea class=\"popups-prompt\"></textarea><button>"+button+"</button>"+popups._domend, "text/html");
    
    //This is the message we're going to insert into box. It has the CSS popups-message class and we're going to put some other stuff in it, too.
    var message = doc.body.childNodes[0];
    
    //This textarea element is where the user puts his response to the prompt.
    var input = doc.body.childNodes[1];
    input.placeholder = placeholder;
    message.appendChild(input);
    message.appendChild(document.createElement("br"));
    
    //This button hides the message and calls the callback function while passing in the user's input. We insert this into message.
    //The index is 1 and not 2 because input is no longer in doc.body.childNodes after being inserted inside message.
    var hider = doc.body.childNodes[1];
    hider.onclick = popups._hide(message, callback, input);
    message.appendChild(hider);
    
    //This inserts message into box:
    popups._box.appendChild(message);
};