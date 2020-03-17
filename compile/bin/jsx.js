#!/usr/bin/env node
'use strict';
const fs = require('fs');
const vm = require('vm');
const stream = require('stream');
const os = require('os');             
const u = (a, c, d, b = !1, e = !1) => {
  const f = d ? new RegExp(`^-(${d}|-${c})$`) : new RegExp(`^--${c}$`);
  c = a.findIndex(g => f.test(g));
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
  e && (b = parseInt(b, 10));
  return {value:b, index:c, length:2};
}, v = a => {
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
const w = function(a = {}, c = process.argv) {
  let [, , ...d] = c;
  const b = v(d);
  d = d.slice(b.length);
  a = Object.entries(a).reduce((g, [k, h]) => {
    g[k] = "string" == typeof h ? {short:h} : h;
    return g;
  }, {});
  const e = [];
  a = Object.entries(a).reduce((g, [k, h]) => {
    let l;
    try {
      const m = h.short, q = h.boolean, n = h.number, r = h.command, p = h.multiple;
      if (r && p && b.length) {
        l = b;
      } else {
        if (r && b.length) {
          l = b[0];
        } else {
          const t = u(d, k, m, q, n);
          ({value:l} = t);
          const x = t.index, y = t.length;
          void 0 !== x && y && e.push({index:x, length:y});
        }
      }
    } catch (m) {
      return g;
    }
    return void 0 === l ? g : {...g, [k]:l};
  }, {});
  let f = d;
  e.forEach(({index:g, length:k}) => {
    Array.from({length:k}).forEach((h, l) => {
      f[g + l] = null;
    });
  });
  f = f.filter(g => null !== g);
  Object.assign(a, {L:f});
  return a;
}({input:{description:"The location of the file to transpile.", command:!0}, preact:{description:"Whether to quote props for _Preact_.", boolean:!0, short:"p"}}), z = w.input, A = w.preact;
const B = fs.readFileSync;
const C = vm.Script;
const D = (a, c) => {
  const [d, , b] = a.split("\n");
  a = parseInt(d.replace(/.+?(\d+)$/, (f, g) => g)) - 1;
  const e = b.indexOf("^");
  ({length:c} = c.split("\n").slice(0, a).join("\n"));
  return c + e + (a ? 1 : 0);
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
    return c.filter(F).reduce((b, {re:e, replacement:f}) => {
      if (this.m) {
        return b;
      }
      if ("string" == typeof f) {
        return b = b.replace(e, f);
      }
      {
        let g;
        return b.replace(e, (k, ...h) => {
          g = Error();
          try {
            return this.m ? k : f.call(this, k, ...h);
          } catch (l) {
            {
              k = l;
              if (!(k instanceof Error)) {
                throw k;
              }
              [, , h] = g.stack.split("\n", 3);
              h = k.stack.indexOf(h);
              if (-1 == h) {
                throw k;
              }
              h = k.stack.substr(0, h - 1);
              const m = h.lastIndexOf("\n");
              k.stack = h.substr(0, m);
              throw k;
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
    var e = a[b];
    const {getReplacement:f = I, getRegex:g = H} = c || {}, k = g(b);
    e = {name:b, re:e, regExp:k, getReplacement:f, map:{}, lastIndex:0};
  }
  return {...d, [b]:e};
}, {}), K = a => {
  var c = [];
  const d = a.map;
  return {re:a.regExp, replacement(b, e) {
    b = d[e];
    delete d[e];
    return G(b, Array.isArray(c) ? c : [c]);
  }};
}, L = a => {
  const c = a.map, d = a.getReplacement, b = a.name;
  return {re:a.re, replacement(e) {
    const f = a.lastIndex;
    c[f] = e;
    a.lastIndex += 1;
    return d(b, f);
  }};
};
const M = os.homedir;
M();
const N = (a, c, d, b) => {
  let e = a, f = {};
  ({...e} = a);
  const g = [];
  Object.entries(e).forEach(([k, h]) => {
    if ("true" == h) {
      h = (m = k) => {
        f[k] = !0;
        g.push(m);
      };
      var l = c[k];
      l ? h("string" == typeof l ? l : void 0) : d && (l = k[0], l.toUpperCase() == l && h());
    }
  });
  g.length && (a = g.map(k => k in b ? b[k] : k).join(" "), e.className ? /[`"']$/.test(e.className) ? e.className = e.className.replace(/([`"'])$/, ` ${a}$1`) : e.className += `+' ${a}'` : e.g ? /[`"']$/.test(e.g) ? e.g = e.g.replace(/([`"'])$/, ` ${a}$1`) : e.g += `+' ${a}'` : e.className = `'${a}'`);
  return {K:e, a:f};
};
const O = a => {
  [, a] = /<\s*(.+?)(?:\s+[\s\S]+)?\s*\/?\s*>/.exec(a) || [];
  return a;
}, P = a => {
  let c = 0;
  const d = [];
  let b;
  G(a, [{re:/[{}]/g, replacement(e, f) {
    e = "}" == e;
    const g = !e;
    if (!c && e) {
      throw Error("A closing } is found without opening one.");
    }
    c += g ? 1 : -1;
    1 == c && g ? b = {open:f} : 0 == c && e && (b.close = f, d.push(b), b = {});
  }}]);
  if (c) {
    throw Error(`Unbalanced props (level ${c}) ${a}`);
  }
  return d;
}, R = (a, {l:c = !1, classNames:d = [], renameMap:b = {}} = {}) => {
  var e = P(a);
  let f = {};
  const g = {};
  var k = e.reduce((h, {open:l, close:m}, q) => {
    h = a.slice(h, l);
    l = a.slice(l + 1, m);
    const n = /\s*\.\.\./.test(l);
    let r, p, t, x;
    n ? [, r] = /(\s*)$/.exec(h) || [] : [, r, p, t, x] = /(\s*)(\S+)(\s*)=(\s*)$/.exec(h) || [];
    if (!p && !n) {
      throw Error("Could not detect prop name");
    }
    h = h || "";
    h = h.slice(0, h.length - (p || "").length - 1);
    const {j:y, b:Z} = Q(h);
    Object.assign(f, y);
    Object.assign(g, Z);
    p ? (f = {...f, [p]:l}, g[p] = {before:r, s:t, o:x}) : (q = `$%_DESTRUCTURING_PLACEHOLDER_${q}%$`, f = {...f, [q]:l}, g[q] = {before:r});
    return m + 1;
  }, 0);
  if (e.length) {
    e = a.slice(k);
    const {j:h, b:l} = Q(e);
    Object.assign(f, h);
    Object.assign(g, l);
  } else {
    const {j:h, b:l} = Q(a);
    Object.assign(f, h);
    Object.assign(g, l);
  }
  e = f;
  Array.isArray(d) && (d = d.reduce((h, l) => {
    h[l] = !0;
    return h;
  }, {}));
  k = {};
  if (c || Object.keys(d).length) {
    ({K:e, a:k} = N(f, d, c, b));
  }
  return {i:e, b:g, a:k};
}, Q = a => {
  const c = [], d = {};
  a.replace(/(\s*)(\S+)(\s*)=(\s*)(["'])([\s\S]*?)\5/g, (b, e, f, g, k, h, l, m) => {
    d[f] = {before:e, s:g, o:k};
    c.push({h:m, name:f, w:`${h}${l}${h}`});
    return "%".repeat(b.length);
  }).replace(/(\s*)([^\s%]+)/g, (b, e, f, g) => {
    d[f] = {before:e};
    c.push({h:g, name:f, w:"true"});
  });
  return {j:[...c.reduce((b, {h:e, name:f, w:g}) => {
    b[e] = [f, g];
    return b;
  }, [])].filter(Boolean).reduce((b, [e, f]) => {
    b[e] = f;
    return b;
  }, {}), b:d};
}, aa = (a, c = !1, d = {}, b = "", e = {}) => {
  const f = Object.keys(a);
  return f.length ? `{${f.reduce((g, k) => {
    const h = a[k], {before:l = "", s:m = "", o:q = ""} = d[k] || {};
    if (k.startsWith("$%_DESTRUCTURING_PLACEHOLDER_")) {
      return `${g}${l}${h},`;
    }
    if (e[k]) {
      return `${g}${l}${"".repeat(k.length)}`;
    }
    k = c || -1 != k.indexOf("-") ? `'${k}'` : k;
    return `${g}${l}${k}${m}:${q}${h},`;
  }, "").replace(/,(\s*)$/, "$1")}${b}}` : "{}";
}, ba = (a = "") => {
  [a] = a;
  if (!a) {
    throw Error("No tag name is given");
  }
  return a.toUpperCase() == a;
}, S = (a, c = {}, d = [], {quoteProps:b = !1, warn:e = null, b:f = {}, B:g = "", a:k} = {}) => {
  const h = ba(a), l = h ? a : `'${a}'`;
  if (!Object.keys(c).length && !d.length) {
    return `h(${l})`;
  }
  const m = h && "dom" == b ? !1 : b, q = Object.entries(c).map(([n, r]) => n.startsWith("$%_DESTRUCTURING_PLACEHOLDER_") ? r : null).filter(Boolean);
  h || !q || b && "dom" != b || e && e(`JSX: destructuring ${q.join(", ")} is used without quoted props on HTML ${a}.`);
  a = aa(c, m, f, g, k);
  c = d.reduce((n, r, p) => {
    p = d[p - 1];
    let t = "";
    p && /^\/\*[\s\S]*\*\/$/.test(p) ? t = "" : p && /\S/.test(p) && (t = ",");
    return `${n}${t}${r}`;
  }, "");
  return `h(${l},${a}${c ? `,${c}` : ""})`;
};
const T = (a, c = []) => {
  let d = 0, b;
  a = G(a, [...c, {re:/[<>]/g, replacement(e, f) {
    if (b) {
      return e;
    }
    const g = "<" == e;
    d += g ? 1 : -1;
    0 == d && !g && (b = f);
    return e;
  }}]);
  if (d) {
    throw Error(1);
  }
  return {J:a, u:b};
}, V = a => {
  const c = O(a);
  let d;
  const {A:b} = J({A:/=>/g});
  try {
    ({J:h, u:d} = T(a, [L(b)]));
  } catch (l) {
    if (1 === l) {
      throw Error(`Could not find the matching closing > for ${c}.`);
    }
  }
  const e = h.slice(0, d + 1);
  var f = e.replace(/<\s*[^\s/>]+/, "");
  if (/\/\s*>$/.test(f)) {
    return a = f.replace(/\/\s*>$/, ""), f = "", new U({f:e.replace(b.regExp, "=>"), c:a.replace(b.regExp, "=>"), content:"", tagName:c});
  }
  a = f.replace(/>$/, "");
  f = d + 1;
  d = !1;
  let g = 1, k;
  G(h, [{re:new RegExp(`[\\s\\S](?:<\\s*${c}(\\s+|>)|/\\s*${c}\\s*>)`, "g"), replacement(l, m, q, n) {
    if (d) {
      return l;
    }
    m = !m && l.endsWith(">");
    const r = !m;
    if (r) {
      n = n.slice(q);
      const {u:p} = T(n.replace(/^[\s\S]/, " "));
      n = n.slice(0, p + 1);
      if (/\/\s*>$/.test(n)) {
        return l;
      }
    }
    g += r ? 1 : -1;
    0 == g && m && (d = q, k = d + l.length);
    return l;
  }}]);
  if (g) {
    throw Error(`Could not find the matching closing </${c}>.`);
  }
  f = h.slice(f, d);
  var h = h.slice(0, k).replace(b.regExp, "=>");
  return new U({f:h, c:a.replace(b.regExp, "=>"), content:f.replace(b.regExp, "=>"), tagName:c});
};
class U {
  constructor(a) {
    this.f = a.f;
    this.c = a.c;
    this.content = a.content;
    this.tagName = a.tagName;
  }
}
;const W = a => {
  let c = "", d = "";
  a = a.replace(/^(\r?\n\s*)([\s\S]+)?/, (b, e, f = "") => {
    c = e;
    return f;
  }).replace(/([\s\S]+?)?(\r?\n\s*)$/, (b, e = "", f = "") => {
    d = f;
    return e;
  });
  return `${c}${a ? `\`${a}\`` : ""}${d}`;
}, da = a => {
  const c = [];
  let d = {}, b = 0, e = 0;
  G(a, [{re:/[<{}]/g, replacement(f, g) {
    if (!(g < e)) {
      if (/[{}]/.test(f)) {
        b += "{" == f ? 1 : -1, 1 == b && void 0 == d.from ? d.from = g : 0 == b && (d.v = g + 1, d.F = a.slice(d.from + 1, g), c.push(d), d = {});
      } else {
        if (b) {
          return f;
        }
        f = V(a.slice(g));
        e = g + f.f.length;
        d.G = f;
        d.v = e;
        d.from = g;
        c.push(d);
        d = {};
      }
    }
  }}, {}]);
  return c.length ? ca(a, c) : [W(a)];
}, ca = (a, c) => {
  let d = 0;
  c = c.reduce((b, {from:e, v:f, F:g, G:k}) => {
    (e = a.slice(d, e)) && b.push(W(e));
    d = f;
    g ? b.push(g) : k && b.push(k);
    return b;
  }, []);
  if (d < a.length) {
    const b = a.slice(d, a.length);
    b && c.push(W(b));
  }
  return c;
};
const Y = (a, c = {}) => {
  var d = c.quoteProps, b = c.warn;
  const e = c.prop2class, f = c.classNames, g = c.renameMap;
  var k = E(a);
  if (null === k) {
    return a;
  }
  var h = a.slice(k);
  const {c:l = "", content:m, tagName:q, f:{length:n}} = V(h);
  h = X(m, d, b, c);
  const {i:r, b:p, a:t} = R(l.replace(/^ */, ""), {l:e, classNames:f, renameMap:g});
  b = S(q, r, h, {quoteProps:d, warn:b, b:p, B:/\s*$/.exec(l) || [""], a:t});
  d = a.slice(0, k);
  a = a.slice(k + n);
  k = n - b.length;
  0 < k && (b = `${" ".repeat(k)}${b}`);
  a = `${d}${b}${a}`;
  return Y(a, c);
}, X = (a, c = !1, d = null, b = {}) => a ? da(a).reduce((e, f) => {
  if (f instanceof U) {
    const {c:h = "", content:l, tagName:m} = f, {i:q, a:n} = R(h, {l:b.prop2class, classNames:b.classNames, renameMap:b.renameMap});
    f = X(l, c, d, b);
    f = S(m, q, f, {quoteProps:c, warn:d, a:n});
    return [...e, f];
  }
  const g = E(f);
  if (g) {
    var k = f.slice(g);
    const {f:{length:h}, c:l = "", content:m, tagName:q} = V(k), {i:n, a:r} = R(l, {l:b.prop2class, classNames:b.classNames, renameMap:b.renameMap});
    k = X(m, c, d, b);
    k = S(q, n, k, {quoteProps:c, warn:d, a:r});
    const p = f.slice(0, g);
    f = f.slice(g + h);
    return [...e, `${p}${k}${f}`];
  }
  return [...e, f];
}, []) : [];
z || (console.log("Please specify the file to transpile."), process.exit(1));
const ea = ((a, c = {}) => {
  const {e:d, C:b, D:e, h:f, H:g, I:k} = J({C:/^ *export\s+default\s+{[\s\S]+?}/mg, e:/^ *export\s+(?:default\s+)?/mg, D:/^ *export\s+{[^}]+}(?:\s+from\s+(['"])(?:.+?)\1)?/mg, h:/^ *import(\s+([^\s,]+)\s*,?)?(\s*{(?:[^}]+)})?\s+from\s+['"].+['"]/gm, H:/^ *import\s+(?:(.+?)\s*,\s*)?\*\s+as\s+.+?\s+from\s+['"].+['"]/gm, I:/^ *import\s+(['"]).+\1/gm}, {getReplacement(h, l) {
    return `/*%%_RESTREAM_${h.toUpperCase()}_REPLACEMENT_${l}_%%*/`;
  }, getRegex(h) {
    return new RegExp(`/\\*%%_RESTREAM_${h.toUpperCase()}_REPLACEMENT_(\\d+)_%%\\*/`, "g");
  }});
  a = G(a, [L(e), L(b), L(d), L(f), L(g), L(k)]);
  c = Y(a, c);
  return G(c, [K(e), K(b), K(d), K(f), K(g), K(k)]);
})(B(z, "utf8"), {quoteProps:A ? "dom" : void 0});
console.log(ea);


//# sourceMappingURL=jsx.js.map