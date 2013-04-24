chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('usbdev.html', {
        bounds: {
        width: 400,
        height: 400
    }});
});