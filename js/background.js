(function(){
    var isContentLoaded = false,
        isToggled = false;

    function changeIcon(){
        var iconName = isToggled ? 'icon19' : 'off';

        chrome.browserAction.setIcon({
            path : "icons/"+ iconName +".png",
            // tabId : tab.id
        });
    }

    function loadContent(){
        chrome.tabs.executeScript(null, {file: "js/content.js"}, function(){
            isContentLoaded = true;
        });
    }

    // get & set inital state
    chrome.storage.sync.get("toggle", function(res){
        if( "toggle" in res )
            isToggled = res.toggle;

        if( isToggled )
            changeIcon();

        // chrome-extension-make-it-run-every-page-load
        // https://stackoverflow.com/a/16720024/104380
        chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab){
            isContentLoaded = false;
            if( isToggled && changeInfo.status == 'complete' && tab.active )
                loadContent();
        })
    });

    chrome.browserAction.onClicked.addListener(function(tab){
        isToggled = !isToggled;

        if( !isContentLoaded )
            loadContent();

        changeIcon();

        // change state (chrome.storage API)
        chrome.storage.sync.set({"toggle":isToggled});
    })
})();