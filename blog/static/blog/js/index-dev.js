//This binds event handlers to scroll through the different blog posts.
var goBack = document.getElementById("goBack");
var goForward = document.getElementById("goForward");
goBack.addEventListener(mouseevents.click, function() {
    if (blogPosts) setLinks(-links.length);
});
goForward.addEventListener(mouseevents.click, function() {
    if (blogPosts) setLinks(links.length);
});

//The titles and slugs of all the blog posts
var blogPosts = JSON.parse(document.getElementById("directory-info").textContent);
//The loading notice
var notice = document.getElementById("notice");
//All of the links to blog posts
var links = document.querySelectorAll("#desc a");
//How many blog posts the user has shifted through
var shift = 0;
//This sets up the links in the links list according to blogPosts and shift. It also changes shift if a parameter is passed in.
function setLinks(shiftShift) {
    //Increment shift if possible
    if (shiftShift && shift+shiftShift >= 0 && shift+shiftShift < blogPosts.length) shift += shiftShift;
    //Make goBack and goForward visible or invisible based on whether or not there are more blog posts in there direction.
    if (shift-links.length >= 0) goBack.style.display = "block";
    else goBack.style.display = "none";
    if (shift+links.length < blogPosts.length) goForward.style.display = "block";
    else goForward.style.display = "none";
    //Update all of the links according to blogPosts[shift] to blogPosts[shift+9]
    for (var i = 0; i < links.length; i++) {
        //Update links' href and textContent and make them visible
        if (blogPosts.length > shift+i) {
            links[i].style.display = "inline";
            links[i].href = "/blog/"+blogPosts[shift+i].slug;
            links[i].textContent = blogPosts[shift+i].title;
        }
        //Make links invisible if they don't contain anything.
        else {
            links[i].style.display = "none";
        }
    }
};
setLinks();