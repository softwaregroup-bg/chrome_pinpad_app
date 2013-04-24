var usb         = chrome.usb;
var DEV_INFO = {"vendorId": 1659, "productId": 8963};
var permissionObj = {"permissions": [{"usbDevices": [DEV_INFO] }]};
var transfer = {
    direction: 'in',
    endpoint: 1,
    length: 6
};

var device = function(mainProp){
    return {
        "set":function(k,v) {
            if(!this.properties)
                this.properties = {};
            this.properties[k] = v;
        },
        "onEvent":function() {
            if (usbEvent.resultCode) {
                console.log("Error: " + usbEvent.error);
                return;
            }
            console.log(usbEvent.data);
            // var buffer = new Int8Array(usbEvent.data);
            // amount += buffer[1] * 4;
            // usb.interruptTransfer( powerMateDevice, transfer, onEvent );
        },
        "mainProp":mainProp
    };
};

var startup = {
    devList:[],
    watchDog:function() {
        var self = this;
        if(this.devList.length == 0){
            setTimeout(function () {
                usb.findDevices(DEV_INFO,
                  function(devices) {
                    if (!devices || !devices.length) {
                        console.log('. ');
                        return self.watchDog();
                    }
                    console.log('Found device: ' + devices[0].handle);
                    usbDevice = devices[0];
                    var dev_ = new device(devices[0]);
                    dev_.set('devList',self.devList);
                    self.devList.push(dev_);

                    usb.interruptTransfer(dev_.mainProp, transfer, dev_.onEvent);
                    return self.watchDog();
                });
            }, 500);
        } else {
            console.log(this.devList);
        }
    }
};

document.getElementById("requestPermission").addEventListener('click', function() {
    chrome.permissions.request( permissionObj, function(result) {
        if (result) {
            console.log('waiting for device');
            startup.watchDog();
            document.body.children.item('div').style.display = 'none';
        } else {
            console.log('App was not granted the "usbDevices" permission.');
            console.log(chrome.runtime.lastError);
        }
    });
});