!function(window, undefined) {
    function output(level, args) {
        Debug.output && Debug.output.append('<div class="' + level + '">' + args + "</div>");
    }
    var Debug = function() {}, hasConsole = window.console !== undefined;
    Debug.GENERAL = 0, Debug.DEBUG = 1, Debug.INFO = 2, Debug.WARN = 3, Debug.ERROR = 4, 
    Debug.minLogLevel = Debug.GENERAL, Debug.enabled = !0, Debug.output = null, Debug._NET_PORT = 1025, 
    Debug._isConnected = !1, Debug._socket = null, Debug._messageObj = null, Debug._messageQueue = null, 
    Debug.connect = function(ipAddr) {
        if (!("WebSocket" in window || "MozWebSocket" in window)) return !1;
        window.WebSocket = WebSocket || MozWebSocket;
        try {
            var s = Debug._socket = new WebSocket("ws://" + ipAddr + ":" + Debug._NET_PORT);
            s.onopen = onConnect, s.onmessage = function() {}, s.onclose = onClose, s.onerror = onClose, 
            Debug._messageQueue = [], Debug._isConnected = !0;
        } catch (error) {
            return !1;
        }
        return !0;
    }, Debug.disconnect = function() {
        Debug._isConnected && (Debug._socket.close(), onClose());
    };
    var onConnect = function() {
        window.onerror = globalErrorHandler, Debug._messageObj = {
            level: "session",
            message: ""
        }, Debug._socket.send(JSON.stringify(Debug._messageObj));
        for (var i = 0; i < Debug._messageQueue.length; ++i) Debug._socket.send(JSON.stringify(Debug._messageQueue[i]));
        Debug._messageQueue = null;
    }, globalErrorHandler = function(errorMsg, url, lineNumber) {
        return Debug.remoteLog("Error: " + errorMsg + " in " + url + " at line " + lineNumber, "ERROR"), 
        !1;
    }, onClose = function() {
        window.onerror = null, Debug._isConnected = !1;
        var s = Debug._socket;
        s.onopen = null, s.onmessage = null, s.onclose = null, s.onerror = null, Debug._socket = null, 
        Debug._messageObj = null, Debug._messageQueue = null;
    };
    Debug.remoteLog = function(message, level) {
        level || (level = "GENERAL"), Debug._messageQueue ? Debug._messageQueue.push({
            message: message,
            level: level
        }) : (Debug._messageObj.level = level, Debug._messageObj.message = message, Debug._socket.send(JSON.stringify(Debug._messageObj)));
    }, Debug.log = function(params) {
        Debug.enabled && (Debug._isConnected ? Debug.remoteLog(params, "GENERAL") : Debug.minLogLevel == Debug.GENERAL && hasConsole && (console.log(params), 
        output("general", params)));
    }, Debug.debug = function(params) {
        Debug.enabled && (Debug._isConnected ? Debug.remoteLog(params, "DEBUG") : Debug.minLogLevel <= Debug.DEBUG && hasConsole && (console.debug(params), 
        output("debug", params)));
    }, Debug.info = function(params) {
        Debug.enabled && (Debug._isConnected ? Debug.remoteLog(params, "INFO") : Debug.minLogLevel <= Debug.INFO && hasConsole && (console.info(params), 
        output("info", params)));
    }, Debug.warn = function(params) {
        Debug.enabled && (Debug._isConnected ? Debug.remoteLog(params, "WARNING") : Debug.minLogLevel <= Debug.WARN && hasConsole && (console.warn(params), 
        output("warn", params)));
    }, Debug.error = function(params) {
        Debug.enabled && (Debug._isConnected ? Debug.remoteLog(params, "ERROR") : hasConsole && (console.error(params), 
        output("error", params)));
    }, Debug.assert = function(truth, params) {
        hasConsole && Debug.enabled && console.assert && (console.assert(truth, params), 
        truth || output("error", params));
    }, Debug.dir = function(params) {
        Debug.minLogLevel == Debug.GENERAL && hasConsole && Debug.enabled && console.dir(params);
    }, Debug.clear = function() {
        hasConsole && Debug.enabled && (console.clear(), Debug.output && Debug.output.html(""));
    }, Debug.trace = function(params) {
        Debug.minLogLevel == Debug.GENERAL && hasConsole && Debug.enabled && console.trace(params);
    }, window.Debug = Debug;
}(window);