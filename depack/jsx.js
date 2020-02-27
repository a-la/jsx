#!/usr/bin/env node
'use strict';
const fs = require('fs');
const vm = require('vm');
const stream = require('stream');
const os = require('os');             
const v = (a, c, d, b = !1, f = !1) => {
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
}, w = a => {
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
const x = function(a = {}, c = process.argv) {
  let [, , ...d] = c;
  const b = w(d);
  d = d.slice(b.length);
  a = Object.entries(a).reduce((g, [h, k]) => {
    g[h] = "string" == typeof k ? {short:k} : k;
    return g;
  }, {});
  const f = [];
  a = Object.entries(a).reduce((g, [h, k]) => {
    let m;
    try {
      const q = k.short, p = k.boolean, n = k.number, l = k.command, r = k.multiple;
      if (l && r && b.length) {
        m = b;
      } else {
        if (l && b.length) {
          m = b[0];
        } else {
          const u = v(d, h, q, p, n);
          ({value:m} = u);
          const t = u.index, y = u.length;
          void 0 !== t && y && f.push({index:t, length:y});
        }
      }
    } catch (q) {
      return g;
    }
    return void 0 === m ? g : {...g, [h]:m};
  }, {});
  let e = d;
  f.forEach(({index:g, length:h}) => {
    Array.from({length:h}).forEach((k, m) => {
      e[g + m] = null;
    });
  });
  e = e.filter(g => null !== g);
  Object.assign(a, {J:e});
  return a;
}({input:{description:"The location of the file to transpile.", command:!0}, preact:{description:"Whether to quote props for _Preact_.", boolean:!0, short:"p"}}), z = x.input, A = x.preact;
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
          } catch (m) {
            {
              h = m;
              if (!(h instanceof Error)) {
                throw h;
              }
              [, , k] = g.stack.split("\n", 3);
              k = h.stack.indexOf(k);
              if (-1 == k) {
                throw h;
              }
              k = h.stack.substr(0, k - 1);
              const q = k.lastIndexOf("\n");
              h.stack = k.substr(0, q);
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
}, P = (a, {l:c = !1, classNames:d = [], renameMap:b = {}} = {}) => {
  let f = 0;
  const e = [];
  let g;
  G(a, [{re:/[{}]/g, replacement(n, l) {
    n = "}" == n;
    const r = !n;
    if (!f && n) {
      throw Error("A closing } is found without opening one.");
    }
    f += r ? 1 : -1;
    1 == f && r ? g = {open:l} : 0 == f && n && (g.close = l, e.push(g), g = {});
  }}]);
  if (f) {
    throw Error(`Unbalanced props (level ${f}) ${a}`);
  }
  const h = {}, k = [], m = {};
  var q = e.reduce((n, {open:l, close:r}) => {
    n = a.slice(n, l);
    const [, u, t, y, X] = /(\s*)(\S+)(\s*)=(\s*)$/.exec(n) || [];
    l = a.slice(l + 1, r);
    if (!t && !/\s*\.\.\./.test(l)) {
      throw Error("Could not detect prop name");
    }
    t ? h[t] = l : k.push(l);
    m[t] = {before:u, s:y, o:X};
    l = n || "";
    l = l.slice(0, l.length - (t || "").length - 1);
    const {j:Y, f:Z} = O(l);
    Object.assign(h, Y);
    Object.assign(m, Z);
    return r + 1;
  }, 0);
  if (e.length) {
    q = a.slice(q);
    const {j:n, f:l} = O(q);
    Object.assign(h, n);
    Object.assign(m, l);
  } else {
    const {j:n, f:l} = O(a);
    Object.assign(h, n);
    Object.assign(m, l);
  }
  let p = h;
  if (c || d.length) {
    ({...p} = h);
    const n = [];
    Object.keys(p).forEach(l => {
      if (d.includes(l)) {
        n.push(l), delete p[l];
      } else {
        if (c) {
          const r = l[0];
          r.toUpperCase() == r && (n.push(l), delete p[l]);
        }
      }
    });
    n.length && (q = n.map(l => l in b ? b[l] : l).join(" "), p.className ? /[`"']$/.test(p.className) ? p.className = p.className.replace(/([`"'])$/, ` ${q}$1`) : p.className += `+' ${q}'` : p.c ? /[`"']$/.test(p.c) ? p.c = p.c.replace(/([`"'])$/, ` ${q}$1`) : p.c += `+' ${q}'` : p.className = `'${q}'`);
  }
  return {i:p, h:k, f:m};
}, O = a => {
  const c = [], d = {};
  a.replace(/(\s*)(\S+)(\s*)=(\s*)(["'])([\s\S]*?)\5/g, (b, f, e, g, h, k, m, q) => {
    d[e] = {before:f, s:g, o:h};
    c.push({g:q, name:e, w:`${k}${m}${k}`});
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
}, aa = (a, c = [], d = !1, b = {}, f = "") => {
  const e = Object.keys(a);
  return e.length || c.length ? `{${e.reduce((g, h) => {
    const k = a[h], m = d || -1 != h.indexOf("-") ? `'${h}'` : h, {before:q = "", s:p = "", o:n = ""} = b[h] || {};
    return [...g, `${q}${m}${p}:${n}${k}`];
  }, c).join(",")}${f}}` : "{}";
}, ba = (a = "") => {
  [a] = a;
  if (!a) {
    throw Error("No tag name is given");
  }
  return a.toUpperCase() == a;
}, Q = (a, c = {}, d = [], b = [], f = !1, e = null, g = {}, h = "") => {
  const k = ba(a), m = k ? a : `'${a}'`;
  if (!Object.keys(c).length && !d.length && !b.length) {
    return `h(${m})`;
  }
  const q = k && "dom" == f ? !1 : f;
  k || !b.length || f && "dom" != f || e && e(`JSX: destructuring ${b.join(" ")} is used without quoted props on HTML ${a}.`);
  a = aa(c, b, q, g, h);
  c = d.reduce((p, n, l) => {
    l = d[l - 1];
    let r = "";
    l && /^\/\*[\s\S]*\*\/$/.test(l) ? r = "" : l && /\S/.test(l) && (r = ",");
    return `${p}${r}${n}`;
  }, "");
  return `h(${m},${a}${c ? `,${c}` : ""})`;
};
const R = (a, c = []) => {
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
}, T = a => {
  const c = N(a);
  let d;
  const {A:b} = J({A:/=>/g});
  try {
    ({I:k, u:d} = R(a, [L(b)]));
  } catch (m) {
    if (1 === m) {
      throw Error(`Could not find the matching closing > for ${c}.`);
    }
  }
  const f = k.slice(0, d + 1);
  var e = f.replace(/<\s*[^\s/>]+/, "");
  if (/\/\s*>$/.test(e)) {
    return a = e.replace(/\/\s*>$/, ""), e = "", new S({b:f.replace(b.regExp, "=>"), a:a.replace(b.regExp, "=>"), content:"", tagName:c});
  }
  a = e.replace(/>$/, "");
  e = d + 1;
  d = !1;
  let g = 1, h;
  G(k, [{re:new RegExp(`[\\s\\S](?:<\\s*${c}(\\s+|>)|/\\s*${c}\\s*>)`, "g"), replacement(m, q, p, n) {
    if (d) {
      return m;
    }
    q = !q && m.endsWith(">");
    const l = !q;
    if (l) {
      n = n.slice(p);
      const {u:r} = R(n.replace(/^[\s\S]/, " "));
      n = n.slice(0, r + 1);
      if (/\/\s*>$/.test(n)) {
        return m;
      }
    }
    g += l ? 1 : -1;
    0 == g && q && (d = p, h = d + m.length);
    return m;
  }}]);
  if (g) {
    throw Error(`Could not find the matching closing </${c}>.`);
  }
  e = k.slice(e, d);
  var k = k.slice(0, h).replace(b.regExp, "=>");
  return new S({b:k, a:a.replace(b.regExp, "=>"), content:e.replace(b.regExp, "=>"), tagName:c});
};
class S {
  constructor(a) {
    this.b = a.b;
    this.a = a.a;
    this.content = a.content;
    this.tagName = a.tagName;
  }
}
;const U = a => {
  let c = "", d = "";
  a = a.replace(/^(\r?\n\s*)([\s\S]+)?/, (b, f, e = "") => {
    c = f;
    return e;
  }).replace(/([\s\S]+?)?(\r?\n\s*)$/, (b, f = "", e = "") => {
    d = e;
    return f;
  });
  return `${c}${a ? `\`${a}\`` : ""}${d}`;
}, da = a => {
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
        e = T(a.slice(g));
        f = g + e.b.length;
        d.F = e;
        d.v = f;
        d.from = g;
        c.push(d);
        d = {};
      }
    }
  }}, {}]);
  return c.length ? ca(a, c) : [U(a)];
}, ca = (a, c) => {
  let d = 0;
  c = c.reduce((b, {from:f, v:e, D:g, F:h}) => {
    (f = a.slice(d, f)) && b.push(U(f));
    d = e;
    g ? b.push(g) : h && b.push(h);
    return b;
  }, []);
  if (d < a.length) {
    const b = a.slice(d, a.length);
    b && c.push(U(b));
  }
  return c;
};
const W = (a, c = {}) => {
  var d = c.quoteProps, b = c.warn;
  const f = c.prop2class, e = c.classNames, g = c.renameMap;
  var h = E(a);
  if (null === h) {
    return a;
  }
  var k = a.slice(h);
  const {a:m = "", content:q, tagName:p, b:{length:n}} = T(k);
  k = V(q, d, b, c);
  const {i:l, h:r, f:u} = P(m.replace(/^ */, ""), {l:f, classNames:e, renameMap:g});
  b = Q(p, l, k, r, d, b, u, /\s*$/.exec(m) || [""]);
  d = a.slice(0, h);
  a = a.slice(h + n);
  h = n - b.length;
  0 < h && (b = `${" ".repeat(h)}${b}`);
  a = `${d}${b}${a}`;
  return W(a, c);
}, V = (a, c = !1, d = null, b = {}) => a ? da(a).reduce((f, e) => {
  if (e instanceof S) {
    const {a:k = "", content:m, tagName:q} = e, {i:p, h:n} = P(k, {l:b.prop2class, classNames:b.classNames, renameMap:b.renameMap});
    e = V(m, c, d);
    e = Q(q, p, e, n, c, d);
    return [...f, e];
  }
  const g = E(e);
  if (g) {
    var h = e.slice(g);
    const {b:{length:k}, a:m = "", content:q, tagName:p} = T(h), {i:n, h:l} = P(m, {l:b.prop2class, classNames:b.classNames, renameMap:b.renameMap});
    h = V(q, c, d);
    h = Q(p, n, h, l, c, d);
    const r = e.slice(0, g);
    e = e.slice(g + k);
    return [...f, `${r}${h}${e}`];
  }
  return [...f, e];
}, []) : [];
z || (console.log("Please specify the file to transpile."), process.exit(1));
const ea = ((a, c = {}) => {
  const {e:d, B:b, C:f, g:e, G:g, H:h} = J({B:/^ *export\s+default\s+{[\s\S]+?}/mg, e:/^ *export\s+(?:default\s+)?/mg, C:/^ *export\s+{[^}]+}\s+from\s+(['"])(?:.+?)\1/mg, g:/^ *import(\s+([^\s,]+)\s*,?)?(\s*{(?:[^}]+)})?\s+from\s+['"].+['"]/gm, G:/^ *import\s+(?:(.+?)\s*,\s*)?\*\s+as\s+.+?\s+from\s+['"].+['"]/gm, H:/^ *import\s+['"].+['"]/gm}, {getReplacement(k, m) {
    return `/*%%_RESTREAM_${k.toUpperCase()}_REPLACEMENT_${m}_%%*/`;
  }, getRegex(k) {
    return new RegExp(`/\\*%%_RESTREAM_${k.toUpperCase()}_REPLACEMENT_(\\d+)_%%\\*/`, "g");
  }});
  a = G(a, [L(f), L(b), L(d), L(e), L(g), L(h)]);
  c = W(a, c);
  return G(c, [K(f), K(b), K(d), K(e), K(g), K(h)]);
})(`${B(z)}`, {quoteProps:A ? "dom" : void 0});
console.log(ea);


//# sourceMappingURL=jsx.js.map