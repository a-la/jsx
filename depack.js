#!/usr/bin/env node
const stream = require('stream');
const os = require('os');
function h(a) {
  var b = 0;
  return function() {
    return b < a.length ? {done:!1, value:a[b++]} : {done:!0};
  };
}
function m(a) {
  var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
  return b ? b.call(a) : {next:h(a)};
}
function n(a) {
  if (!(a instanceof Array)) {
    a = m(a);
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
}, p;
if ("function" == typeof Object.setPrototypeOf) {
  p = Object.setPrototypeOf;
} else {
  var r;
  a: {
    var ba = {A:!0}, u = {};
    try {
      u.__proto__ = ba;
      r = u.A;
      break a;
    } catch (a) {
    }
    r = !1;
  }
  p = r ? function(a, b) {
    a.__proto__ = b;
    if (a.__proto__ !== b) {
      throw new TypeError(a + " is not extensible");
    }
    return a;
  } : null;
}
var v = p;
function w(a, b) {
  a.prototype = aa(b.prototype);
  a.prototype.constructor = a;
  if (v) {
    v(a, b);
  } else {
    for (var c in b) {
      if ("prototype" != c) {
        if (Object.defineProperties) {
          var d = Object.getOwnPropertyDescriptor(b, c);
          d && Object.defineProperty(a, c, d);
        } else {
          a[c] = b[c];
        }
      }
    }
  }
  a.V = b.prototype;
}
var x = "undefined" != typeof window && window === this ? this : "undefined" != typeof global && null != global ? global : this, y = "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
  a != Array.prototype && a != Object.prototype && (a[b] = c.value);
};
function A(a, b) {
  if (b) {
    var c = x;
    a = a.split(".");
    for (var d = 0; d < a.length - 1; d++) {
      var e = a[d];
      e in c || (c[e] = {});
      c = c[e];
    }
    a = a[a.length - 1];
    d = c[a];
    b = b(d);
    b != d && null != b && y(c, a, {configurable:!0, writable:!0, value:b});
  }
}
A("Promise", function(a) {
  function b(a) {
    this.b = 0;
    this.g = void 0;
    this.a = [];
    var b = this.c();
    try {
      a(b.resolve, b.reject);
    } catch (z) {
      b.reject(z);
    }
  }
  function c() {
    this.a = null;
  }
  function d(a) {
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
  var e = x.setTimeout;
  c.prototype.c = function(a) {
    e(a, 0);
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
        } catch (l) {
          this.f(l);
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
    return {resolve:a(this.K), reject:a(this.f)};
  };
  b.prototype.K = function(a) {
    if (a === this) {
      this.f(new TypeError("A Promise cannot resolve to itself"));
    } else {
      if (a instanceof b) {
        this.N(a);
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
        c ? this.H(a) : this.h(a);
      }
    }
  };
  b.prototype.H = function(a) {
    var b = void 0;
    try {
      b = a.then;
    } catch (z) {
      this.f(z);
      return;
    }
    "function" == typeof b ? this.O(b, a) : this.h(a);
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
    this.o();
  };
  b.prototype.o = function() {
    if (null != this.a) {
      for (var a = 0; a < this.a.length; ++a) {
        f.b(this.a[a]);
      }
      this.a = null;
    }
  };
  var f = new c;
  b.prototype.N = function(a) {
    var b = this.c();
    a.m(b.resolve, b.reject);
  };
  b.prototype.O = function(a, b) {
    var c = this.c();
    try {
      a.call(b, c.resolve, c.reject);
    } catch (l) {
      c.reject(l);
    }
  };
  b.prototype.then = function(a, c) {
    function d(a, b) {
      return "function" == typeof a ? function(b) {
        try {
          e(a(b));
        } catch (ma) {
          f(ma);
        }
      } : b;
    }
    var e, f, g = new b(function(a, b) {
      e = a;
      f = b;
    });
    this.m(d(a, e), d(c, f));
    return g;
  };
  b.prototype.catch = function(a) {
    return this.then(void 0, a);
  };
  b.prototype.m = function(a, b) {
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
    null == this.a ? f.b(c) : this.a.push(c);
  };
  b.resolve = d;
  b.reject = function(a) {
    return new b(function(b, c) {
      c(a);
    });
  };
  b.race = function(a) {
    return new b(function(b, c) {
      for (var e = m(a), f = e.next(); !f.done; f = e.next()) {
        d(f.value).m(b, c);
      }
    });
  };
  b.all = function(a) {
    var c = m(a), e = c.next();
    return e.done ? d([]) : new b(function(a, b) {
      function f(b) {
        return function(c) {
          g[b] = c;
          k--;
          0 == k && a(g);
        };
      }
      var g = [], k = 0;
      do {
        g.push(void 0), k++, d(e.value).m(f(g.length - 1), b), e = c.next();
      } while (!e.done);
    });
  };
  return b;
});
function B() {
  B = function() {
  };
  x.Symbol || (x.Symbol = ca);
}
var ca = function() {
  var a = 0;
  return function(b) {
    return "jscomp_symbol_" + (b || "") + a++;
  };
}();
function C() {
  B();
  var a = x.Symbol.iterator;
  a || (a = x.Symbol.iterator = x.Symbol("iterator"));
  "function" != typeof Array.prototype[a] && y(Array.prototype, a, {configurable:!0, writable:!0, value:function() {
    return da(h(this));
  }});
  C = function() {
  };
}
function da(a) {
  C();
  a = {next:a};
  a[x.Symbol.iterator] = function() {
    return this;
  };
  return a;
}
function D() {
  this.h = !1;
  this.b = null;
  this.f = void 0;
  this.a = 1;
  this.o = this.g = 0;
  this.c = null;
}
function E(a) {
  if (a.h) {
    throw new TypeError("Generator is already running");
  }
  a.h = !0;
}
D.prototype.j = function(a) {
  this.f = a;
};
function F(a, b) {
  a.c = {v:b, G:!0};
  a.a = a.g || a.o;
}
D.prototype.return = function(a) {
  this.c = {return:a};
  this.a = this.o;
};
function G(a, b, c) {
  a.a = c;
  return {value:b};
}
function H(a, b) {
  a.a = b;
  a.g = 0;
}
function I(a) {
  a.g = 0;
  var b = a.c.v;
  a.c = null;
  return b;
}
function ea(a) {
  this.a = new D;
  this.b = a;
}
function fa(a, b) {
  E(a.a);
  var c = a.a.b;
  if (c) {
    return J(a, "return" in c ? c["return"] : function(a) {
      return {value:a, done:!0};
    }, b, a.a.return);
  }
  a.a.return(b);
  return K(a);
}
function J(a, b, c, d) {
  try {
    var e = b.call(a.a.b, c);
    if (!(e instanceof Object)) {
      throw new TypeError("Iterator result " + e + " is not an object");
    }
    if (!e.done) {
      return a.a.h = !1, e;
    }
    var f = e.value;
  } catch (g) {
    return a.a.b = null, F(a.a, g), K(a);
  }
  a.a.b = null;
  d.call(a.a, f);
  return K(a);
}
function K(a) {
  for (; a.a.a;) {
    try {
      var b = a.b(a.a);
      if (b) {
        return a.a.h = !1, {value:b.value, done:!1};
      }
    } catch (c) {
      a.a.f = void 0, F(a.a, c);
    }
  }
  a.a.h = !1;
  if (a.a.c) {
    b = a.a.c;
    a.a.c = null;
    if (b.G) {
      throw b.v;
    }
    return {value:b.return, done:!0};
  }
  return {value:void 0, done:!0};
}
function ha(a) {
  this.next = function(b) {
    E(a.a);
    a.a.b ? b = J(a, a.a.b.next, b, a.a.j) : (a.a.j(b), b = K(a));
    return b;
  };
  this.throw = function(b) {
    E(a.a);
    a.a.b ? b = J(a, a.a.b["throw"], b, a.a.j) : (F(a.a, b), b = K(a));
    return b;
  };
  this.return = function(b) {
    return fa(a, b);
  };
  C();
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
  return new Promise(function(d, e) {
    function f(a) {
      a.done ? d(a.value) : Promise.resolve(a.value).then(b, c).then(f, e);
    }
    f(a.next());
  });
}
function L(a) {
  return ia(new ha(new ea(a)));
}
var ja = "function" == typeof Object.assign ? Object.assign : function(a, b) {
  for (var c = 1; c < arguments.length; c++) {
    var d = arguments[c];
    if (d) {
      for (var e in d) {
        Object.prototype.hasOwnProperty.call(d, e) && (a[e] = d[e]);
      }
    }
  }
  return a;
};
A("Object.assign", function(a) {
  return a || ja;
});
A("Object.is", function(a) {
  return a ? a : function(a, c) {
    return a === c ? 0 !== a || 1 / a === 1 / c : a !== a && c !== c;
  };
});
function M(a, b, c) {
  if (null == a) {
    throw new TypeError("The 'this' value for String.prototype." + c + " must not be null or undefined");
  }
  if (b instanceof RegExp) {
    throw new TypeError("First argument to String.prototype." + c + " must not be a regular expression");
  }
  return a + "";
}
A("String.prototype.includes", function(a) {
  return a ? a : function(a, c) {
    return -1 !== M(this, a, "includes").indexOf(a, c || 0);
  };
});
A("String.prototype.endsWith", function(a) {
  return a ? a : function(a, c) {
    var b = M(this, a, "endsWith");
    void 0 === c && (c = b.length);
    c = Math.max(0, Math.min(c | 0, b.length));
    for (var e = a.length; 0 < e && 0 < c;) {
      if (b[--c] != a[--e]) {
        return !1;
      }
    }
    return 0 >= e;
  };
});
var N = stream.Transform;
function ka(a) {
  if ("object" != typeof a) {
    return !1;
  }
  var b = -1 != ["string", "function"].indexOf(typeof a.l);
  return a.i instanceof RegExp && b;
}
function O(a, b) {
  if (!(b instanceof Error)) {
    throw b;
  }
  a = m(a.stack.split("\n", 3));
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
;var P = this;
function la(a, b) {
  return b.filter(ka).reduce(function(a, b) {
    var c = b.i;
    b = b.l;
    if (P.a) {
      return a;
    }
    if ("string" == typeof b) {
      a = a.replace(c, b);
    } else {
      var d = b.bind(P), g;
      return a.replace(c, function(a, b) {
        for (var c = [], e = 1; e < arguments.length; ++e) {
          c[e - 1] = arguments[e];
        }
        g = Error();
        try {
          return P.a ? a : d.apply(null, [a].concat(n(c)));
        } catch (q) {
          O(g, q);
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
  return Object.keys(a).reduce(function(c, d) {
    var e = a[d], f = void 0 === b ? {} : b, g = void 0 === f.s ? oa : f.s;
    f = (void 0 === f.D ? na : f.D)(d);
    var k = {};
    return Object.assign({}, c, (k[d] = {name:d, i:e, u:f, s:g, map:{}, lastIndex:0}, k));
  }, {});
}
function qa(a, b) {
  b = void 0 === b ? [] : b;
  var c = a.map;
  return {i:a.u, l:function(a, e) {
    a = c[e];
    delete c[e];
    return la(a, Array.isArray(b) ? b : [b]);
  }};
}
function ra(a) {
  var b = a.map, c = a.s, d = a.name;
  return {i:a.i, l:function(e) {
    var f = a.lastIndex;
    b[f] = e;
    a.lastIndex += 1;
    return c(d, f);
  }};
}
;var sa = /\s+at.*(?:\(|\s)(.*)\)?/, ta = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, ua = os.homedir();
function va(a) {
  var b = void 0 === b ? {} : b;
  var c = void 0 === b.M ? !1 : b.M, d = new RegExp(ta.source.replace("IGNORED_MODULES", (void 0 === b.F ? ["pirates"] : b.F).join("|")));
  return a.replace(/\\/g, "/").split("\n").filter(function(a) {
    a = a.match(sa);
    if (null === a || !a[1]) {
      return !0;
    }
    a = a[1];
    return a.includes(".app/Contents/Resources/electron.asar") || a.includes(".app/Contents/Resources/default_app.asar") ? !1 : !d.test(a);
  }).filter(function(a) {
    return "" !== a.trim();
  }).map(function(a) {
    return c ? a.replace(sa, function(a, b) {
      return a.replace(b, b.replace(ua, "~"));
    }) : a;
  }).join("\n");
}
;function Q(a) {
  var b = N.call(this) || this;
  a = (Array.isArray(a) ? a : [a]).filter(ka);
  b.b = a;
  return b;
}
w(Q, N);
Q.prototype.reduce = function(a) {
  var b = this, c;
  return L(function(d) {
    if (1 == d.a) {
      return G(d, b.b.reduce(function(a, c) {
        var d = c.i, e = c.l, f, l, t, q, S, T, U;
        return L(function(c) {
          switch(c.a) {
            case 1:
              return G(c, a, 2);
            case 2:
              f = c.f;
              if (b.a) {
                return c.return(f);
              }
              if ("string" == typeof e) {
                f = f.replace(d, e);
                c.a = 3;
                break;
              }
              l = e.bind(b);
              t = [];
              S = f.replace(d, function(a, c) {
                for (var d = [], e = 1; e < arguments.length; ++e) {
                  d[e - 1] = arguments[e];
                }
                q = Error();
                try {
                  if (b.a) {
                    return a;
                  }
                  var f = l.apply(null, [a].concat(n(d)));
                  f instanceof Promise && t.push(f);
                  return f;
                } catch (Ca) {
                  O(q, Ca);
                }
              });
              if (!t.length) {
                f = S;
                c.a = 3;
                break;
              }
              c.g = 5;
              return G(c, Promise.all(t), 7);
            case 7:
              T = c.f;
              f = f.replace(d, function() {
                return T.shift();
              });
              H(c, 3);
              break;
            case 5:
              U = I(c), O(q, U);
            case 3:
              return c.return(f);
          }
        });
      }, "" + a), 2);
    }
    c = d.f;
    return d.return(c);
  });
};
Q.prototype._transform = function(a, b, c) {
  var d = this, e, f, g;
  return L(function(b) {
    if (1 == b.a) {
      return b.g = 2, G(b, d.reduce(a), 4);
    }
    if (2 != b.a) {
      return e = b.f, d.push(e), c(), H(b, 0);
    }
    f = I(b);
    g = va(f.stack);
    f.stack = g;
    c(f);
    b.a = 0;
  });
};
function wa(a) {
  a = Q.call(this, a) || this;
  a.c = Promise.resolve();
  return a;
}
w(wa, Q);
var R = {get J() {
  return pa;
}, get I() {
  return ra;
}, get S() {
  return qa;
}, get P() {
  return Q;
}, get R() {
  return wa;
}, get w() {
  return la;
}};
function xa() {
  var a = [R.I(V)];
  a = void 0 === a ? [] : a;
  var b = 0, c;
  a = R.w("<App>\n</App>", [].concat(n(a), [{i:/[<>]/g, l:function(a, e) {
    if (c) {
      return a;
    }
    var d = "<" == a;
    b += d ? 1 : -1;
    0 == b && !d && (c = e);
    return a;
  }}]));
  if (b) {
    throw Error(1);
  }
  return {L:a, C:c};
}
function ya() {
  var a = {U:za.replace(V.u, "=>"), T:W.replace(V.u, "=>"), content:"", tagName:X};
  Object.assign(this, a);
}
;var Aa;
var Ba = m(/<\s*(.+?)(?:\s+[\s\S]+)?\s*\/?\s*>/.exec("<App>\n</App>") || []);
Ba.next();
var X = Ba.next().value, Y, W, V = R.J({B:/=>/g}).B, Da;
try {
  var Ea = xa();
  Da = Ea.L;
  Y = Ea.C;
} catch (a) {
  if (1 === a) {
    throw Error("Could not find the matching closing > for " + X + ".");
  }
}
var za = Da.slice(0, Y + 1), Z = za.replace(/<\s*[^\s/>]+/, "");
if (/\/\s*>$/.test(Z)) {
  W = Z.replace(/\/\s*>$/, ""), Z = "", Aa = new ya;
} else {
  throw W = Z.replace(/>$/, ""), Y = !1, Error("Could not find the matching closing </" + X + ">.");
}
console.log(Aa);

