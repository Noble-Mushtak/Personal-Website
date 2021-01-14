/**
 * DOMParser HTML extension
 * 2012-09-04
 * 
 * By Eli Grey, http://eligrey.com
 * Public domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*! @source https://gist.github.com/1129031 */
/* global document, DOMParser */
//Chrome not allowed regular DOMParser because it doesn't support <marquee>
(function(d){"use strict";var p=d.prototype,r=p.parseFromString;try{if((new DOMParser).parseFromString("","text/html")&&navigator.userAgent.indexOf("Chrome")==-1)return;}catch(e){}p.parseFromString=function(m,t){if(/^\s*text\/html\s*(?:;|$)/i.test(t)){var doc=document.implementation.createHTMLDocument("");if(m.toLowerCase().indexOf('<!doctype')+1)doc.documentElement.innerHTML=m;else doc.body.innerHTML=m;return doc;}else return r.apply(this, arguments);};}(DOMParser));