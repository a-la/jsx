#!/usr/bin/env node
'use strict';
const fs = require('fs');
const vm = require('vm');
const stream = require('stream');
const os = require('os');             
const v = (a, d, c, b = !1, f = !1) => {
  const e = c ? new RegExp(`^-(${c}|-${d})$`) : new RegExp(`^--${d}$`);
  d = a.findIndex(g => e.test(g));
  if (-1 == d) {
    return {argv:a};
  }
  if (b) {
    return {value:!0, index:d, length:1};
  }
  b = a[d + 1];
  if (!b || "string" == typeof b && b.startsWith("--")) {
    return {argv:a};
  }
  f && (b = parseInt(b, 10));
  return {value:b, index:d, length:2};
}, w = a => {
  const d = [];
  for (let c = 0; c < a.length; c++) {
    const b = a[c];
    if (b.startsWith("-")) {
      break;
    }
    d.push(b);
  }
  return d;
};
const x = function(a = {}, d = process.argv) {
  let [, , ...c] = d;
  const b = w(c);
  c = c.slice(b.length);
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
          const t = v(c, h, q, p, n);
          ({value:m} = t);
          const u = t.index, y = t.length;
          void 0 !== u && y && f.push({index:u, length:y});
        }
      }
    } catch (q) {
      return g;
    }
    return void 0 === m ? g : {...g, [h]:m};
  }, {});
  let e = c;
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
const D = (a, d) => {
  const [c, , b] = a.split("\n");
  a = parseInt(c.replace(/.+?(\d+)$/, (e, g) => g)) - 1;
  const f = b.indexOf("^");
  ({length:d} = d.split("\n").slice(0, a).join("\n"));
  return d + f + (a ? 1 : 0);
};
const E = a => {
  try {
    new C(a);
  } catch (d) {
    const c = d.stack;
    if (!/Unexpected token '?</.test(d.message)) {
      throw d;
    }
    return D(c, a);
  }
  return null;
};
function F(a) {
  if ("object" != typeof a) {
    return !1;
  }
  const d = a.re instanceof RegExp;
  a = -1 != ["string", "function"].indexOf(typeof a.replacement);
  return d && a;
}
;function G(a, d) {
  function c() {
    return d.filter(F).reduce((b, {re:f, replacement:e}) => {
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
  c.brake = () => {
    c.m = !0;
  };
  return c.call(c);
}
;const H = a => new RegExp(`%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_(\\d+)_%%`, "g"), I = (a, d) => `%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_${d}_%%`, J = (a, d) => Object.keys(a).reduce((c, b) => {
  {
    var f = a[b];
    const {getReplacement:e = I, getRegex:g = H} = d || {}, h = g(b);
    f = {name:b, re:f, regExp:h, getReplacement:e, map:{}, lastIndex:0};
  }
  return {...c, [b]:f};
}, {}), K = a => {
  var d = [];
  const c = a.map;
  return {re:a.regExp, replacement(b, f) {
    b = c[f];
    delete c[f];
    return G(b, Array.isArray(d) ? d : [d]);
  }};
}, L = a => {
  const d = a.map, c = a.getReplacement, b = a.name;
  return {re:a.re, replacement(f) {
    const e = a.lastIndex;
    d[e] = f;
    a.lastIndex += 1;
    return c(b, e);
  }};
};
const M = os.homedir;
M();
const N = a => {
  [, a] = /<\s*(.+?)(?:\s+[\s\S]+)?\s*\/?\s*>/.exec(a) || [];
  return a;
}, P = (a, {l:d = !1, classNames:c = [], renameMap:b = {}} = {}) => {
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
    const [, t, u, y, X] = /(\s*)(\S+)(\s*)=(\s*)$/.exec(n) || [];
    l = a.slice(l + 1, r);
    if (!u && !/\s*\.\.\./.test(l)) {
      throw Error("Could not detect prop name");
    }
    u ? h[u] = l : k.push(l);
    m[u] = {before:t, s:y, o:X};
    l = n || "";
    l = l.slice(0, l.length - (u || "").length - 1);
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
  if (d || Array.isArray(c) && c.length || Object.keys(c).length) {
    ({...p} = h);
    const n = [];
    Object.entries(p).forEach(([l, r]) => {
      if ("true" == r) {
        if (r = () => {
          n.push(l);
          delete p[l];
        }, Array.isArray(c) && c.includes(l)) {
          r();
        } else {
          if (c[l]) {
            r();
          } else {
            if (d) {
              const t = l[0];
              t.toUpperCase() == t && r();
            }
          }
        }
      }
    });
    n.length && (q = n.map(l => l in b ? b[l] : l).join(" "), p.className ? /[`"']$/.test(p.className) ? p.className = p.className.replace(/([`"'])$/, ` ${q}$1`) : p.className += `+' ${q}'` : p.c ? /[`"']$/.test(p.c) ? p.c = p.c.replace(/([`"'])$/, ` ${q}$1`) : p.c += `+' ${q}'` : p.className = `'${q}'`);
  }
  return {i:p, h:k, f:m};
}, O = a => {
  const d = [], c = {};
  a.replace(/(\s*)(\S+)(\s*)=(\s*)(["'])([\s\S]*?)\5/g, (b, f, e, g, h, k, m, q) => {
    c[e] = {before:f, s:g, o:h};
    d.push({g:q, name:e, w:`${k}${m}${k}`});
    return "%".repeat(b.length);
  }).replace(/(\s*)([^\s%]+)/g, (b, f, e, g) => {
    c[e] = {before:f};
    d.push({g, name:e, w:"true"});
  });
  return {j:[...d.reduce((b, {g:f, name:e, w:g}) => {
    b[f] = [e, g];
    return b;
  }, [])].filter(Boolean).reduce((b, [f, e]) => {
    b[f] = e;
    return b;
  }, {}), f:c};
}, aa = (a, d = [], c = !1, b = {}, f = "") => {
  const e = Object.keys(a);
  return e.length || d.length ? `{${e.reduce((g, h) => {
    const k = a[h], m = c || -1 != h.indexOf("-") ? `'${h}'` : h, {before:q = "", s:p = "", o:n = ""} = b[h] || {};
    return [...g, `${q}${m}${p}:${n}${k}`];
  }, d).join(",")}${f}}` : "{}";
}, ba = (a = "") => {
  [a] = a;
  if (!a) {
    throw Error("No tag name is given");
  }
  return a.toUpperCase() == a;
}, Q = (a, d = {}, c = [], b = [], f = !1, e = null, g = {}, h = "") => {
  const k = ba(a), m = k ? a : `'${a}'`;
  if (!Object.keys(d).length && !c.length && !b.length) {
    return `h(${m})`;
  }
  const q = k && "dom" == f ? !1 : f;
  k || !b.length || f && "dom" != f || e && e(`JSX: destructuring ${b.join(" ")} is used without quoted props on HTML ${a}.`);
  a = aa(d, b, q, g, h);
  d = c.reduce((p, n, l) => {
    l = c[l - 1];
    let r = "";
    l && /^\/\*[\s\S]*\*\/$/.test(l) ? r = "" : l && /\S/.test(l) && (r = ",");
    return `${p}${r}${n}`;
  }, "");
  return `h(${m},${a}${d ? `,${d}` : ""})`;
};
const R = (a, d = []) => {
  let c = 0, b;
  a = G(a, [...d, {re:/[<>]/g, replacement(f, e) {
    if (b) {
      return f;
    }
    const g = "<" == f;
    c += g ? 1 : -1;
    0 == c && !g && (b = e);
    return f;
  }}]);
  if (c) {
    throw Error(1);
  }
  return {I:a, u:b};
}, T = a => {
  const d = N(a);
  let c;
  const {A:b} = J({A:/=>/g});
  try {
    ({I:k, u:c} = R(a, [L(b)]));
  } catch (m) {
    if (1 === m) {
      throw Error(`Could not find the matching closing > for ${d}.`);
    }
  }
  const f = k.slice(0, c + 1);
  var e = f.replace(/<\s*[^\s/>]+/, "");
  if (/\/\s*>$/.test(e)) {
    return a = e.replace(/\/\s*>$/, ""), e = "", new S({b:f.replace(b.regExp, "=>"), a:a.replace(b.regExp, "=>"), content:"", tagName:d});
  }
  a = e.replace(/>$/, "");
  e = c + 1;
  c = !1;
  let g = 1, h;
  G(k, [{re:new RegExp(`[\\s\\S](?:<\\s*${d}(\\s+|>)|/\\s*${d}\\s*>)`, "g"), replacement(m, q, p, n) {
    if (c) {
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
    0 == g && q && (c = p, h = c + m.length);
    return m;
  }}]);
  if (g) {
    throw Error(`Could not find the matching closing </${d}>.`);
  }
  e = k.slice(e, c);
  var k = k.slice(0, h).replace(b.regExp, "=>");
  return new S({b:k, a:a.replace(b.regExp, "=>"), content:e.replace(b.regExp, "=>"), tagName:d});
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
  let d = "", c = "";
  a = a.replace(/^(\r?\n\s*)([\s\S]+)?/, (b, f, e = "") => {
    d = f;
    return e;
  }).replace(/([\s\S]+?)?(\r?\n\s*)$/, (b, f = "", e = "") => {
    c = e;
    return f;
  });
  return `${d}${a ? `\`${a}\`` : ""}${c}`;
}, da = a => {
  const d = [];
  let c = {}, b = 0, f = 0;
  G(a, [{re:/[<{}]/g, replacement(e, g) {
    if (!(g < f)) {
      if (/[{}]/.test(e)) {
        b += "{" == e ? 1 : -1, 1 == b && void 0 == c.from ? c.from = g : 0 == b && (c.v = g + 1, c.D = a.slice(c.from + 1, g), d.push(c), c = {});
      } else {
        if (b) {
          return e;
        }
        e = T(a.slice(g));
        f = g + e.b.length;
        c.F = e;
        c.v = f;
        c.from = g;
        d.push(c);
        c = {};
      }
    }
  }}, {}]);
  return d.length ? ca(a, d) : [U(a)];
}, ca = (a, d) => {
  let c = 0;
  d = d.reduce((b, {from:f, v:e, D:g, F:h}) => {
    (f = a.slice(c, f)) && b.push(U(f));
    c = e;
    g ? b.push(g) : h && b.push(h);
    return b;
  }, []);
  if (c < a.length) {
    const b = a.slice(c, a.length);
    b && d.push(U(b));
  }
  return d;
};
const W = (a, d = {}) => {
  var c = d.quoteProps, b = d.warn;
  const f = d.prop2class, e = d.classNames, g = d.renameMap;
  var h = E(a);
  if (null === h) {
    return a;
  }
  var k = a.slice(h);
  const {a:m = "", content:q, tagName:p, b:{length:n}} = T(k);
  k = V(q, c, b, d);
  const {i:l, h:r, f:t} = P(m.replace(/^ */, ""), {l:f, classNames:e, renameMap:g});
  b = Q(p, l, k, r, c, b, t, /\s*$/.exec(m) || [""]);
  c = a.slice(0, h);
  a = a.slice(h + n);
  h = n - b.length;
  0 < h && (b = `${" ".repeat(h)}${b}`);
  a = `${c}${b}${a}`;
  return W(a, d);
}, V = (a, d = !1, c = null, b = {}) => a ? da(a).reduce((f, e) => {
  if (e instanceof S) {
    const {a:k = "", content:m, tagName:q} = e, {i:p, h:n} = P(k, {l:b.prop2class, classNames:b.classNames, renameMap:b.renameMap});
    e = V(m, d, c, b);
    e = Q(q, p, e, n, d, c);
    return [...f, e];
  }
  const g = E(e);
  if (g) {
    var h = e.slice(g);
    const {b:{length:k}, a:m = "", content:q, tagName:p} = T(h), {i:n, h:l} = P(m, {l:b.prop2class, classNames:b.classNames, renameMap:b.renameMap});
    h = V(q, d, c, b);
    h = Q(p, n, h, l, d, c);
    const r = e.slice(0, g);
    e = e.slice(g + k);
    return [...f, `${r}${h}${e}`];
  }
  return [...f, e];
}, []) : [];
z || (console.log("Please specify the file to transpile."), process.exit(1));
const ea = ((a, d = {}) => {
  const {e:c, B:b, C:f, g:e, G:g, H:h} = J({B:/^ *export\s+default\s+{[\s\S]+?}/mg, e:/^ *export\s+(?:default\s+)?/mg, C:/^ *export\s+{[^}]+}\s+from\s+(['"])(?:.+?)\1/mg, g:/^ *import(\s+([^\s,]+)\s*,?)?(\s*{(?:[^}]+)})?\s+from\s+['"].+['"]/gm, G:/^ *import\s+(?:(.+?)\s*,\s*)?\*\s+as\s+.+?\s+from\s+['"].+['"]/gm, H:/^ *import\s+(['"]).+\1/gm}, {getReplacement(k, m) {
    return `/*%%_RESTREAM_${k.toUpperCase()}_REPLACEMENT_${m}_%%*/`;
  }, getRegex(k) {
    return new RegExp(`/\\*%%_RESTREAM_${k.toUpperCase()}_REPLACEMENT_(\\d+)_%%\\*/`, "g");
  }});
  a = G(a, [L(f), L(b), L(c), L(e), L(g), L(h)]);
  d = W(a, d);
  return G(d, [K(f), K(b), K(c), K(e), K(g), K(h)]);
})(B(z, "utf8"), {quoteProps:A ? "dom" : void 0});
console.log(ea);


//# sourceMappingURL=jsx.js.map