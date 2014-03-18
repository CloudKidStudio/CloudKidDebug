CloudKid Debug
==============

JavaScript wrapper for console debugger also allows sending of logs over a WebSocket connection.

##Usage##

Basic functionality is pretty much the same as `console`.

```js
Debug.log('Something');
Debug.debug('Debug statement');
Debug.info('Info statement');
Debug.warn('Warning here');
Debug.error('Error here');
Debug.assert(true, 'If assert is false');
```

Connection over WebSocket using an IP address.

```js
Debug.connect('10.1.10.1');
```

Set the minimum debug level to help limit spam.

```js
// Show only logs that are a warning or higher
Debug.minLogLevel(Debug.WARN);
```

Here are the log levels in order from lowest to highest importance.

- `Debug.GENERAL`
- `Debug.DEBUG`
- `Debug.INFO`
- `Debug.WARN`
- `Debug.ERROR`

##Installation##

CloudKid Debug can be install using Bower.

```bash
bower install cloudkid-debug
```

##License##

Copyright (c) 2014 [CloudKid](http://github.com/cloudkidstudio)

Released under the MIT License.