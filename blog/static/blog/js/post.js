/**
 * By Noble H. Mushtak
 * In Public Domain
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */
var hider=document.getElementById("hider"),chatCenter=document.getElementById("chat-center");hider.addEventListener("click",function(){hider.style.display="none",loadChatCenter(),chatCenter.style.display="block"});