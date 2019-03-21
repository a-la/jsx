#!/usr/bin/env node
const stream = require('stream');
const os = require('os');
'use strict';
const {homedir:h} = os;
const {Transform:k} = stream;
function m(a) {
  if ("object" != typeof a) {
    return !1;
  }
  const {a:b, b:c} = a;
  a = -1 != ["string", "function"].indexOf(typeof c);
  return b instanceof RegExp && a;
}
const n = (a, b) => {
  if (!(b instanceof Error)) {
    throw b;
  }
  [, , a] = a.stack.split("\n", 3);
  a = b.stack.indexOf(a);
  if (-1 == a) {
    throw b;
  }
  a = b.stack.substr(0, a - 1);
  b.stack = a.substr(0, a.lastIndexOf("\n"));
  throw b;
};
const p = (a, b) => b.filter(m).reduce((a, {a:b, b:e}) => {
  if (this.c) {
    return a;
  }
  if ("string" == typeof e) {
    a = a.replace(b, e);
  } else {
    const d = e.bind(this);
    let c;
    return a.replace(b, (a, ...b) => {
      c = Error();
      try {
        return this.c ? a : d(a, ...b);
      } catch (l) {
        n(c, l);
      }
    });
  }
}, `${a}`);
const q = a => new RegExp(`%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_(\\d+)_%%`, "g"), r = (a, b) => `%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_${b}_%%`, t = (a, b) => Object.keys(a).reduce((c, d) => {
  {
    var e = a[d];
    var {g:f = r, w:g = q} = void 0 === b ? {} : b;
    const c = g(d);
    e = {name:d, a:e, f:c, g:f, map:{}, lastIndex:0};
  }
  return Object.assign({}, c, {[d]:e});
}, {}), u = (a, b) => {
  b = void 0 === b ? [] : b;
  const {f:c, map:d} = a;
  return {a:c, b(a, c) {
    a = d[c];
    delete d[c];
    return p(a, Array.isArray(b) ? b : [b]);
  }};
}, v = a => {
  const {a:b, map:c, g:d, name:e} = a;
  return {a:b, b(b) {
    const {lastIndex:f} = a;
    c[f] = b;
    a.lastIndex += 1;
    return d(e, f);
  }};
};
const x = /\s+at.*(?:\(|\s)(.*)\)?/, y = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, z = h(), A = a => {
  const {C:b = !1, A:c = ["pirates"]} = {}, d = new RegExp(y.source.replace("IGNORED_MODULES", c.join("|")));
  return a.replace(/\\/g, "/").split("\n").filter(a => {
    a = a.match(x);
    if (null === a || !a[1]) {
      return !0;
    }
    a = a[1];
    return a.includes(".app/Contents/Resources/electron.asar") || a.includes(".app/Contents/Resources/default_app.asar") ? !1 : !d.test(a);
  }).filter(a => "" !== a.trim()).map(a => b ? a.replace(x, (a, b) => a.replace(b, b.replace(z, "~"))) : a).join("\n");
};
class B extends k {
  constructor(a) {
    super();
    this.j = (Array.isArray(a) ? a : [a]).filter(m);
  }
  async reduce(a) {
    return await this.j.reduce(async(a, {a:c, b:d}) => {
      a = await a;
      if (this.c) {
        return a;
      }
      if ("string" == typeof d) {
        a = a.replace(c, d);
      } else {
        const b = d.bind(this), f = [];
        let g;
        d = a.replace(c, (a, ...c) => {
          g = Error();
          try {
            if (this.c) {
              return a;
            }
            const d = b(a, ...c);
            d instanceof Promise && f.push(d);
            return d;
          } catch (l) {
            n(g, l);
          }
        });
        if (f.length) {
          try {
            const b = await Promise.all(f);
            a = a.replace(c, () => b.shift());
          } catch (w) {
            n(g, w);
          }
        } else {
          a = d;
        }
      }
      return a;
    }, `${a}`);
  }
  async _transform(a, b, c) {
    try {
      const b = await this.reduce(a);
      this.push(b);
      c();
    } catch (d) {
      a = A(d.stack), d.stack = a, c(d);
    }
  }
}
class C extends B {
  constructor(a) {
    super(a);
    Promise.resolve();
  }
}
;var D = {get o() {
  return t;
}, get m() {
  return v;
}, get B() {
  return u;
}, get u() {
  return B;
}, get v() {
  return C;
}, get h() {
  return p;
}};
const E = (a = []) => {
  let b = 0, c;
  a = D.h("<App>\n</App>", [...a, {a:/[<>]/g, b(a, e) {
    if (c) {
      return a;
    }
    const d = "<" == a;
    b += d ? 1 : -1;
    0 == b && !d && (c = e);
    return a;
  }}]);
  if (b) {
    throw Error(1);
  }
  return {s:a, l:c};
};
class F {
  constructor(a) {
    Object.assign(this, a);
  }
}
;var G;
{
  var H;
  {
    const [, a] = /<\s*(.+?)(?:\s+[\s\S]+)?\s*\/?\s*>/.exec("<App>\n</App>") || [];
    H = a;
  }
  let a, b;
  const {i:c} = D.o({i:/=>/g});
  let d;
  try {
    ({s:d, l:a} = E([D.m(c)]));
  } catch (g) {
    if (1 === g) {
      throw Error(`Could not find the matching closing > for ${H}.`);
    }
  }
  const e = d.slice(0, a + 1);
  let f = e.replace(/<\s*[^\s/>]+/, "");
  if (/\/\s*>$/.test(f)) {
    b = f.replace(/\/\s*>$/, ""), f = "", G = new F({F:e.replace(c.f, "=>"), D:b.replace(c.f, "=>"), content:"", tagName:H});
  } else {
    throw b = f.replace(/>$/, ""), a = !1, Error(`Could not find the matching closing </${H}>.`);
  }
}
console.log(G);

