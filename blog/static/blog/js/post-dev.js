var hider = document.getElementById("hider");
var chatCenter = document.getElementById("chat-center");
//When #hider is clicked, hide #hider, load the Chat Center, and show it:
hider.addEventListener("click", function() {
    hider.style.display = "none";
    loadChatCenter();
    chatCenter.style.display = "block";
});