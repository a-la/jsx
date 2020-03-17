#!/usr/bin/env node
'use strict';
const fs = require('fs');
const vm = require('vm');
const stream = require('stream');
const os = require('os');             
const t = (a, c, e, b = !1, f = !1) => {
  const d = e ? new RegExp(`^-(${e}|-${c})$`) : new RegExp(`^--${c}$`);
  c = a.findIndex(g => d.test(g));
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
  for (let e = 0; e < a.length; e++) {
    const b = a[e];
    if (b.startsWith("-")) {
      break;
    }
    c.push(b);
  }
  return c;
};
const w = function(a = {}, c = process.argv) {
  let [, , ...e] = c;
  const b = u(e);
  e = e.slice(b.length);
  a = Object.entries(a).reduce((g, [k, h]) => {
    g[k] = "string" == typeof h ? {short:h} : h;
    return g;
  }, {});
  const f = [];
  a = Object.entries(a).reduce((g, [k, h]) => {
    let l;
    try {
      const m = h.short, p = h.boolean, n = h.number, q = h.command, r = h.multiple;
      if (q && r && b.length) {
        l = b;
      } else {
        if (q && b.length) {
          l = b[0];
        } else {
          const v = t(e, k, m, p, n);
          ({value:l} = v);
          const x = v.index, y = v.length;
          void 0 !== x && y && f.push({index:x, length:y});
        }
      }
    } catch (m) {
      return g;
    }
    return void 0 === l ? g : {...g, [k]:l};
  }, {});
  let d = e;
  f.forEach(({index:g, length:k}) => {
    Array.from({length:k}).forEach((h, l) => {
      d[g + l] = null;
    });
  });
  d = d.filter(g => null !== g);
  Object.assign(a, {I:d});
  return a;
}({input:{description:"The location of the file to transpile.", command:!0}, preact:{description:"Whether to quote props for _Preact_.", boolean:!0, short:"p"}}), z = w.input, A = w.preact;
const B = fs.readFileSync;
const C = vm.Script;
const D = (a, c) => {
  const [e, , b] = a.split("\n");
  a = parseInt(e.replace(/.+?(\d+)$/, (d, g) => g)) - 1;
  const f = b.indexOf("^");
  ({length:c} = c.split("\n").slice(0, a).join("\n"));
  return c + f + (a ? 1 : 0);
};
const E = a => {
  try {
    new C(a);
  } catch (c) {
    const e = c.stack;
    if (!/Unexpected token '?</.test(c.message)) {
      throw c;
    }
    return D(e, a);
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
  function e() {
    return c.filter(F).reduce((b, {re:f, replacement:d}) => {
      if (this.l) {
        return b;
      }
      if ("string" == typeof d) {
        return b = b.replace(f, d);
      }
      {
        let g;
        return b.replace(f, (k, ...h) => {
          g = Error();
          try {
            return this.l ? k : d.call(this, k, ...h);
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
  e.brake = () => {
    e.l = !0;
  };
  return e.call(e);
}
;const H = a => new RegExp(`%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_(\\d+)_%%`, "g"), I = (a, c) => `%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_${c}_%%`, J = (a, c) => Object.keys(a).reduce((e, b) => {
  {
    var f = a[b];
    const {getReplacement:d = I, getRegex:g = H} = c || {}, k = g(b);
    f = {name:b, re:f, regExp:k, getReplacement:d, map:{}, lastIndex:0};
  }
  return {...e, [b]:f};
}, {}), K = a => {
  var c = [];
  const e = a.map;
  return {re:a.regExp, replacement(b, f) {
    b = e[f];
    delete e[f];
    return G(b, Array.isArray(c) ? c : [c]);
  }};
}, L = a => {
  const c = a.map, e = a.getReplacement, b = a.name;
  return {re:a.re, replacement(f) {
    const d = a.lastIndex;
    c[d] = f;
    a.lastIndex += 1;
    return e(b, d);
  }};
};
const M = os.homedir;
M();
const N = a => {
  [, a] = /<\s*(.+?)(?:\s+[\s\S]+)?\s*\/?\s*>/.exec(a) || [];
  return a;
}, O = a => {
  let c = 0;
  const e = [];
  let b;
  G(a, [{re:/[{}]/g, replacement(f, d) {
    f = "}" == f;
    const g = !f;
    if (!c && f) {
      throw Error("A closing } is found without opening one.");
    }
    c += g ? 1 : -1;
    1 == c && g ? b = {open:d} : 0 == c && f && (b.close = d, e.push(b), b = {});
  }}]);
  if (c) {
    throw Error(`Unbalanced props (level ${c}) ${a}`);
  }
  return e;
}, R = (a, {j:c = !1, classNames:e = [], renameMap:b = {}} = {}) => {
  var f = O(a);
  let d = {};
  const g = {}, k = f.reduce((h, {open:l, close:m}, p) => {
    h = a.slice(h, l);
    l = a.slice(l + 1, m);
    const n = /\s*\.\.\./.test(l);
    let q, r, v, x;
    n ? [, q] = /(\s*)$/.exec(h) || [] : [, q, r, v, x] = /(\s*)(\S+)(\s*)=(\s*)$/.exec(h) || [];
    if (!r && !n) {
      throw Error("Could not detect prop name");
    }
    h = h || "";
    h = h.slice(0, h.length - (r || "").length - 1);
    const {i:y, f:Y} = P(h);
    Object.assign(d, y);
    Object.assign(g, Y);
    r ? (d = {...d, [r]:l}, g[r] = {before:q, o:v, m:x}) : (p = `$%_DESTRUCTURING_PLACEHOLDER_${p}%$`, d = {...d, [p]:l}, g[p] = {before:q});
    return m + 1;
  }, 0);
  if (f.length) {
    f = a.slice(k);
    const {i:h, f:l} = P(f);
    Object.assign(d, h);
    Object.assign(g, l);
  } else {
    const {i:h, f:l} = P(a);
    Object.assign(d, h);
    Object.assign(g, l);
  }
  f = d;
  if (c || Array.isArray(e) && e.length || Object.keys(e).length) {
    f = Q(d, e, c, b);
  }
  return {h:f, f:g};
}, Q = (a, c, e, b) => {
  let f = a;
  ({...f} = a);
  const d = [];
  Object.entries(f).forEach(([g, k]) => {
    if ("true" == k) {
      if (k = () => {
        d.push(g);
        delete f[g];
      }, Array.isArray(c) && c.includes(g)) {
        k();
      } else {
        if (c[g]) {
          k();
        } else {
          if (e) {
            const h = g[0];
            h.toUpperCase() == h && k();
          }
        }
      }
    }
  });
  d.length && (a = d.map(g => g in b ? b[g] : g).join(" "), f.className ? /[`"']$/.test(f.className) ? f.className = f.className.replace(/([`"'])$/, ` ${a}$1`) : f.className += `+' ${a}'` : f.c ? /[`"']$/.test(f.c) ? f.c = f.c.replace(/([`"'])$/, ` ${a}$1`) : f.c += `+' ${a}'` : f.className = `'${a}'`);
  return f;
}, P = a => {
  const c = [], e = {};
  a.replace(/(\s*)(\S+)(\s*)=(\s*)(["'])([\s\S]*?)\5/g, (b, f, d, g, k, h, l, m) => {
    e[d] = {before:f, o:g, m:k};
    c.push({g:m, name:d, v:`${h}${l}${h}`});
    return "%".repeat(b.length);
  }).replace(/(\s*)([^\s%]+)/g, (b, f, d, g) => {
    e[d] = {before:f};
    c.push({g, name:d, v:"true"});
  });
  return {i:[...c.reduce((b, {g:f, name:d, v:g}) => {
    b[f] = [d, g];
    return b;
  }, [])].filter(Boolean).reduce((b, [f, d]) => {
    b[f] = d;
    return b;
  }, {}), f:e};
}, aa = (a, c = !1, e = {}, b = "") => {
  const f = Object.keys(a);
  return f.length ? `{${f.map(d => {
    const g = a[d], {before:k = "", o:h = "", m:l = ""} = e[d] || {};
    if (d.startsWith("$%_DESTRUCTURING_PLACEHOLDER_")) {
      return `${k}${g}`;
    }
    d = c || -1 != d.indexOf("-") ? `'${d}'` : d;
    return `${k}${d}${h}:${l}${g}`;
  }).join(",")}${b}}` : "{}";
}, ba = (a = "") => {
  [a] = a;
  if (!a) {
    throw Error("No tag name is given");
  }
  return a.toUpperCase() == a;
}, S = (a, c = {}, e = [], b = !1, f = null, d = {}, g = "") => {
  const k = ba(a), h = k ? a : `'${a}'`;
  if (!Object.keys(c).length && !e.length) {
    return `h(${h})`;
  }
  const l = k && "dom" == b ? !1 : b, m = Object.entries(c).map(([p, n]) => p.startsWith("$%_DESTRUCTURING_PLACEHOLDER_") ? n : null).filter(Boolean);
  k || !m || b && "dom" != b || f && f(`JSX: destructuring ${m.join(", ")} is used without quoted props on HTML ${a}.`);
  a = aa(c, l, d, g);
  c = e.reduce((p, n, q) => {
    q = e[q - 1];
    let r = "";
    q && /^\/\*[\s\S]*\*\/$/.test(q) ? r = "" : q && /\S/.test(q) && (r = ",");
    return `${p}${r}${n}`;
  }, "");
  return `h(${h},${a}${c ? `,${c}` : ""})`;
};
const T = (a, c = []) => {
  let e = 0, b;
  a = G(a, [...c, {re:/[<>]/g, replacement(f, d) {
    if (b) {
      return f;
    }
    const g = "<" == f;
    e += g ? 1 : -1;
    0 == e && !g && (b = d);
    return f;
  }}]);
  if (e) {
    throw Error(1);
  }
  return {H:a, s:b};
}, V = a => {
  const c = N(a);
  let e;
  const {w:b} = J({w:/=>/g});
  try {
    ({H:h, s:e} = T(a, [L(b)]));
  } catch (l) {
    if (1 === l) {
      throw Error(`Could not find the matching closing > for ${c}.`);
    }
  }
  const f = h.slice(0, e + 1);
  var d = f.replace(/<\s*[^\s/>]+/, "");
  if (/\/\s*>$/.test(d)) {
    return a = d.replace(/\/\s*>$/, ""), d = "", new U({b:f.replace(b.regExp, "=>"), a:a.replace(b.regExp, "=>"), content:"", tagName:c});
  }
  a = d.replace(/>$/, "");
  d = e + 1;
  e = !1;
  let g = 1, k;
  G(h, [{re:new RegExp(`[\\s\\S](?:<\\s*${c}(\\s+|>)|/\\s*${c}\\s*>)`, "g"), replacement(l, m, p, n) {
    if (e) {
      return l;
    }
    m = !m && l.endsWith(">");
    const q = !m;
    if (q) {
      n = n.slice(p);
      const {s:r} = T(n.replace(/^[\s\S]/, " "));
      n = n.slice(0, r + 1);
      if (/\/\s*>$/.test(n)) {
        return l;
      }
    }
    g += q ? 1 : -1;
    0 == g && m && (e = p, k = e + l.length);
    return l;
  }}]);
  if (g) {
    throw Error(`Could not find the matching closing </${c}>.`);
  }
  d = h.slice(d, e);
  var h = h.slice(0, k).replace(b.regExp, "=>");
  return new U({b:h, a:a.replace(b.regExp, "=>"), content:d.replace(b.regExp, "=>"), tagName:c});
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
  let c = "", e = "";
  a = a.replace(/^(\r?\n\s*)([\s\S]+)?/, (b, f, d = "") => {
    c = f;
    return d;
  }).replace(/([\s\S]+?)?(\r?\n\s*)$/, (b, f = "", d = "") => {
    e = d;
    return f;
  });
  return `${c}${a ? `\`${a}\`` : ""}${e}`;
}, da = a => {
  const c = [];
  let e = {}, b = 0, f = 0;
  G(a, [{re:/[<{}]/g, replacement(d, g) {
    if (!(g < f)) {
      if (/[{}]/.test(d)) {
        b += "{" == d ? 1 : -1, 1 == b && void 0 == e.from ? e.from = g : 0 == b && (e.u = g + 1, e.C = a.slice(e.from + 1, g), c.push(e), e = {});
      } else {
        if (b) {
          return d;
        }
        d = V(a.slice(g));
        f = g + d.b.length;
        e.D = d;
        e.u = f;
        e.from = g;
        c.push(e);
        e = {};
      }
    }
  }}, {}]);
  return c.length ? ca(a, c) : [W(a)];
}, ca = (a, c) => {
  let e = 0;
  c = c.reduce((b, {from:f, u:d, C:g, D:k}) => {
    (f = a.slice(e, f)) && b.push(W(f));
    e = d;
    g ? b.push(g) : k && b.push(k);
    return b;
  }, []);
  if (e < a.length) {
    const b = a.slice(e, a.length);
    b && c.push(W(b));
  }
  return c;
};
const Z = (a, c = {}) => {
  var e = c.quoteProps, b = c.warn;
  const f = c.prop2class, d = c.classNames, g = c.renameMap;
  var k = E(a);
  if (null === k) {
    return a;
  }
  var h = a.slice(k);
  const {a:l = "", content:m, tagName:p, b:{length:n}} = V(h);
  h = X(m, e, b, c);
  const {h:q, f:r} = R(l.replace(/^ */, ""), {j:f, classNames:d, renameMap:g});
  b = S(p, q, h, e, b, r, /\s*$/.exec(l) || [""]);
  e = a.slice(0, k);
  a = a.slice(k + n);
  k = n - b.length;
  0 < k && (b = `${" ".repeat(k)}${b}`);
  a = `${e}${b}${a}`;
  return Z(a, c);
}, X = (a, c = !1, e = null, b = {}) => a ? da(a).reduce((f, d) => {
  if (d instanceof U) {
    const {a:l = "", content:m, tagName:p} = d;
    ({h:d} = R(l, {j:b.prop2class, classNames:b.classNames, renameMap:b.renameMap}));
    var g = X(m, c, e, b);
    d = S(p, d, g, c, e);
    return [...f, d];
  }
  if (g = E(d)) {
    var k = d.slice(g);
    const {b:{length:l}, a:m = "", content:p, tagName:n} = V(k);
    ({h:k} = R(m, {j:b.prop2class, classNames:b.classNames, renameMap:b.renameMap}));
    var h = X(p, c, e, b);
    k = S(n, k, h, c, e);
    h = d.slice(0, g);
    d = d.slice(g + l);
    return [...f, `${h}${k}${d}`];
  }
  return [...f, d];
}, []) : [];
z || (console.log("Please specify the file to transpile."), process.exit(1));
const ea = ((a, c = {}) => {
  const {e, A:b, B:f, g:d, F:g, G:k} = J({A:/^ *export\s+default\s+{[\s\S]+?}/mg, e:/^ *export\s+(?:default\s+)?/mg, B:/^ *export\s+{[^}]+}(?:\s+from\s+(['"])(?:.+?)\1)?/mg, g:/^ *import(\s+([^\s,]+)\s*,?)?(\s*{(?:[^}]+)})?\s+from\s+['"].+['"]/gm, F:/^ *import\s+(?:(.+?)\s*,\s*)?\*\s+as\s+.+?\s+from\s+['"].+['"]/gm, G:/^ *import\s+(['"]).+\1/gm}, {getReplacement(h, l) {
    return `/*%%_RESTREAM_${h.toUpperCase()}_REPLACEMENT_${l}_%%*/`;
  }, getRegex(h) {
    return new RegExp(`/\\*%%_RESTREAM_${h.toUpperCase()}_REPLACEMENT_(\\d+)_%%\\*/`, "g");
  }});
  a = G(a, [L(f), L(b), L(e), L(d), L(g), L(k)]);
  c = Z(a, c);
  return G(c, [K(f), K(b), K(e), K(d), K(g), K(k)]);
})(B(z, "utf8"), {quoteProps:A ? "dom" : void 0});
console.log(ea);


//# sourceMappingURL=jsx.js.map