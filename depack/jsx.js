#!/usr/bin/env node
'use strict';
const fs = require('fs');
const vm = require('vm');
const stream = require('stream');
const os = require('os');             
const t = (a, c, d, b = !1, f = !1) => {
  const e = d ? new RegExp(`^-(${d}|-${c})$`) : new RegExp(`^--${c}$`);
  c = a.findIndex(g => e.test(g));
  if (-1 == c) {
    return {argv:a};
  }
  if (b) {
    return {value:!0, index:c, length:1};
  }
  b = a[c + 1];
  if (!b || "string" == typeof b && b.startsWith("--")) {
    return {argv:a};
  }
  f && (b = parseInt(b, 10));
  return {value:b, index:c, length:2};
}, u = a => {
  const c = [];
  for (let d = 0; d < a.length; d++) {
    const b = a[d];
    if (b.startsWith("-")) {
      break;
    }
    c.push(b);
  }
  return c;
};
const v = function(a = {}, c = process.argv) {
  let [, , ...d] = c;
  const b = u(d);
  d = d.slice(b.length);
  a = Object.entries(a).reduce((g, [h, k]) => {
    g[h] = "string" == typeof k ? {short:k} : k;
    return g;
  }, {});
  const f = [];
  a = Object.entries(a).reduce((g, [h, k]) => {
    let l;
    try {
      const m = k.short, n = k.boolean, p = k.number, q = k.command, r = k.multiple;
      if (q && r && b.length) {
        l = b;
      } else {
        if (q && b.length) {
          l = b[0];
        } else {
          const w = t(d, h, m, n, p);
          ({value:l} = w);
          const x = w.index, y = w.length;
          void 0 !== x && y && f.push({index:x, length:y});
        }
      }
    } catch (m) {
      return g;
    }
    return void 0 === l ? g : {...g, [h]:l};
  }, {});
  let e = d;
  f.forEach(({index:g, length:h}) => {
    Array.from({length:h}).forEach((k, l) => {
      e[g + l] = null;
    });
  });
  e = e.filter(g => null !== g);
  Object.assign(a, {J:e});
  return a;
}({input:{description:"The location of the file to transpile.", command:!0}, preact:{description:"Whether to quote props for _Preact_.", boolean:!0, short:"p"}}), z = v.input, A = v.preact;
const B = fs.readFileSync;
const C = vm.Script;
const D = (a, c) => {
  const [d, , b] = a.split("\n");
  a = parseInt(d.replace(/.+?(\d+)$/, (e, g) => g)) - 1;
  const f = b.indexOf("^");
  ({length:c} = c.split("\n").slice(0, a).join("\n"));
  return c + f + (a ? 1 : 0);
};
const E = a => {
  try {
    new C(a);
  } catch (c) {
    const d = c.stack;
    if (!/Unexpected token '?</.test(c.message)) {
      throw c;
    }
    return D(d, a);
  }
  return null;
};
function F(a) {
  if ("object" != typeof a) {
    return !1;
  }
  const c = a.re instanceof RegExp;
  a = -1 != ["string", "function"].indexOf(typeof a.replacement);
  return c && a;
}
;function G(a, c) {
  function d() {
    return c.filter(F).reduce((b, {re:f, replacement:e}) => {
      if (this.m) {
        return b;
      }
      if ("string" == typeof e) {
        return b = b.replace(f, e);
      }
      {
        let g;
        return b.replace(f, (h, ...k) => {
          g = Error();
          try {
            return this.m ? h : e.call(this, h, ...k);
          } catch (l) {
            {
              h = l;
              if (!(h instanceof Error)) {
                throw h;
              }
              [, , k] = g.stack.split("\n", 3);
              k = h.stack.indexOf(k);
              if (-1 == k) {
                throw h;
              }
              k = h.stack.substr(0, k - 1);
              const m = k.lastIndexOf("\n");
              h.stack = k.substr(0, m);
              throw h;
            }
          }
        });
      }
    }, `${a}`);
  }
  d.brake = () => {
    d.m = !0;
  };
  return d.call(d);
}
;const H = a => new RegExp(`%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_(\\d+)_%%`, "g"), I = (a, c) => `%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_${c}_%%`, J = (a, c) => Object.keys(a).reduce((d, b) => {
  {
    var f = a[b];
    const {getReplacement:e = I, getRegex:g = H} = c || {}, h = g(b);
    f = {name:b, re:f, regExp:h, getReplacement:e, map:{}, lastIndex:0};
  }
  return {...d, [b]:f};
}, {}), K = a => {
  var c = [];
  const d = a.map;
  return {re:a.regExp, replacement(b, f) {
    b = d[f];
    delete d[f];
    return G(b, Array.isArray(c) ? c : [c]);
  }};
}, L = a => {
  const c = a.map, d = a.getReplacement, b = a.name;
  return {re:a.re, replacement(f) {
    const e = a.lastIndex;
    c[e] = f;
    a.lastIndex += 1;
    return d(b, e);
  }};
};
const M = os.homedir;
M();
const N = a => {
  [, a] = /<\s*(.+?)(?:\s+[\s\S]+)?\s*\/?\s*>/.exec(a) || [];
  return a;
}, P = (a, {l:c = !1} = {}) => {
  let d = 0;
  const b = [];
  let f;
  G(a, [{re:/[{}]/g, replacement(m, n) {
    m = "}" == m;
    const p = !m;
    if (!d && m) {
      throw Error("A closing } is found without opening one.");
    }
    d += p ? 1 : -1;
    1 == d && p ? f = {open:n} : 0 == d && m && (f.close = n, b.push(f), f = {});
  }}]);
  if (d) {
    throw Error(`Unbalanced props (level ${d}) ${a}`);
  }
  const e = {}, g = [], h = {};
  var k = b.reduce((m, {open:n, close:p}) => {
    m = a.slice(m, n);
    const [, q, r, w, x] = /(\s*)(\S+)(\s*)=(\s*)$/.exec(m) || [];
    n = a.slice(n + 1, p);
    if (!r && !/\s*\.\.\./.test(n)) {
      throw Error("Could not detect prop name");
    }
    r ? e[r] = n : g.push(n);
    h[r] = {before:q, s:w, o:x};
    n = m || "";
    n = n.slice(0, n.length - (r || "").length - 1);
    const {j:y, f:X} = O(n);
    Object.assign(e, y);
    Object.assign(h, X);
    return p + 1;
  }, 0);
  if (b.length) {
    k = a.slice(k);
    const {j:m, f:n} = O(k);
    Object.assign(e, m);
    Object.assign(h, n);
  } else {
    const {j:m, f:n} = O(a);
    Object.assign(e, m);
    Object.assign(h, n);
  }
  let l = e;
  if (c) {
    ({...l} = e);
    const m = [];
    Object.keys(l).forEach(n => {
      const p = n[0];
      p.toUpperCase() == p && (m.push(n), delete l[n]);
    });
    m.length && (c = m.join(" "), l.className ? /[`"']$/.test(l.className) ? l.className = l.className.replace(/([`"'])$/, ` ${c}$1`) : l.className += `+' ${c}'` : l.c ? /[`"']$/.test(l.c) ? l.c = l.c.replace(/([`"'])$/, ` ${c}$1`) : l.c += `+' ${c}'` : l.className = `'${c}'`);
  }
  return {i:l, h:g, f:h};
}, O = a => {
  const c = [], d = {};
  a.replace(/(\s*)(\S+)(\s*)=(\s*)(["'])([\s\S]+?)\5/g, (b, f, e, g, h, k, l, m) => {
    d[e] = {before:f, s:g, o:h};
    c.push({g:m, name:e, w:`${k}${l}${k}`});
    return "%".repeat(b.length);
  }).replace(/(\s*)([^\s%]+)/g, (b, f, e, g) => {
    d[e] = {before:f};
    c.push({g, name:e, w:"true"});
  });
  return {j:[...c.reduce((b, {g:f, name:e, w:g}) => {
    b[f] = [e, g];
    return b;
  }, [])].filter(Boolean).reduce((b, [f, e]) => {
    b[f] = e;
    return b;
  }, {}), f:d};
}, Q = (a, c = [], d = !1, b = {}, f = "") => {
  const e = Object.keys(a);
  return e.length || c.length ? `{${e.reduce((g, h) => {
    const k = a[h], l = d || -1 != h.indexOf("-") ? `'${h}'` : h, {before:m = "", s:n = "", o:p = ""} = b[h] || {};
    return [...g, `${m}${l}${n}:${p}${k}`];
  }, c).join(",")}${f}}` : "{}";
}, R = (a = "") => {
  [a] = a;
  if (!a) {
    throw Error("No tag name is given");
  }
  return a.toUpperCase() == a;
}, S = (a, c = {}, d = [], b = [], f = !1, e = null, g = {}, h = "") => {
  const k = R(a), l = k ? a : `'${a}'`;
  if (!Object.keys(c).length && !d.length && !b.length) {
    return `h(${l})`;
  }
  const m = k && "dom" == f ? !1 : f;
  k || !b.length || f && "dom" != f || e && e(`JSX: destructuring ${b.join(" ")} is used without quoted props on HTML ${a}.`);
  a = Q(c, b, m, g, h);
  c = d.reduce((n, p, q) => {
    q = d[q - 1];
    return `${n}${q && /\S/.test(q) ? "," : ""}${p}`;
  }, "");
  return `h(${l},${a}${c ? `,${c}` : ""})`;
};
const T = (a, c = []) => {
  let d = 0, b;
  a = G(a, [...c, {re:/[<>]/g, replacement(f, e) {
    if (b) {
      return f;
    }
    const g = "<" == f;
    d += g ? 1 : -1;
    0 == d && !g && (b = e);
    return f;
  }}]);
  if (d) {
    throw Error(1);
  }
  return {I:a, u:b};
}, V = a => {
  const c = N(a);
  let d;
  const {A:b} = J({A:/=>/g});
  try {
    ({I:k, u:d} = T(a, [L(b)]));
  } catch (l) {
    if (1 === l) {
      throw Error(`Could not find the matching closing > for ${c}.`);
    }
  }
  const f = k.slice(0, d + 1);
  var e = f.replace(/<\s*[^\s/>]+/, "");
  if (/\/\s*>$/.test(e)) {
    return a = e.replace(/\/\s*>$/, ""), e = "", new U({b:f.replace(b.regExp, "=>"), a:a.replace(b.regExp, "=>"), content:"", tagName:c});
  }
  a = e.replace(/>$/, "");
  e = d + 1;
  d = !1;
  let g = 1, h;
  G(k, [{re:new RegExp(`[\\s\\S](?:<\\s*${c}(\\s+|>)|/\\s*${c}\\s*>)`, "g"), replacement(l, m, n, p) {
    if (d) {
      return l;
    }
    m = !m && l.endsWith(">");
    const q = !m;
    if (q) {
      p = p.slice(n);
      const {u:r} = T(p.replace(/^[\s\S]/, " "));
      p = p.slice(0, r + 1);
      if (/\/\s*>$/.test(p)) {
        return l;
      }
    }
    g += q ? 1 : -1;
    0 == g && m && (d = n, h = d + l.length);
    return l;
  }}]);
  if (g) {
    throw Error(`Could not find the matching closing </${c}>.`);
  }
  e = k.slice(e, d);
  var k = k.slice(0, h).replace(b.regExp, "=>");
  return new U({b:k, a:a.replace(b.regExp, "=>"), content:e.replace(b.regExp, "=>"), tagName:c});
};
class U {
  constructor(a) {
    this.b = a.b;
    this.a = a.a;
    this.content = a.content;
    this.tagName = a.tagName;
  }
}
;const W = a => {
  let c = "", d = "";
  a = a.replace(/^(\r?\n\s*)([\s\S]+)?/, (b, f, e = "") => {
    c = f;
    return e;
  }).replace(/([\s\S]+?)?(\r?\n\s*)$/, (b, f = "", e = "") => {
    d = e;
    return f;
  });
  return `${c}${a ? `\`${a}\`` : ""}${d}`;
}, ba = a => {
  const c = [];
  let d = {}, b = 0, f = 0;
  G(a, [{re:/[<{}]/g, replacement(e, g) {
    if (!(g < f)) {
      if (/[{}]/.test(e)) {
        b += "{" == e ? 1 : -1, 1 == b && void 0 == d.from ? d.from = g : 0 == b && (d.v = g + 1, d.D = a.slice(d.from + 1, g), c.push(d), d = {});
      } else {
        if (b) {
          return e;
        }
        e = V(a.slice(g));
        f = g + e.b.length;
        d.F = e;
        d.v = f;
        d.from = g;
        c.push(d);
        d = {};
      }
    }
  }}, {}]);
  return c.length ? aa(a, c) : [W(a)];
}, aa = (a, c) => {
  let d = 0;
  c = c.reduce((b, {from:f, v:e, D:g, F:h}) => {
    (f = a.slice(d, f)) && b.push(W(f));
    d = e;
    g ? b.push(g) : h && b.push(h);
    return b;
  }, []);
  if (d < a.length) {
    const b = a.slice(d, a.length);
    b && c.push(W(b));
  }
  return c;
};
const Z = (a, c = {}) => {
  var d = c.quoteProps, b = c.warn;
  const f = c.prop2class;
  var e = E(a);
  if (null === e) {
    return a;
  }
  var g = a.slice(e);
  const {a:h = "", content:k, tagName:l, b:{length:m}} = V(g);
  g = Y(k, d, b, c);
  const {i:n, h:p, f:q} = P(h.replace(/^ */, ""), {l:f});
  b = S(l, n, g, p, d, b, q, /\s*$/.exec(h) || [""]);
  d = a.slice(0, e);
  a = a.slice(e + m);
  e = m - b.length;
  0 < e && (b = `${" ".repeat(e)}${b}`);
  a = `${d}${b}${a}`;
  return Z(a, c);
}, Y = (a, c = !1, d = null, b = {}) => a ? ba(a).reduce((f, e) => {
  if (e instanceof U) {
    const {a:k = "", content:l, tagName:m} = e, {i:n, h:p} = P(k, {l:b.prop2class});
    e = Y(l, c, d);
    e = S(m, n, e, p, c, d);
    return [...f, e];
  }
  const g = E(e);
  if (g) {
    var h = e.slice(g);
    const {b:{length:k}, a:l = "", content:m, tagName:n} = V(h), {i:p, h:q} = P(l, {l:b.prop2class});
    h = Y(m, c, d);
    h = S(n, p, h, q, c, d);
    const r = e.slice(0, g);
    e = e.slice(g + k);
    return [...f, `${r}${h}${e}`];
  }
  return [...f, e];
}, []) : [];
z || (console.log("Please specify the file to transpile."), process.exit(1));
const ca = ((a, c = {}) => {
  const {e:d, B:b, C:f, g:e, G:g, H:h} = J({B:/^ *export\s+default\s+{[\s\S]+?}/mg, e:/^ *export\s+(?:default\s+)?/mg, C:/^ *export\s+{[^}]+}\s+from\s+(['"])(?:.+?)\1/mg, g:/^ *import(\s+([^\s,]+)\s*,?)?(\s*{(?:[^}]+)})?\s+from\s+['"].+['"]/gm, G:/^ *import\s+(?:(.+?)\s*,\s*)?\*\s+as\s+.+?\s+from\s+['"].+['"]/gm, H:/^ *import\s+['"].+['"]/gm}, {getReplacement(k, l) {
    return `/*%%_RESTREAM_${k.toUpperCase()}_REPLACEMENT_${l}_%%*/`;
  }, getRegex(k) {
    return new RegExp(`/\\*%%_RESTREAM_${k.toUpperCase()}_REPLACEMENT_(\\d+)_%%\\*/`, "g");
  }});
  a = G(a, [L(f), L(b), L(d), L(e), L(g), L(h)]);
  c = Z(a, c);
  return G(c, [K(f), K(b), K(d), K(e), K(g), K(h)]);
})(`${B(z)}`, {quoteProps:A ? "dom" : void 0});
console.log(ca);


//# sourceMappingURL=jsx.js.map