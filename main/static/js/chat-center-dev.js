//This is JS I wrote in eighth/ninth grade around 2014/2015, so...not the best code unfortunately. Hopefully I'll clean this up one day.

//Configuration for DOMPurify
var purify_config = {
    ALLOWED_TAGS: ["I", "B", "U", "S", "MARK", "EM", "STRONG", "INS", "DEL", "SMALL", "SUB", "SUP", "DFN", "ABBR", "BDI", "BDO", "PRE", "CODE", "SAMP", "KBD", "VAR", "H1", "H2", "H3", "H4", "H5", "H6", "RUBY", "RT", "RP", "A", "SPAN", "P", "DIV", "FIGURE", "FIGCAPTION", "DETAILS", "SUMMARY", "BR", "WBR", "HR", "UL", "OL", "LI", "DL", "DD", "DT", "TABLE", "TBODY", "THEAD", "TFOOT", "TR", "TD", "TH", "CAPTION", "COLGROUP", "COL", "SECTION", "NAV", "ARTICLE", "ASIDE", "ADDRESS", "HEADER", "FOOTER", "CITE", "INPUT", "SELECT", "OPTION", "TEXTAREA", "BUTTON", "TIME"],
    ALLOWED_ATTR: ["href"]
};

//For links in chat comments, set target=_blank for convenience
// and set rel=nofollow for SEO purposes
DOMPurify.addHook("afterSanitizeAttributes", function(node) {
    if (node.nodeName && node.nodeName.toLowerCase() == "a") {
        node.setAttribute("target", "_blank");
        node.setAttribute("rel", "nofollow");
    }
});

/* These are variables representing elements:
-chatDisplay represents the form used to submit comments
-message represents the element used to display messages to the user about the progression of their comment submission
-infoElem represents the element that tells the user about formatting
-formatters represents the array of elements with name attribute "formatting" in the chat form
-submitter represents the button used to submit comments
-moreComments represents the button used to load more comments.
*/
var chatDisplay = document.getElementById("chat-display"), message = document.getElementById("message"), infoElem = document.getElementById("info-element"), formatters = document.forms.commentPoster.formatting, submitter = document.forms.commentPoster.submitter, moreComments = document.getElementById("more-comments");

function resetChats() {
    /* This function clears all the comments in chatDisplay. */    
    while (chatDisplay.childNodes.length) chatDisplay.removeChild(chatDisplay.childNodes[0]);
}

var safe = function(chatItems, prepend) {
    /* This function takes a bunch of JSON data the represents all of the chat comments and safely inputs them into chatDisplay. */
    
    //Remove moreComments if it's inside chatDisplay and possibly prepend it again at the end.
    if (moreComments.parentNode===chatDisplay) chatDisplay.removeChild(moreComments);
    
    //Note that, if prepend is true, we loop chatItems backwards. This is so we can add in older comments on top of already displaying newer comments by making reset false.
    for (var i = prepend ? (chatItems.length-1) : 0; prepend ? (i >= 0) : (i < chatItems.length); prepend ? (--i) : (++i)) {
        //name and text are the name and text of the comment, respectively.
        var name = chatItems[i].name;
        var text = chatItems[i].text;
        //comment is the <div> element that stores all parts of the comment. The makeup of comment is based on CSS.
        var comment = document.createElement("div");
        comment.classList.add("chat-item");
        //Include the name:
        var nameElem = document.createElement("div");
        nameElem.classList.add("chat-info");
        nameElem.textContent = name;
        //Include the time:
        var timeElem = document.createElement("div");
        timeElem.classList.add("chat-info");
        //List the time as "unknown" if not in the database:
        timeElem.textContent = "Posted on "+(chatItems[i].hasOwnProperty("time") ? chatItems[i].time : "an unknown")+" time";
        //If time is not unknown, add a link to GMT time for explanation:
        if (chatItems[i].hasOwnProperty("time")) {
            //Get rid of "GMT time" at the end:
            timeElem.textContent = timeElem.textContent.substring(0, timeElem.textContent.length-8);
            //Add the link:
            var linkToGMT = document.createElement("a");
            linkToGMT.setAttribute("href", "http://www.greenwichmeantime.com/");
            linkToGMT.setAttribute("target", "_blank");
            linkToGMT.textContent = "GMT time";
            timeElem.appendChild(linkToGMT);
        }
        //This appends nameElem, timeElem, and a <br> element into comment.
        comment.appendChild(nameElem);
        comment.appendChild(timeElem);
        comment.appendChild(document.createElement("br"));
        
        //textElem is the <div> element that stores the text of the comment.
        var textElem = document.createElement("div");
        textElem.classList.add("comment");
        //Purify the chat comment text and put it into textElem:
        textElem.innerHTML = DOMPurify.sanitize(text, purify_config);
        
        //This appends textElem into comment.
        comment.appendChild(textElem);
        //This inserts the new comment.
        prepend ? chatDisplay.insertBefore(comment, chatDisplay.firstChild) : chatDisplay.appendChild(comment);
        //This makes sure that textElem actually shows something and that the comment isn't just "<span></span>" or something of the like.
        if (!textElem.clientHeight) chatDisplay.removeChild(comment);
        //This makes sure that textElem doesn't get too big to confuse the people scrolling through the chats.
        if (textElem.clientHeight > chatDisplay.clientHeight/2) {
            textElem.style.height = chatDisplay.clientHeight/2+"px";
            textElem.style.overflow = "auto";
        }
    }
    
    //Prepend moreComments if the number of comments displayed is less than the total number of comments:
    if (numComments < numTotalComments) chatDisplay.insertBefore(moreComments, chatDisplay.firstChild);
};

