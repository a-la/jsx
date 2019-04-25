#!/usr/bin/env node
'use strict';
const fs = require('fs');
const vm = require('vm');
const stream = require('stream');
const os = require('os');             
const r = (a, b, c, e, d) => {
  e = void 0 === e ? !1 : e;
  d = void 0 === d ? !1 : d;
  const f = c ? new RegExp(`^-(${c}|-${b})`) : new RegExp(`^--${b}`);
  b = a.findIndex(g => f.test(g));
  if (-1 == b) {
    return {argv:a};
  }
  if (e) {
    return {value:!0, argv:[...a.slice(0, b), ...a.slice(b + 1)]};
  }
  e = b + 1;
  c = a[e];
  if (!c || "string" == typeof c && c.startsWith("--")) {
    return {argv:a};
  }
  d && (c = parseInt(c, 10));
  return {value:c, argv:[...a.slice(0, b), ...a.slice(e + 1)]};
}, t = a => {
  const b = [];
  for (let c = 0; c < a.length; c++) {
    const e = a[c];
    if (e.startsWith("-")) {
      break;
    }
    b.push(e);
  }
  return b;
};
const u = function(a, b) {
  a = void 0 === a ? {} : a;
  b = void 0 === b ? process.argv : b;
  [, , ...b] = b;
  const c = t(b);
  b = b.slice(c.length);
  let e = !c.length;
  return Object.keys(a).reduce((d, f) => {
    var g = Object.assign({}, d);
    d = d.a;
    g = (delete g.a, g);
    if (0 == d.length && e) {
      return Object.assign({}, {a:d}, g);
    }
    const l = a[f];
    let h;
    if ("string" == typeof l) {
      ({value:h, argv:d} = r(d, f, l));
    } else {
      try {
        const {short:k, boolean:m, number:q, command:n, multiple:p} = l;
        n && p && c.length ? (h = c, e = !0) : n && c.length ? (h = c[0], e = !0) : {value:h, argv:d} = r(d, f, k, m, q);
      } catch (k) {
        return Object.assign({}, {a:d}, g);
      }
    }
    return void 0 === h ? Object.assign({}, {a:d}, g) : Object.assign({}, {a:d}, g, {[f]:h});
  }, {a:b});
}({input:{description:"The location of the file to transpile.", command:!0}, preact:{description:"Whether to quote props for _Preact_.", boolean:!0, short:"p"}}), w = u.input, x = u.preact;
const {readFileSync:y} = fs;
const {Script:z} = vm;
const A = (a, b) => {
  const [c, , e] = a.split("\n");
  a = parseInt(c.replace(/.+?(\d+)$/, (f, g) => g)) - 1;
  const d = e.indexOf("^");
  ({length:b} = b.split("\n").slice(0, a).join("\n"));
  return b + d + (a ? 1 : 0);
};
const B = a => {
  try {
    new z(a);
  } catch (b) {
    const {message:c, stack:e} = b;
    if ("Unexpected token <" != c) {
      throw b;
    }
    return A(e, a);
  }
  return null;
};
function C(a) {
  if ("object" != typeof a) {
    return !1;
  }
  const {re:b, replacement:c} = a;
  a = b instanceof RegExp;
  const e = -1 != ["string", "function"].indexOf(typeof c);
  return a && e;
}
;function D(a, b) {
  function c() {
    return b.filter(C).reduce((e, {re:d, replacement:f}) => {
      if (this.l) {
        return e;
      }
      if ("string" == typeof f) {
        e = e.replace(d, f);
      } else {
        let g;
        return e.replace(d, (l, ...h) => {
          g = Error();
          try {
            return this.l ? l : f.call(this, l, ...h);
          } catch (k) {
            {
              l = k;
              if (!(l instanceof Error)) {
                throw l;
              }
              [, , h] = g.stack.split("\n", 3);
              h = l.stack.indexOf(h);
              if (-1 == h) {
                throw l;
              }
              h = l.stack.substr(0, h - 1);
              const m = h.lastIndexOf("\n");
              l.stack = h.substr(0, m);
              throw l;
            }
          }
        });
      }
    }, `${a}`);
  }
  c.brake = () => {
    c.l = !0;
  };
  return c.call(c);
}
;const E = a => new RegExp(`%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_(\\d+)_%%`, "g"), F = (a, b) => `%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_${b}_%%`, G = (a, b) => Object.keys(a).reduce((c, e) => {
  {
    var d = a[e];
    const {getReplacement:f = F, getRegex:g = E} = b || {}, l = g(e);
    d = {name:e, re:d, regExp:l, getReplacement:f, map:{}, lastIndex:0};
  }
  return Object.assign({}, c, {[e]:d});
}, {}), H = a => {
  var b = void 0 === b ? [] : b;
  const {regExp:c, map:e} = a;
  return {re:c, replacement(d, f) {
    d = e[f];
    delete e[f];
    return D(d, Array.isArray(b) ? b : [b]);
  }};
}, I = a => {
  const {re:b, map:c, getReplacement:e, name:d} = a;
  return {re:b, replacement(f) {
    const {lastIndex:g} = a;
    c[g] = f;
    a.lastIndex += 1;
    return e(d, g);
  }};
};
const {homedir:J} = os;
J();
const K = a => {
  [, a] = /<\s*(.+?)(?:\s+[\s\S]+)?\s*\/?\s*>/.exec(a) || [];
  return a;
}, M = a => {
  let b = 0;
  const c = [];
  let e;
  D(a, [{re:/[{}]/g, replacement(h, k) {
    h = "}" == h;
    const m = !h;
    if (!b && h) {
      throw Error("A closing } is found without opening one.");
    }
    b += m ? 1 : -1;
    1 == b && m ? e = {open:k} : 0 == b && h && (e.close = k, c.push(e), e = {});
  }}]);
  if (b) {
    throw Error(`Unbalanced props (level ${b}) ${a}`);
  }
  const d = {}, f = [], g = {};
  var l = c.reduce((h, {open:k, close:m}) => {
    h = a.slice(h, k);
    const [, q, n, p, v] = /(\s*)(\S+)(\s*)=(\s*)$/.exec(h) || [];
    k = a.slice(k + 1, m);
    if (!n && !/\s*\.\.\./.test(k)) {
      throw Error("Could not detect prop name");
    }
    n ? d[n] = k : f.push(k);
    g[n] = {before:q, o:p, m:v};
    k = h || "";
    k = k.slice(0, k.length - (n || "").length - 1);
    const {j:U, f:V} = L(k);
    Object.assign(d, U);
    Object.assign(g, V);
    return m + 1;
  }, 0);
  if (c.length) {
    l = a.slice(l);
    const {j:h, f:k} = L(l);
    Object.assign(d, h);
    Object.assign(g, k);
  } else {
    const {j:h, f:k} = L(a);
    Object.assign(d, h);
    Object.assign(g, k);
  }
  return {i:d, h:f, f:g};
}, L = a => {
  const b = [], c = {};
  a.replace(/(\s*)(\S+)(\s*)=(\s*)(["'])([\s\S]+?)\5/g, (e, d, f, g, l, h, k, m) => {
    c[f] = {before:d, o:g, m:l};
    b.push({g:m, name:f, v:`${h}${k}${h}`});
    return "%".repeat(e.length);
  }).replace(/(\s*)([^\s%]+)/g, (e, d, f, g) => {
    c[f] = {before:d};
    b.push({g, name:f, v:"true"});
  });
  return {j:[...b.reduce((e, {g:d, name:f, v:g}) => {
    e[d] = [f, g];
    return e;
  }, [])].filter(Boolean).reduce((e, [d, f]) => {
    e[d] = f;
    return e;
  }, {}), f:c};
}, N = (a, b = [], c = !1, e = {}, d = "") => {
  const f = Object.keys(a), {length:g} = f;
  return g || b.length ? `{${f.reduce((l, h) => {
    const k = a[h], m = c || -1 != h.indexOf("-") ? `'${h}'` : h, {before:q = "", o:n = "", m:p = ""} = e[h] || {};
    return [...l, `${q}${m}${n}:${p}${k}`];
  }, b).join(",")}${d}}` : "{}";
}, O = (a = "") => {
  [a] = a;
  if (!a) {
    throw Error("No tag name is given");
  }
  return a.toUpperCase() == a;
}, P = (a, b = {}, c = [], e = [], d = !1, f = null, g = {}, l = "") => {
  const h = O(a), k = h ? a : `'${a}'`;
  if (!Object.keys(b).length && !c.length && !e.length) {
    return `h(${k})`;
  }
  const m = h && "dom" == d ? !1 : d;
  h || !e.length || d && "dom" != d || f && f(`JSX: destructuring ${e.join(" ")} is used without quoted props on HTML ${a}.`);
  a = N(b, e, m, g, l);
  b = c.reduce((q, n, p) => {
    p = (p = c[p - 1]) && /\S/.test(p) ? "," : "";
    return `${q}${p}${n}`;
  }, "");
  return `h(${k},${a}${b ? `,${b}` : ""})`;
};
const Q = (a, b = []) => {
  let c = 0, e;
  a = D(a, [...b, {re:/[<>]/g, replacement(d, f) {
    if (e) {
      return d;
    }
    const g = "<" == d;
    c += g ? 1 : -1;
    0 == c && !g && (e = f);
    return d;
  }}]);
  if (c) {
    throw Error(1);
  }
  return {H:a, s:e};
}, S = a => {
  const b = K(a);
  let c;
  const {w:e} = G({w:/=>/g});
  try {
    ({H:h, s:c} = Q(a, [I(e)]));
  } catch (k) {
    if (1 === k) {
      throw Error(`Could not find the matching closing > for ${b}.`);
    }
  }
  const d = h.slice(0, c + 1);
  var f = d.replace(/<\s*[^\s/>]+/, "");
  if (/\/\s*>$/.test(f)) {
    return a = f.replace(/\/\s*>$/, ""), f = "", new R({c:d.replace(e.regExp, "=>"), b:a.replace(e.regExp, "=>"), content:"", tagName:b});
  }
  a = f.replace(/>$/, "");
  f = c + 1;
  c = !1;
  let g = 1, l;
  D(h, [{re:new RegExp(`[\\s\\S](?:<\\s*${b}(\\s+|>)|/\\s*${b}\\s*>)`, "g"), replacement(k, m, q, n) {
    if (c) {
      return k;
    }
    m = !m && k.endsWith(">");
    const p = !m;
    if (p) {
      n = n.slice(q);
      const {s:v} = Q(n.replace(/^[\s\S]/, " "));
      n = n.slice(0, v + 1);
      if (/\/\s*>$/.test(n)) {
        return k;
      }
    }
    g += p ? 1 : -1;
    0 == g && m && (c = q, l = c + k.length);
    return k;
  }}]);
  if (g) {
    throw Error(`Could not find the matching closing </${b}>.`);
  }
  f = h.slice(f, c);
  var h = h.slice(0, l).replace(e.regExp, "=>");
  return new R({c:h, b:a.replace(e.regExp, "=>"), content:f.replace(e.regExp, "=>"), tagName:b});
};
class R {
  constructor(a) {
    this.c = a.c;
    this.b = a.b;
    this.content = a.content;
    this.tagName = a.tagName;
  }
}
;const T = a => {
  let b = "", c = "";
  a = a.replace(/^(\n\s*)([\s\S]+)?/, (e, d, f = "") => {
    b = d;
    return f;
  }).replace(/([\s\S]+?)?(\n\s*)$/, (e, d = "", f = "") => {
    c = f;
    return d;
  });
  return `${b}${a ? `\`${a}\`` : ""}${c}`;
}, X = a => {
  const b = [];
  let c = {}, e = 0, d = 0;
  D(a, [{re:/[<{}]/g, replacement(f, g) {
    if (!(g < d)) {
      if (/[{}]/.test(f)) {
        e += "{" == f ? 1 : -1, 1 == e && void 0 == c.from ? c.from = g : 0 == e && (c.u = g + 1, c.C = a.slice(c.from + 1, g), b.push(c), c = {});
      } else {
        if (e) {
          return f;
        }
        f = S(a.slice(g));
        d = g + f.c.length;
        c.D = f;
        c.u = d;
        c.from = g;
        b.push(c);
        c = {};
      }
    }
  }}, {}]);
  return b.length ? W(a, b) : [T(a)];
}, W = (a, b) => {
  let c = 0;
  b = b.reduce((e, {from:d, u:f, C:g, D:l}) => {
    (d = a.slice(c, d)) && e.push(T(d));
    c = f;
    g ? e.push(g) : l && e.push(l);
    return e;
  }, []);
  if (c < a.length) {
    const e = a.slice(c, a.length);
    e && b.push(T(e));
  }
  return b;
};
const Z = (a, b = {}) => {
  const {quoteProps:c, warn:e} = b;
  var d = B(a);
  if (null === d) {
    return a;
  }
  var f = a.slice(d);
  const {b:g = "", content:l, tagName:h, c:{length:k}} = S(f);
  f = Y(l, c, e);
  const {i:m, h:q, f:n} = M(g.replace(/^ */, ""));
  var p = /\s*$/.exec(g) || [""];
  p = P(h, m, f, q, c, e, n, p);
  f = a.slice(0, d);
  a = a.slice(d + k);
  d = k - p.length;
  0 < d && (p = `${" ".repeat(d)}${p}`);
  a = `${f}${p}${a}`;
  return Z(a, b);
}, Y = (a, b = !1, c = null) => a ? X(a).reduce((e, d) => {
  if (d instanceof R) {
    const {b:l = "", content:h, tagName:k} = d, {i:m, h:q} = M(l);
    d = Y(h, b, c);
    d = P(k, m, d, q, b, c);
    return [...e, d];
  }
  const f = B(d);
  if (f) {
    var g = d.slice(f);
    const {c:{length:l}, b:h = "", content:k, tagName:m} = S(g), {i:q, h:n} = M(h);
    g = Y(k, b, c);
    g = P(m, q, g, n, b, c);
    const p = d.slice(0, f);
    d = d.slice(f + l);
    return [...e, `${p}${g}${d}`];
  }
  return [...e, d];
}, []) : [];
w || (console.log("Please specify the file to transpile."), process.exit(1));
const aa = ((a, b = {}) => {
  const {e:c, A:e, B:d, g:f, F:g, G:l} = G({A:/^ *export\s+default\s+{[\s\S]+?}/mg, e:/^ *export\s+(?:default\s+)?/mg, B:/^ *export\s+{[^}]+}\s+from\s+(['"])(?:.+?)\1/mg, g:/^ *import(\s+([^\s,]+)\s*,?)?(\s*{(?:[^}]+)})?\s+from\s+['"].+['"]/gm, F:/^ *import\s+(?:(.+?)\s*,\s*)?\*\s+as\s+.+?\s+from\s+['"].+['"]/gm, G:/^ *import\s+['"].+['"]/gm}, {getReplacement(h, k) {
    return `/*%%_RESTREAM_${h.toUpperCase()}_REPLACEMENT_${k}_%%*/`;
  }, getRegex(h) {
    return new RegExp(`/\\*%%_RESTREAM_${h.toUpperCase()}_REPLACEMENT_(\\d+)_%%\\*/`, "g");
  }});
  a = D(a, [I(d), I(e), I(c), I(f), I(g), I(l)]);
  b = Z(a, b);
  return D(b, [H(d), H(e), H(c), H(f), H(g), H(l)]);
})(`${y(w)}`, {quoteProps:x ? "dom" : void 0});
console.log(aa);


//# sourceMappingURL=jsx.js.map