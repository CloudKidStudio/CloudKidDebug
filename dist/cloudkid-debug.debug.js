!function(window, undefined) {
    function output(level, args) {
        Debug.output && Debug.output.append('<div class="' + level + '">' + args + "</div>");
    }
    function JSC_stringify(obj, depth) {
        depth || (depth = 1);
        for (var spacing = "", endSpacing = "", i = 0; 4 * depth > i; ++i) spacing += "&nbsp;", 
        4 * (depth - 1) > i && (endSpacing += "&nbsp;");
        var rtn = "{<br />";
        for (var key in obj) if ("document" != key && "window" != key && "ownerDocument" != key && "view" != key && "target" != key && "currentTarget" != key && "originalTarget" != key && "explicitOriginalTarget" != key && "rangeParent" != key && "srcElement" != key && "relatedTarget" != key && "fromElement" != key && "toElement" != key) switch (typeof obj[key]) {
          case "string":
          case "number":
          case "boolean":
          case "bool":
            rtn += spacing + key + ": " + obj[key] + "<br />";
            break;

          case "object":
            rtn += spacing + key + ": " + JSC_stringify(obj[key], depth + 1) + "<br />";
            break;

          case "function":
            rtn += spacing + key + ": (function)<br />";
            break;

          default:
            rtn += spacing + key + ": " + obj[key] + "<br />";
        }
        return rtn += endSpacing + "}";
    }
    function JSC_format(input) {
        return "string" == typeof input ? input.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;").replace(/\n/g, "<br />") : "object" == typeof input ? JSC_stringify(input) : input;
    }
    var Debug = function() {}, hasConsole = window.console !== undefined;
    Debug.GENERAL = 0, Debug.DEBUG = 1, Debug.INFO = 2, Debug.WARN = 3, Debug.ERROR = 4, 
    Debug.minLogLevel = Debug.GENERAL, Debug.enabled = !0, Debug.output = null, Debug._isJSConsole = window.remote === window.console, 
    Debug._NET_PORT = 1025, Debug._isConnected = !1, Debug._socket = null, Debug._messageObj = null, 
    Debug._messageQueue = null, Debug.connect = function(ipAddr) {
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
    }, globalErrorHandler = function(message, file, line, column, error) {
        var logMessage = "Error: " + message + " in " + file + " at line " + line;
        return column !== undefined && (logMessage += ":" + column), error && (logMessage += "\n" + error.stack), 
        Debug.remoteLog(logMessage, "ERROR"), !1;
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
        Debug.enabled && (Debug._isConnected ? Debug.remoteLog(params, "GENERAL") : Debug.minLogLevel == Debug.GENERAL && hasConsole && (console.log(Debug._isJSConsole ? JSC_format(params) : params), 
        output("general", params)));
    }, Debug.debug = function(params) {
        Debug.enabled && (Debug._isConnected ? Debug.remoteLog(params, "DEBUG") : Debug.minLogLevel <= Debug.DEBUG && hasConsole && (console.debug(Debug._isJSConsole ? JSC_format(params) : params), 
        output("debug", params)));
    }, Debug.info = function(params) {
        Debug.enabled && (Debug._isConnected ? Debug.remoteLog(params, "INFO") : Debug.minLogLevel <= Debug.INFO && hasConsole && (console.info(Debug._isJSConsole ? JSC_format(params) : params), 
        output("info", params)));
    }, Debug.warn = function(params) {
        Debug.enabled && (Debug._isConnected ? Debug.remoteLog(params, "WARNING") : Debug.minLogLevel <= Debug.WARN && hasConsole && (console.warn(Debug._isJSConsole ? JSC_format(params) : params), 
        output("warn", params)));
    }, Debug.error = function(params) {
        Debug.enabled && (Debug._isConnected ? Debug.remoteLog(params, "ERROR") : hasConsole && (console.error(Debug._isJSConsole ? JSC_format(params) : params), 
        output("error", params)));
    }, Debug.assert = function(truth, params) {
        hasConsole && Debug.enabled && console.assert && (console.assert(truth, Debug._isJSConsole ? JSC_format(params) : params), 
        truth || output("error", params));
    }, Debug.dir = function(params) {
        Debug.minLogLevel == Debug.GENERAL && hasConsole && Debug.enabled && console.dir(Debug._isJSConsole ? JSC_format(params) : params);
    }, Debug.clear = function() {
        hasConsole && Debug.enabled && (console.clear(), Debug.output && Debug.output.html(""));
    }, Debug.trace = function(params) {
        Debug.minLogLevel == Debug.GENERAL && hasConsole && Debug.enabled && console.trace(Debug._isJSConsole ? JSC_format(params) : params);
    }, window.Debug = Debug;
}(window);