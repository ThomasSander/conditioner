define(function(){"use strict";var a=document?document.body:null;return a&&a.compareDocumentPosition?function(a,b){return!!(16&a.compareDocumentPosition(b))}:a&&a.contains?function(a,b){return a!=b&&a.contains(b)}:function(a,b){for(var c=b.parentNode;c;){if(c===a)return!0;c=c.parentNode}return!1}});