//Each array in info corresponds with an array of <li> elements informing the user about the formatting option.
var info = [[], []];
var genCodeElem = function(inner) {
    /* This function creates a <span> with class "code" and textContent of the parameter inner. */
    var elem = document.createElement("code");
    elem.classList.add("code");
    elem.textContent = inner;
    return elem;
};

//These variables are made to minify the switch loops. They are put in a namespace because we don't want them to be global variables.
//We don't need to read what the switch loops actually do in detail because they were made using generative programming, so we still understand them.
var _min = {};
_min.c = document.createTextNode.bind(document);
_min.g = genCodeElem;

//The switch statements are made with a JavaScript Console at data:text/html,<textarea id ="textarea"></textarea><script>var textarea = document.getElementById("textarea");</script> and the following code:
//Copy and pasted <div> elements (one on each line) into <textarea>
//Example:
//<div>-Newlines in the text entry will be transferred to the output. (Technical Detail: Newlines will be replaced by <span class = "code">br</span> tags)</div>
//<div>-More formatting options will appear soon.</div>
//arr is an array of strings representing the innerHTML property of <div> elements.
/*
//code is the code wanted.
var arr = [], code = "switch(i){";
textarea.value.split("\n").forEach(function(v) {
    //This function pushes what would be the innerHTML property of each <div> element for each element into arr. 
    arr.push(v.substring(5, v.length-6));
});
var addCode = function(num, str) {
    //This function adds each case to code. It looks out for <span> elements with class "code". 
    code += "case "+num+":";
    var ind = str.indexOf("</span>"), ind2 = str.indexOf("<span class = \"code\">"), lastInd = 0;
    while ((ind = str.indexOf("</span>", lastInd)) !== -1) {
        ind2 = str.indexOf("<span class = \"code\">", lastInd);
        code += "a(_min.c("+JSON.stringify(str.substring(lastInd, ind2))+"));";
        code += "a(_min.g(\""+str.substring(ind2+21, ind)+"\"));";
        lastInd = ind+7;
    }
    code += "a(_min.c("+JSON.stringify(str.substring(lastInd, str.length))+"));";
    code += "break;";
};
//This calls addCode for each element in arr.
for (var i = 0; i < arr.length; i++) addCode(i, arr[i]);
//By adding "}" to code at the very end here, we finish the switch loop and print code to the console.
code += "}";
*/
//Eventually, the <div> elements were changed to <li> elements to create a <ul> list.

