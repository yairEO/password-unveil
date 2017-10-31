var _NAME = "passUnveil";

// https://gist.github.com/yairEO/cb60592476a4204b27e83048949dbb45
var events = {
    on(event, cb, opts){
        if( !this.namespaces ) // save the namespaces on the DOM element itself
        this.namespaces = {};

        this.namespaces[event] = cb;
        var options = opts || false;

        this.addEventListener( event.split('.')[0], cb, options );
        return this;
    },
    off(event) {
        this.removeEventListener( event.split('.')[0], this.namespaces[event] );
        delete this.namespaces[event];
        return this;
    }
}

// Extend the DOM with these above custom methods
window.on  = document.on  = Element.prototype.on  = events.on;
window.off = document.off = Element.prototype.off = events.off;


////////////////////////////////////////////////////////////////
// init

var lastElm; // last element which was unveiled (by mouse hover)

chrome.storage.sync.get("toggle", function(res){
    init( res.toggle )
});

chrome.storage.onChanged.addListener(function(changes, namespace){
    init( changes.toggle.newValue )
});

function init( state ){
    state = state ? "on" : "off";

    document[state]('mouseover.'+ _NAME, onMouseover)
    document[state]('mouseout.' + _NAME, onMouseout)
}


////////////////////////////////////////////////////////////////
// callbacks

function onMouseover(e){
    var elm = e.target;
        unveiledElms = document.querySelectorAll('input[type=' + _NAME);

    // reset any forgotter previous elements which were unveiled and never masked again on "mouseout" event
    for( var i = unveiledElms.length; i--; ) {
        unveiledElms[i].type = 'password';
    }

    if( elm.nodeName == 'INPUT' && elm.type == 'password' ){
        elm.type = _NAME;
        lastElm = elm;
    }
}

function onMouseout(e){
    if( lastElm ){
        lastElm.type = 'password';
        lastElm = null;
    }
}