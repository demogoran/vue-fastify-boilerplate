Tested features:

Server-side:

Cache load with post-update using websockets
HTTP/2
BasicController extending, that allow to write more or less clean code(all try/catches moved to parent class). Also supports per-method auth validation(JWT, check this.allowedMethods).


Client-side:
Vue mixins(API wrapper, global state(method of components interaction), auto-save for specified fields, alert toast, websocket after-cache loader wrapper)