//These for loops create the <li> elements in the elements of info.
for (var i = 0; i < 18; i++) {
    info[0].push(document.createElement("li"));
    var a = info[0][i].appendChild.bind(info[0][i]);
    switch(i){case 0:a(_min.g("i"));a(_min.c(", "));a(_min.g("b"));a(_min.c(", "));a(_min.g("u"));a(_min.c(", "));a(_min.g("s"));a(_min.c(", "));a(_min.g("mark"));a(_min.c(", "));a(_min.g("em"));a(_min.c(", "));a(_min.g("strong"));a(_min.c(", "));a(_min.g("ins"));a(_min.c(", and "));a(_min.g("del"));a(_min.c(" tags are allowed."));break;case 1:a(_min.g("small"));a(_min.c(", "));a(_min.g("sub"));a(_min.c(", "));a(_min.g("sup"));a(_min.c(", "));a(_min.g("dfn"));a(_min.c(", "));a(_min.g("abbr"));a(_min.c(", "));a(_min.g("bdi"));a(_min.c(", and "));a(_min.g("bdo"));a(_min.c(" tags are allowed."));break;case 2:a(_min.g("pre"));a(_min.c(", "));a(_min.g("code"));a(_min.c(", "));a(_min.g("samp"));a(_min.c(", "));a(_min.g("kbd"));a(_min.c(", and "));a(_min.g("var"));a(_min.c(" tags are allowed."));break;case 3:a(_min.g("h1"));a(_min.c(", "));a(_min.g("h2"));a(_min.c(", "));a(_min.g("h3"));a(_min.c(", "));a(_min.g("h4"));a(_min.c(", "));a(_min.g("h5"));a(_min.c(", "));a(_min.g("h6"));a(_min.c(" tags are allowed."));break;case 4:a(_min.g("ruby"));a(_min.c(", "));a(_min.g("rt"));a(_min.c(", and "));a(_min.g("rp"));a(_min.c(" tags are allowed."));break;case 5:a(_min.g("a"));a(_min.c(" tags are allowed."));break;case 6:a(_min.g("span"));a(_min.c(", "));a(_min.g("p"));a(_min.c(", and "));a(_min.g("div"));a(_min.c(" tags are allowed."));break;case 7:a(_min.g("figure"));a(_min.c(" and "));a(_min.g("figcaption"));a(_min.c(" tags are allowed."));break;case 8:a(_min.g("details"));a(_min.c(" and "));a(_min.g("summary"));a(_min.c(" tags are allowed."));break;case 9:a(_min.g("br"));a(_min.c(", "));a(_min.g("wbr"));a(_min.c(", and "));a(_min.g("hr"));a(_min.c(" tags are allowed."));break;case 10:a(_min.c("Newlines will not automatically be replaced with "));a(_min.g("br"));a(_min.c(" tags: "));a(_min.g("br"));a(_min.c(" tags must be manually placed within the code when a newline is wanted."));break;case 11:a(_min.g("ul"));a(_min.c(", "));a(_min.g("ol"));a(_min.c(", and "));a(_min.g("li"));a(_min.c(" tags are allowed."));break;case 12:a(_min.g("dl"));a(_min.c(", "));a(_min.g("dd"));a(_min.c(", and "));a(_min.g("dt"));a(_min.c(" tags are allowed."));break;case 13:a(_min.g("table"));a(_min.c(", "));a(_min.g("tbody"));a(_min.c(", "));a(_min.g("thead"));a(_min.c(", "));a(_min.g("tfoot"));a(_min.c(", "));a(_min.g("tr"));a(_min.c(", "));a(_min.g("td"));a(_min.c(", "));a(_min.g("th"));a(_min.c(" "));a(_min.g("caption"));a(_min.c(", "));a(_min.g("colgroup"));a(_min.c(", and "));a(_min.g("col"));a(_min.c(" tags are allowed."));break;case 14:a(_min.g("section"));a(_min.c(", "));a(_min.g("nav"));a(_min.c(", "));a(_min.g("article"));a(_min.c(", "));a(_min.g("aside"));a(_min.c(", "));a(_min.g("address"));a(_min.c(", "));a(_min.g("header"));a(_min.c(", "));a(_min.g("footer"));a(_min.c(", and "));a(_min.g("cite"));a(_min.c(" tags are allowed."));break;case 15:a(_min.g("input"));a(_min.c(", "));a(_min.g("select"));a(_min.c(", "));a(_min.g("option"));a(_min.c(", "));a(_min.g("textarea"));a(_min.c(", and "));a(_min.g("button"));a(_min.c(" tags are allowed."));break;case 16:a(_min.g("time"));a(_min.c(" tags are allowed."));break;case 17:a(_min.c("Using any attributes other than the "));a(_min.g("href"));a(_min.c(" attribute is not allowed."));break;}
}
for (var i = 0; i < 1; i++) {
    info[1].push(document.createElement("li"));
    var a = info[1][i].appendChild.bind(info[1][i]);
    switch(i){case 0:a(_min.c("Message will appear as plaintext, without any formatting"));break;}
}

