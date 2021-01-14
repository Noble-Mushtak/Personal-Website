//The event names. These change according to whether or not the user is on a mobile device, or specifically a Windows Phone.
var isIEMobile = navigator.userAgent.indexOf("IEMobile") != -1;
var isMobile = navigator.userAgent.indexOf("Mobile") != -1;
var mouseevents = {
    click: "click",
    mousedown: isIEMobile ? "pointerdown" : (isMobile ? "touchstart" : "mousedown"),
    mouseup: isIEMobile ? "pointerup" : (isMobile ? "touchend" : "mouseup"),
    mousemove: isIEMobile ? "pointermove" : (isMobile ? "touchmove" : "mousemove"),
    mouseenter: isIEMobile ? "pointerenter" : (isMobile ? "touchenter" : "mouseenter"),
    mouseleave: isIEMobile ? "pointerleave" : (isMobile ? "touchleave" : "mouseleave")
};

//Make room for the creative commons notice at the end of the page.
var creativeCommonsNotice = document.getElementById("cc-notice");
//Put creativeCommonsNotice at the bottom:
document.body.removeChild(creativeCommonsNotice);
document.body.appendChild(creativeCommonsNotice);

//This element will make space for the privacy policy at the bottom of the page.
var creativeCommonsSpace = document.createElement("div");
creativeCommonsSpace.id = "cc-space";

function adjustCreativeCommonsHeight() {
    /* Makes creativeCommonsSpace the same height as creativeCommonsNotice */
    //We need to add "if (creativeCommonsNotice)" in case there are some pages without this notice.
    if (creativeCommonsNotice) {
        //Get the height:
        var height = parseInt(getComputedStyle(creativeCommonsNotice).height);
        //Set the privacy policy's space height:
        creativeCommonsSpace.style.height = height+"px";
        
        //If the privacy policy is too big relative to the height of the screen, just put it at the bottom of the page:
        if (height > .2*window.innerHeight) {
            creativeCommonsNotice.style.position = "static";
            //Remove creativeCommonsSpace if necessary:
            if (creativeCommonsSpace.parentNode) document.body.removeChild(creativeCommonsSpace);
        }
        //Otherwise, fix it at the bottom of the screen:
        else {
            creativeCommonsNotice.style.position = "fixed";
            //Add creativeCommonsSpace if necessary:
            if (!creativeCommonsSpace.parentNode) document.body.appendChild(creativeCommonsSpace);
        }
    }
}

//Call adjustCreativeCommonsHeight() now and when the window is resized:
adjustCreativeCommonsHeight();
window.addEventListener("resize", adjustCreativeCommonsHeight);

//Stop the normal click event from happening in the space fillers inside <summary> elements.
//This stops <details> elements from expanding when people click the whitespace inside the <summary>.
var spaceFillers = document.getElementsByClassName("space-filler");
function stopPropogation(event) {
    event.preventDefault(); //Stops <details> from expanding
    event.stopPropagation(); //Stops the <summary> click event from firing
}
for (var i = 0; i < spaceFillers.length; i++) {
    spaceFillers[i].addEventListener(mouseevents.click, stopPropogation);
}