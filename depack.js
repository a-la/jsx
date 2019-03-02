#!/usr/bin/env node
const vm = require('vm');
const stream = require('stream');
const os = require('os');
function n(a) {
  var b = 0;
  return function() {
    return b < a.length ? {done:!1, value:a[b++]} : {done:!0};
  };
}
function p(a) {
  var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
  return b ? b.call(a) : {next:n(a)};
}
function r(a) {
  if (!(a instanceof Array)) {
    a = p(a);
    for (var b, c = []; !(b = a.next()).done;) {
      c.push(b.value);
    }
    a = c;
  }
  return a;
}
var aa = "function" == typeof Object.create ? Object.create : function(a) {
  function b() {
  }
  b.prototype = a;
  return new b;
}, t;
if ("function" == typeof Object.setPrototypeOf) {
  t = Object.setPrototypeOf;
} else {
  var u;
  a: {
    var ba = {P:!0}, v = {};
    try {
      v.__proto__ = ba;
      u = v.P;
      break a;
    } catch (a) {
    }
    u = !1;
  }
  t = u ? function(a, b) {
    a.__proto__ = b;
    if (a.__proto__ !== b) {
      throw new TypeError(a + " is not extensible");
    }
    return a;
  } : null;
}
var w = t;
function y(a, b) {
  a.prototype = aa(b.prototype);
  a.prototype.constructor = a;
  if (w) {
    w(a, b);
  } else {
    for (var c in b) {
      if ("prototype" != c) {
        if (Object.defineProperties) {
          var f = Object.getOwnPropertyDescriptor(b, c);
          f && Object.defineProperty(a, c, f);
        } else {
          a[c] = b[c];
        }
      }
    }
  }
  a.ia = b.prototype;
}
var z = "undefined" != typeof window && window === this ? this : "undefined" != typeof global && null != global ? global : this, A = "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
  a != Array.prototype && a != Object.prototype && (a[b] = c.value);
};
function B(a, b) {
  if (b) {
    var c = z;
    a = a.split(".");
    for (var f = 0; f < a.length - 1; f++) {
      var d = a[f];
      d in c || (c[d] = {});
      c = c[d];
    }
    a = a[a.length - 1];
    f = c[a];
    b = b(f);
    b != f && null != b && A(c, a, {configurable:!0, writable:!0, value:b});
  }
}
B("Promise", function(a) {
  function b(a) {
    this.b = 0;
    this.g = void 0;
    this.a = [];
    var b = this.c();
    try {
      a(b.resolve, b.reject);
    } catch (k) {
      b.reject(k);
    }
  }
  function c() {
    this.a = null;
  }
  function f(a) {
    return a instanceof b ? a : new b(function(b) {
      b(a);
    });
  }
  if (a) {
    return a;
  }
  c.prototype.b = function(a) {
    if (null == this.a) {
      this.a = [];
      var b = this;
      this.c(function() {
        b.g();
      });
    }
    this.a.push(a);
  };
  var d = z.setTimeout;
  c.prototype.c = function(a) {
    d(a, 0);
  };
  c.prototype.g = function() {
    for (; this.a && this.a.length;) {
      var a = this.a;
      this.a = [];
      for (var b = 0; b < a.length; ++b) {
        var c = a[b];
        a[b] = null;
        try {
          c();
        } catch (h) {
          this.f(h);
        }
      }
    }
    this.a = null;
  };
  c.prototype.f = function(a) {
    this.c(function() {
      throw a;
    });
  };
  b.prototype.c = function() {
    function a(a) {
      return function(d) {
        c || (c = !0, a.call(b, d));
      };
    }
    var b = this, c = !1;
    return {resolve:a(this.aa), reject:a(this.f)};
  };
  b.prototype.aa = function(a) {
    if (a === this) {
      this.f(new TypeError("A Promise cannot resolve to itself"));
    } else {
      if (a instanceof b) {
        this.ba(a);
      } else {
        a: {
          switch(typeof a) {
            case "object":
              var c = null != a;
              break a;
            case "function":
              c = !0;
              break a;
            default:
              c = !1;
          }
        }
        c ? this.Y(a) : this.h(a);
      }
    }
  };
  b.prototype.Y = function(a) {
    var b = void 0;
    try {
      b = a.then;
    } catch (k) {
      this.f(k);
      return;
    }
    "function" == typeof b ? this.ca(b, a) : this.h(a);
  };
  b.prototype.f = function(a) {
    this.j(2, a);
  };
  b.prototype.h = function(a) {
    this.j(1, a);
  };
  b.prototype.j = function(a, b) {
    if (0 != this.b) {
      throw Error("Cannot settle(" + a + ", " + b + "): Promise already settled in state" + this.b);
    }
    this.b = a;
    this.g = b;
    this.B();
  };
  b.prototype.B = function() {
    if (null != this.a) {
      for (var a = 0; a < this.a.length; ++a) {
        e.b(this.a[a]);
      }
      this.a = null;
    }
  };
  var e = new c;
  b.prototype.ba = function(a) {
    var b = this.c();
    a.v(b.resolve, b.reject);
  };
  b.prototype.ca = function(a, b) {
    var c = this.c();
    try {
      a.call(b, c.resolve, c.reject);
    } catch (h) {
      c.reject(h);
    }
  };
  b.prototype.then = function(a, c) {
    function d(a, b) {
      return "function" == typeof a ? function(b) {
        try {
          f(a(b));
        } catch (la) {
          e(la);
        }
      } : b;
    }
    var f, e, g = new b(function(a, b) {
      f = a;
      e = b;
    });
    this.v(d(a, f), d(c, e));
    return g;
  };
  b.prototype.catch = function(a) {
    return this.then(void 0, a);
  };
  b.prototype.v = function(a, b) {
    function c() {
      switch(d.b) {
        case 1:
          a(d.g);
          break;
        case 2:
          b(d.g);
          break;
        default:
          throw Error("Unexpected state: " + d.b);
      }
    }
    var d = this;
    null == this.a ? e.b(c) : this.a.push(c);
  };
  b.resolve = f;
  b.reject = function(a) {
    return new b(function(b, c) {
      c(a);
    });
  };
  b.race = function(a) {
    return new b(function(b, c) {
      for (var d = p(a), e = d.next(); !e.done; e = d.next()) {
        f(e.value).v(b, c);
      }
    });
  };
  b.all = function(a) {
    var c = p(a), d = c.next();
    return d.done ? f([]) : new b(function(a, b) {
      function e(b) {
        return function(c) {
          g[b] = c;
          k--;
          0 == k && a(g);
        };
      }
      var g = [], k = 0;
      do {
        g.push(void 0), k++, f(d.value).v(e(g.length - 1), b), d = c.next();
      } while (!d.done);
    });
  };
  return b;
});
function C() {
  C = function() {
  };
  z.Symbol || (z.Symbol = ca);
}
var ca = function() {
  var a = 0;
  return function(b) {
    return "jscomp_symbol_" + (b || "") + a++;
  };
}();
function D() {
  C();
  var a = z.Symbol.iterator;
  a || (a = z.Symbol.iterator = z.Symbol("iterator"));
  "function" != typeof Array.prototype[a] && A(Array.prototype, a, {configurable:!0, writable:!0, value:function() {
    return da(n(this));
  }});
  D = function() {
  };
}
function da(a) {
  D();
  a = {next:a};
  a[z.Symbol.iterator] = function() {
    return this;
  };
  return a;
}
function E() {
  this.h = !1;
  this.b = null;
  this.f = void 0;
  this.a = 1;
  this.B = this.g = 0;
  this.c = null;
}
function F(a) {
  if (a.h) {
    throw new TypeError("Generator is already running");
  }
  a.h = !0;
}
E.prototype.j = function(a) {
  this.f = a;
};
function G(a, b) {
  a.c = {K:b, X:!0};
  a.a = a.g || a.B;
}
E.prototype.return = function(a) {
  this.c = {return:a};
  this.a = this.B;
};
function H(a, b, c) {
  a.a = c;
  return {value:b};
}
function I(a, b) {
  a.a = b;
  a.g = 0;
}
function J(a) {
  a.g = 0;
  var b = a.c.K;
  a.c = null;
  return b;
}
function ea(a) {
  this.a = new E;
  this.b = a;
}
function fa(a, b) {
  F(a.a);
  var c = a.a.b;
  if (c) {
    return K(a, "return" in c ? c["return"] : function(a) {
      return {value:a, done:!0};
    }, b, a.a.return);
  }
  a.a.return(b);
  return L(a);
}
function K(a, b, c, f) {
  try {
    var d = b.call(a.a.b, c);
    if (!(d instanceof Object)) {
      throw new TypeError("Iterator result " + d + " is not an object");
    }
    if (!d.done) {
      return a.a.h = !1, d;
    }
    var e = d.value;
  } catch (g) {
    return a.a.b = null, G(a.a, g), L(a);
  }
  a.a.b = null;
  f.call(a.a, e);
  return L(a);
}
function L(a) {
  for (; a.a.a;) {
    try {
      var b = a.b(a.a);
      if (b) {
        return a.a.h = !1, {value:b.value, done:!1};
      }
    } catch (c) {
      a.a.f = void 0, G(a.a, c);
    }
  }
  a.a.h = !1;
  if (a.a.c) {
    b = a.a.c;
    a.a.c = null;
    if (b.X) {
      throw b.K;
    }
    return {value:b.return, done:!0};
  }
  return {value:void 0, done:!0};
}
function ha(a) {
  this.next = function(b) {
    F(a.a);
    a.a.b ? b = K(a, a.a.b.next, b, a.a.j) : (a.a.j(b), b = L(a));
    return b;
  };
  this.throw = function(b) {
    F(a.a);
    a.a.b ? b = K(a, a.a.b["throw"], b, a.a.j) : (G(a.a, b), b = L(a));
    return b;
  };
  this.return = function(b) {
    return fa(a, b);
  };
  D();
  this[Symbol.iterator] = function() {
    return this;
  };
}
function ia(a) {
  function b(b) {
    return a.next(b);
  }
  function c(b) {
    return a.throw(b);
  }
  return new Promise(function(f, d) {
    function e(a) {
      a.done ? f(a.value) : Promise.resolve(a.value).then(b, c).then(e, d);
    }
    e(a.next());
  });
}
function M(a) {
  return ia(new ha(new ea(a)));
}
var ja = "function" == typeof Object.assign ? Object.assign : function(a, b) {
  for (var c = 1; c < arguments.length; c++) {
    var f = arguments[c];
    if (f) {
      for (var d in f) {
        Object.prototype.hasOwnProperty.call(f, d) && (a[d] = f[d]);
      }
    }
  }
  return a;
};
B("Object.assign", function(a) {
  return a || ja;
});
B("Object.is", function(a) {
  return a ? a : function(a, c) {
    return a === c ? 0 !== a || 1 / a === 1 / c : a !== a && c !== c;
  };
});
function N(a, b, c) {
  if (null == a) {
    throw new TypeError("The 'this' value for String.prototype." + c + " must not be null or undefined");
  }
  if (b instanceof RegExp) {
    throw new TypeError("First argument to String.prototype." + c + " must not be a regular expression");
  }
  return a + "";
}
B("String.prototype.includes", function(a) {
  return a ? a : function(a, c) {
    return -1 !== N(this, a, "includes").indexOf(a, c || 0);
  };
});
B("String.prototype.repeat", function(a) {
  return a ? a : function(a) {
    var b = N(this, null, "repeat");
    if (0 > a || 1342177279 < a) {
      throw new RangeError("Invalid count value");
    }
    a |= 0;
    for (var f = ""; a;) {
      if (a & 1 && (f += b), a >>>= 1) {
        b += b;
      }
    }
    return f;
  };
});
B("String.prototype.endsWith", function(a) {
  return a ? a : function(a, c) {
    var b = N(this, a, "endsWith");
    void 0 === c && (c = b.length);
    c = Math.max(0, Math.min(c | 0, b.length));
    for (var d = a.length; 0 < d && 0 < c;) {
      if (b[--c] != a[--d]) {
        return !1;
      }
    }
    return 0 >= d;
  };
});
var O = stream.Transform;
function ka(a) {
  if ("object" != typeof a) {
    return !1;
  }
  var b = -1 != ["string", "function"].indexOf(typeof a.s);
  return a.i instanceof RegExp && b;
}
function P(a, b) {
  if (!(b instanceof Error)) {
    throw b;
  }
  a = p(a.stack.split("\n", 3));
  a.next();
  a.next();
  a = a.next().value;
  a = b.stack.indexOf(a);
  if (-1 == a) {
    throw b;
  }
  a = b.stack.substr(0, a - 1);
  b.stack = a.substr(0, a.lastIndexOf("\n"));
  throw b;
}
;var Q = this;
function ma(a, b) {
  return b.filter(ka).reduce(function(a, b) {
    var c = b.i;
    b = b.s;
    if (Q.a) {
      return a;
    }
    if ("string" == typeof b) {
      a = a.replace(c, b);
    } else {
      var f = b.bind(Q), g;
      return a.replace(c, function(a, b) {
        for (var c = [], d = 1; d < arguments.length; ++d) {
          c[d - 1] = arguments[d];
        }
        g = Error();
        try {
          return Q.a ? a : f.apply(null, [a].concat(r(c)));
        } catch (q) {
          P(g, q);
        }
      });
    }
  }, "" + a);
}
;function na(a) {
  return new RegExp("%%_RESTREAM_" + a.toUpperCase() + "_REPLACEMENT_(\\d+)_%%", "g");
}
function oa(a, b) {
  return "%%_RESTREAM_" + a.toUpperCase() + "_REPLACEMENT_" + b + "_%%";
}
function pa(a, b) {
  return Object.keys(a).reduce(function(c, f) {
    var d = {}, e = void 0 === b ? {} : b;
    return Object.assign({}, c, (d[f] = {name:f, i:a[f], J:(void 0 === e.L ? na : e.L)(f), w:void 0 === e.w ? oa : e.w, map:{}, lastIndex:0}, d));
  }, {});
}
function qa(a, b) {
  b = void 0 === b ? [] : b;
  var c = a.map;
  return {i:a.J, s:function(a, d) {
    a = c[d];
    delete c[d];
    return ma(a, Array.isArray(b) ? b : [b]);
  }};
}
function ra(a) {
  var b = a.map, c = a.w, f = a.name;
  return {i:a.i, s:function(d) {
    var e = a.lastIndex;
    b[e] = d;
    a.lastIndex += 1;
    return c(f, e);
  }};
}
;var sa = /\s+at.*(?:\(|\s)(.*)\)?/, ta = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, ua = os.homedir();
function va(a) {
  var b = void 0 === b ? {} : b;
  var c = void 0 === b.$ ? !1 : b.$, f = new RegExp(ta.source.replace("IGNORED_MODULES", (void 0 === b.V ? ["pirates"] : b.V).join("|")));
  return a.replace(/\\/g, "/").split("\n").filter(function(a) {
    a = a.match(sa);
    if (null === a || !a[1]) {
      return !0;
    }
    a = a[1];
    return a.includes(".app/Contents/Resources/electron.asar") || a.includes(".app/Contents/Resources/default_app.asar") ? !1 : !f.test(a);
  }).filter(function(a) {
    return "" !== a.trim();
  }).map(function(a) {
    return c ? a.replace(sa, function(a, b) {
      return a.replace(b, b.replace(ua, "~"));
    }) : a;
  }).join("\n");
}
;function R(a) {
  var b = O.call(this) || this;
  a = (Array.isArray(a) ? a : [a]).filter(ka);
  b.b = a;
  return b;
}
y(R, O);
R.prototype.reduce = function(a) {
  var b = this, c;
  return M(function(f) {
    if (1 == f.a) {
      return H(f, b.b.reduce(function(a, c) {
        var d = c.i, f = c.s, e, h, m, q, x, U, V;
        return M(function(c) {
          switch(c.a) {
            case 1:
              return H(c, a, 2);
            case 2:
              e = c.f;
              if (b.a) {
                return c.return(e);
              }
              if ("string" == typeof f) {
                e = e.replace(d, f);
                c.a = 3;
                break;
              }
              h = f.bind(b);
              m = [];
              x = e.replace(d, function(a, c) {
                for (var d = [], f = 1; f < arguments.length; ++f) {
                  d[f - 1] = arguments[f];
                }
                q = Error();
                try {
                  if (b.a) {
                    return a;
                  }
                  var e = h.apply(null, [a].concat(r(d)));
                  e instanceof Promise && m.push(e);
                  return e;
                } catch (Ba) {
                  P(q, Ba);
                }
              });
              if (!m.length) {
                e = x;
                c.a = 3;
                break;
              }
              c.g = 5;
              return H(c, Promise.all(m), 7);
            case 7:
              U = c.f;
              e = e.replace(d, function() {
                return U.shift();
              });
              I(c, 3);
              break;
            case 5:
              V = J(c), P(q, V);
            case 3:
              return c.return(e);
          }
        });
      }, "" + a), 2);
    }
    c = f.f;
    return f.return(c);
  });
};
R.prototype._transform = function(a, b, c) {
  var f = this, d, e, g;
  return M(function(b) {
    if (1 == b.a) {
      return b.g = 2, H(b, f.reduce(a), 4);
    }
    if (2 != b.a) {
      return d = b.f, f.push(d), c(), I(b, 0);
    }
    e = J(b);
    g = va(e.stack);
    e.stack = g;
    c(e);
    b.a = 0;
  });
};
function wa(a) {
  a = R.call(this, a) || this;
  a.c = Promise.resolve();
  return a;
}
y(wa, R);
var S = {get M() {
  return pa;
}, get l() {
  return ra;
}, get o() {
  return qa;
}, get da() {
  return R;
}, get ea() {
  return wa;
}, get C() {
  return ma;
}};
var xa = vm.Script;
function ya(a, b) {
  var c = p(a.split("\n"));
  a = c.next().value;
  c.next();
  c = c.next().value;
  a = parseInt(a.replace(/.+?(\d+)$/, function(a, b) {
    return b;
  })) - 1;
  c = c.indexOf("^");
  return b.split("\n").slice(0, a).join("\n").length + c + (a ? 1 : 0);
}
;function za(a) {
  try {
    new xa(a);
  } catch (f) {
    var b = f, c = b.stack;
    if ("Unexpected token <" != b.message) {
      throw f;
    }
    return ya(c, a);
  }
  return null;
}
;function T(a) {
  var b = [], c = {}, f = [], d = {}, e = b.reduce(function(b, e) {
    var g = e.open;
    e = e.close;
    var h = a.slice(b, g), l = p(/(\s*)(\S+)(\s*)=(\s*)$/.exec(h) || []);
    l.next();
    var q = l.next().value;
    b = l.next().value;
    var x = l.next().value;
    l = l.next().value;
    g = a.slice(g + 1, e);
    if (!b && !/\s*\.\.\./.test(g)) {
      throw Error("Could not detect prop name");
    }
    b ? c[b] = g : f.push(g);
    d[b] = {before:q, F:x, D:l};
    g = h || "";
    g = g.slice(0, g.length - (b || "").length - 1);
    g = W(g);
    b = g.u;
    Object.assign(c, g.I);
    Object.assign(d, b);
    return e + 1;
  }, 0);
  b.length ? (b = a.slice(e), b = W(b), e = b.u, Object.assign(c, b.I), Object.assign(d, e)) : (b = W(a), e = b.u, Object.assign(c, b.I), Object.assign(d, e));
  return {H:c, G:f, u:d};
}
function W(a) {
  var b = [], c = {};
  a.replace(/(\s*)(\S+)(\s*)=(\s*)(["'])([\s\S]+?)\5/g, function(a, d, e, g, l, k, h, m) {
    c[e] = {before:d, F:g, D:l};
    b.push({A:m, name:e, O:"" + k + h + k});
    return "%".repeat(a.length);
  }).replace(/(\s*)([^\s%]+)/g, function(a, d, e, g) {
    c[e] = {before:d};
    b.push({A:g, name:e, O:"true"});
  });
  return {I:[].concat(r(b.reduce(function(a, b) {
    a[b.A] = [b.name, b.O];
    return a;
  }, []))).filter(Boolean).reduce(function(a, b) {
    var c = p(b);
    b = c.next().value;
    c = c.next().value;
    a[b] = c;
    return a;
  }, {}), u:c};
}
function Aa(a, b, c, f, d) {
  b = void 0 === b ? [] : b;
  c = void 0 === c ? !1 : c;
  f = void 0 === f ? {} : f;
  d = void 0 === d ? "" : d;
  return Object.keys(a).length || b.length ? "{" + Object.keys(a).reduce(function(b, d) {
    var e = a[d], g = c || -1 != d.indexOf("-") ? "'" + d + "'" : d, h = f[d] || {};
    d = void 0 === h.before ? "" : h.before;
    var m = void 0 === h.F ? "" : h.F;
    h = void 0 === h.D ? "" : h.D;
    return [].concat(r(b), ["" + d + g + m + ":" + h + e]);
  }, b).join(",") + d + "}" : "{}";
}
function Ca(a) {
  a = p(void 0 === a ? "" : a).next().value;
  if (!a) {
    throw Error("No tag name is given");
  }
  return a.toUpperCase() == a;
}
function X(a, b, c, f, d, e, g, l) {
  b = void 0 === b ? {} : b;
  c = void 0 === c ? [] : c;
  f = void 0 === f ? [] : f;
  d = void 0 === d ? !1 : d;
  var k = Ca(a), h = k ? a : "'" + a + "'";
  if (!Object.keys(b).length && !c.length && !f.length) {
    return "h(" + h + ")";
  }
  var m = k && "dom" == d ? !1 : d;
  k || !f.length || d && "dom" != d || e && e("JSX: destructuring " + f.join(" ") + " is used without quoted props on HTML " + a + ".");
  a = Aa(b, f, m, g, l);
  b = c.reduce(function(a, b, d) {
    d = (d = c[d - 1]) && /\S/.test(d) ? "," : "";
    return "" + a + d + b;
  }, "");
  return "h(" + h + "," + a + (b ? "," + b : "") + ")";
}
;function Da(a, b) {
  b = void 0 === b ? [] : b;
  var c = 0, f;
  a = S.C(a, [].concat(r(b), [{i:/[<>]/g, s:function(a, b) {
    if (f) {
      return a;
    }
    var d = "<" == a;
    c += d ? 1 : -1;
    0 == c && !d && (f = b);
    return a;
  }}]));
  if (c) {
    throw Error(1);
  }
  return {Z:a, S:f};
}
function Ea(a) {
  var b = p(/<\s*(.+?)(?:\s+[\s\S]+)?\s*\/?\s*>/.exec(a) || []);
  b.next();
  b = b.next().value;
  var c = S.M({R:/=>/g}).R;
  try {
    var f = Da(a, [S.l(c)]);
    var d = f.Z;
    var e = f.S;
  } catch (g) {
    if (1 === g) {
      throw Error("Could not find the matching closing > for " + b + ".");
    }
  }
  a = d.slice(0, e + 1);
  e = a.replace(/<\s*[^\s/>]+/, "");
  if (/\/\s*>$/.test(e)) {
    return e = e.replace(/\/\s*>$/, ""), new Fa({N:a.replace(c.J, "=>"), m:e.replace(c.J, "=>"), content:"", tagName:b});
  }
  e.replace(/>$/, "");
  throw Error("Could not find the matching closing </" + b + ">.");
}
function Fa(a) {
  Object.assign(this, a);
}
;function Y(a) {
  var b = "", c = "";
  a = a.replace(/^(\n\s*)([\s\S]+)?/, function(a, c, e) {
    b = c;
    return void 0 === e ? "" : e;
  }).replace(/([\s\S]+?)?(\n\s*)$/, function(a, b, e) {
    c = e;
    return void 0 === b ? "" : b;
  });
  return "" + b + (a ? "`" + a + "`" : "") + c;
}
function Ga(a) {
  var b = [];
  return b.length ? Ha(a, b) : [Y(a)];
}
function Ha(a, b) {
  var c = 0;
  b = b.reduce(function(b, e) {
    var d = e.ja, f = e.fa, k = e.ga;
    (e = a.slice(c, e.from)) && b.push(Y(e));
    c = d;
    f ? b.push(f) : k && b.push(k);
    return b;
  }, []);
  if (c < a.length) {
    var f = a.slice(c, a.length);
    f && b.push(Y(f));
  }
  return b;
}
;function Ia(a, b) {
  var c = b = void 0 === b ? {} : b, f = c.ha, d = c.warn;
  c = za(a);
  if (null === c) {
    return a;
  }
  var e = a.slice(c), g = Ea(e), l = void 0 === g.m ? "" : g.m, k = g.tagName;
  e = g.N.length;
  g = Z(g.content, f, d);
  var h = T(l.replace(/^ */, "")), m = h.H, q = h.G;
  h = h.u;
  l = /\s*$/.exec(l) || [""];
  d = X(k, m, g, q, f, d, h, l);
  f = a.slice(0, c);
  a = a.slice(c + e);
  c = e - d.length;
  e = d;
  0 < c && (e = " ".repeat(c) + e);
  return Ia(f + e + a, b);
}
function Z(a, b, c) {
  b = void 0 === b ? !1 : b;
  return a ? Ga(a).reduce(function(a, d) {
    if (d instanceof Fa) {
      var e = d.content, f = d.tagName, l = T(void 0 === d.m ? "" : d.m);
      d = l.H;
      l = l.G;
      e = Z(e, b, c);
      d = X(f, d, e, l, b, c);
      return [].concat(r(a), [d]);
    }
    if (f = za(d)) {
      e = d.slice(f);
      var k = Ea(e);
      e = k.N.length;
      var h = k.content;
      l = k.tagName;
      var m = T(void 0 === k.m ? "" : k.m);
      k = m.H;
      m = m.G;
      h = Z(h, b, c);
      l = X(l, k, h, m, b, c);
      h = d.slice(0, f);
      d = d.slice(f + e);
      return [].concat(r(a), ["" + h + l + d]);
    }
    return [].concat(r(a), [d]);
  }, []) : [];
}
;var Ja = function(a, b) {
  b = void 0 === b ? {} : b;
  var c = S.M({e:/^ *export\s+(?:default\s+)?/mg, T:/^ *export\s+{[^}]+}\s+from\s+(['"])(?:.+?)\1/mg, A:/^ *import(\s+([^\s,]+)\s*,?)?(\s*{(?:[^}]+)})?\s+from\s+['"].+['"]/gm, U:/^ *import\s+(?:(.+?)\s*,\s*)?\*\s+as\s+.+?\s+from\s+['"].+['"]/gm, W:/^ *import\s+['"].+['"]/gm}, {w:function(a, b) {
    return "/*%%_RESTREAM_" + a.toUpperCase() + "_REPLACEMENT_" + b + "_%%*/";
  }, L:function(a) {
    return new RegExp("/\\*%%_RESTREAM_" + a.toUpperCase() + "_REPLACEMENT_(\\d+)_%%\\*/", "g");
  }}), f = c.e, d = c.T, e = c.A, g = c.U;
  c = c.W;
  a = Ia(S.C(a, [S.l(d), S.l(f), S.l(e), S.l(g), S.l(c)]), b);
  return S.C(a, [S.o(d), S.o(f), S.o(e), S.o(g), S.o(c)]);
}("<App>\n</App>");
console.log(Ja);