//This variable is a number representing the formatting option selected by the user.
var formatter;
var formattingChange = function() {
    /* This changes infoElem based on the current checked element in formatters as a click handler of all the elements in formatters. */
    //The object of this function is an element of formatters because it has been binded as such.
    //We check if the checked attribute is true just in case the element is clicked, but not actually selected.
    if (this.checked) {
        while (infoElem.childNodes.length) infoElem.removeChild(infoElem.childNodes[0]);
        formatter = parseFloat(this.value);
        for (var i = 0; i < info[formatter].length; i++) infoElem.appendChild(info[formatter][i]);
    }
};
//This binds the click handler of each element in formatters to formattingChange and calls formattingChange if the element is checked.
for (var i = 0; i < formatters.length; i++) {
    var func = formattingChange.bind(formatters[i]);
    formatters[i].addEventListener("input", func);
    if (formatters[i].checked) func();
}

//This URL slug tells the server which chat applet we are dealing with, because there are multiple chat applets at different locations.
var slug = window.location.pathname;

var getRequest = function(link, asynchronity, statechange) {
    /* This function sends a GET HTTP request based on its parameters. */
    var req = new XMLHttpRequest;
    req.open("GET", link, !!asynchronity);
    if (typeof statechange === "function") req.onreadystatechange = statechange;
    //We add this link attribute to req in case there are times where we won't be able to tell the request URI without it (like in waitRequest.stateChanger).
    //We add params so we can know if present to know we have get parameters or not.
    req.link = link.substring(0, link.indexOf("?"));
    if (!req.link) req.link = link;
    else req.params = link.substring(link.indexOf("?")+1, link.length);
    req.send();
};

var waitRequest = function() {
    /* This function sends a request to /get-new-chats so the user can be notified of new comments. */
    var link = "/get-new-chats?last_num_comments="+numTotalComments+"&slug="+slug;
    var req = new XMLHttpRequest;
    req.open("GET", link, true);
    req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    req.onreadystatechange = waitRequest.stateChanger;
    //This is the same link info in getRequest.
    req.link = link;
    req.send();
};
waitRequest.stateChanger = function() {
    /* This function responds to status changes in the request sent from waitRequest as the onstatechange event handler of the XMLHttpRequest. */

    //This tells us if the comments were updated:
    var hasUpdated = false;
    //If there's an error, we tell the user something's wrong.
    if (this.status >= 400 && this.readyState === 4) popups.alert(this.response || "Something went wrong and we don't know what...Sorry!", "OK");
    //If there's a success...
    else if (this.status === 200 && this.readyState === 4) {
        //Clear the "No JavaScript" comment if needed, and then set the cleared flag:
        if (!initialCommentCleared) {
            resetChats();
            initialCommentCleared = true;
        }
        //Then, parse the response:
        var response = JSON.parse(this.response);
        //Update the number of total comments:
        numTotalComments = response.numTotalComments;
        //If there are any comments, put them in the display:
        if (response.comments.length > 0) {
            //Set hasUpdated flag, since we are about to update the comments:
            hasUpdated = true;
            safe(response.comments, false);
        }
    }
    //If the request was a success (either 200 or 204), call waitRequest again in a half-second:
    if (this.status >= 200 && this.status < 300 && this.readyState === 4) setTimeout(waitRequest, 500);
    //If comments have been updated:
    if (hasUpdated) {
        //We scroll chatDisplay all the way to the bottom:
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
        //We enable the comments (in case the comments were disabled by postComments() before):
        commentsDisabled = false;
        //If message has content, we clear message since the comment submission has been completed.
        //Look below to postComment.sender and postComment.stateChanger for more info.
        message.textContent = "";
    }
};

//This is true iff the user needs to wait to post a comment:
var commentsDisabled = false;
//This is true iff the initial "No JavaScript" comment has been cleared:
var initialCommentCleared = false;
//This is the number of comments we expect.
var numComments = 100;
//This is the total number of comments, according to the last response from /get-chats or /get-new-chats.
var numTotalComments = 0;
var getComments = function() {
    /* This function gets more comments, usually as a click event handler for moreComments. */
    //If the comments are disabled 
    if (commentsDisabled) popups.alert("Please wait before getting more comments! This might've happened if you tried to get comments while we were posting one of your comments.", "OK");
    else {
        //We raise the number of comments expected by 50.
        numComments += 50;
        //We set info to the default of getting 50 more comments.
        info = {start: numComments, end: numComments-50};
        //We make moreComments and submitter invisible until the request finshes.
        submitter.style.display = moreComments.style.display = "none";
        //Make the comments disabled until we get the comments:
        commentsDisabled = true;
        //We notify the user of what we're doing through message.
        message.textContent = "Getting more comments...";
        //We then send a request to the JSON API to get the older comments.
        var link = "/get-chats?start="+info.start+"&end="+info.end+"&slug="+slug;
        getRequest(link, true, getComments.stateChanger);
    }
};
getComments.stateChanger = function() {
    /* This function responds to state changes in the request sent by getComments. */
    //If there's an error, we tell the user something's wrong.
    if (this.status >= 400 && this.readyState === 4) popups.alert(this.response || "Something went wrong and we don't know what...Sorry!", "OK");
    //Otherwise, if the request is a success, we parse the response, get the comments, and pass them into safe in order to load them into display:
    else if (this.status === 200 && this.readyState == 4) {
        response = JSON.parse(this.response);
        safe(response.comments, true);
    }
    //We make submitter and moreComments visible when the request is finished.
    if (this.readyState === 4) {
        moreComments.style.display = "inline-block", submitter.style.display = "block";       
        //Also, clear message and enable the comments again:
        message.textContent = "";
        commentsDisabled = false;
    }
};

var postComment = function(event) {
    /* This function posts a comment as the submit event handler of the chat form. */
    //This prevents the default submission.
    event.preventDefault();

    //If the comments are disabled, tell the user:
    if (commentsDisabled) popups.alert("Please wait a little before posting another comment again! This might've happened if you pressed Enter a bunch in the name field to post multiple comments quickly or if you tried to post a comment while we were trying to get additional comments for you from the database.", "OK");
    //Otherwise:
    else {
        //This validates the user's submission. A pop-up box informing the user of their mistake shows up if they did not fill in the text or name fields.
        if (!this.text.value) popups.alert("Remember to type something into your comment!", "OK");
        else if (this.text.value.length > 3000) popups.alert("Please keep your comment under 3000 characters. Thank you!", "OK");
        else if (!this.name.value) popups.alert("Remember to fill in your name!", "OK");
        else if (this.name.value.length > 60) popups.alert("Please keep your name under 60 characters. Thank you!", "OK");
         else {
            //This fills in message to inform the user that their comment is being posted.
            message.textContent = "Posting the comment...";
            //We make submitter and moreComments invisible until the request finishes.
            submitter.style.display = moreComments.style.display = "none";
            //Make the comments disabled until the comment is posted:
            commentsDisabled = true;

            //This puts postComment.sender on a new thread so the POST request doesn't take as much lag when sending.
            //Remember that the this object in this function is the chat form as postComment has been binded as such.
            //Also remember that formatter is declared above, outside this function.
            setTimeout(postComment.sender.bind({text: this.text.value, name: this.name.value, formatting: formatter, token: this.csrfmiddlewaretoken.value}), 1);
            console.log("SDFG");
        }
    }
};
postComment.sender = function() {
    /* This function sends the POST HTTP request for the submission of the comment in postComment. */
    //The this object of this function is specified by postComment.sender.bind in postComment as we use setTimeout() for this function, so we can't pass in parameters.
    var params = this;
    var post = new XMLHttpRequest;
    post.open("POST", "/post-chat", true);
    post.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    //Set CSRF Token
    post.setRequestHeader("X-CSRFToken", params.token);
    
    post.onreadystatechange = postComment.stateChanger;
    //We send the request with a bunch of parameters: text, name, formatting, slug
    post.send("text="+encodeURIComponent(params.text)+"&name="+encodeURIComponent(params.name)+"&formatting="+encodeURIComponent(params.formatting)+"&slug="+slug);
};
postComment.stateChanger = function() {
    /* This function reacts to the change in status of the request sent in postComment.sender as the onstatechanger event handler of the XMLHttpRequest. */
    //We make submitter and moreComments visible when the request is finished.
    if (this.readyState === 4) moreComments.style.display = "inline-block", submitter.style.display = "block";
    if (this.status >= 400 && this.readyState === 4) {
        //If there's an error, we show a pop-up box to the user and clear message.
        popups.alert(this.response || "Something went wrong and we don't know what...Sorry!", "OK");
        message.textContent = "";
    } else if (this.status === 204 && this.readyState === 4) {
        //If it's a success and waitRequest hasn't gotten the message yet, we just tell the user we're waiting for the change to comments.
        if (message.textContent) message.textContent = "Checking for changes to comments...";
    }
};

var sizeElems = function() {
    /* This function adjusts the height of the chat form according to the screen size and the ratios defined in a previous <script>. */
    var ratio = (chatDisplay.scrollTop+chatDisplay.clientHeight)/chatDisplay.scrollHeight;
    chatDisplay.style.height = chatDisplayRatio*document.documentElement.clientHeight+"px";
    document.forms.commentPoster.text.style.height = commentPosterRatio*document.documentElement.clientHeight+"px";
    document.forms.commentPoster.style.height = "auto";
    chatDisplay.scrollTop = ratio*chatDisplay.scrollHeight-chatDisplay.clientHeight;
};
//This binds sizeElems to the resize event:
window.addEventListener("resize", sizeElems);

var checkLength = function() {
    /*This function returns a function that tells the user if their name or comment is too long.*/
    //Empty message
    message.textContent = "";
    var textElem = document.forms.commentPoster.text, nameElem = document.forms.commentPoster.name, started = false;
    //The comment must be < 3000 characters.
    if (textElem.value.length > 3000) {
        message.textContent += "Your comment is too long! It must be under 3000 characters."
        started = true;
    }
    //The name must be > 60 characters.
    if (nameElem.value.length > 60) {
        if (started) message.textContent += " ";
        message.textContent += "Your name is too long! It must be under 60 characters."
        started = true;
    }
};

//This binds checkLength to the oninput event of both the comment box and the name box.
document.forms.commentPoster.text.addEventListener("input", checkLength);
document.forms.commentPoster.name.addEventListener("input", checkLength);

function loadChatCenter() {
    /* This function loads the chat center for when we want to start it up. */
    //This calls sizeElems and binds sizeElems to the resize event.
    sizeElems();

    //This calls getRequest to the "/get-chats" URI with waitRequest.stateChanger to get data for the chat comments and load them to chatDisplay.
    getRequest("/get-chats?slug="+slug, true, waitRequest.stateChanger);

    //This binds the click event handler of moreComments to getComments.
    moreComments.addEventListener(mouseevents.click, getComments);
    //This binds the click event handler of submitter to postComment, meaning that when the form is submitted, postComment will be called.
    submitter.addEventListener(mouseevents.click, postComment.bind(document.forms.commentPoster));
}