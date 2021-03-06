(() => {
    "use strict";
    var e = {
            update: null,
            begin: null,
            loopBegin: null,
            changeBegin: null,
            change: null,
            changeComplete: null,
            loopComplete: null,
            complete: null,
            loop: 1,
            direction: "normal",
            autoplay: !0,
            timelineOffset: 0
        },
        n = {
            duration: 1e3,
            delay: 0,
            endDelay: 0,
            easing: "easeOutElastic(1, .5)",
            round: 0
        },
        t = ["translateX", "translateY", "translateZ", "rotate", "rotateX", "rotateY", "rotateZ", "scale", "scaleX", "scaleY", "scaleZ", "skew", "skewX", "skewY", "perspective", "matrix", "matrix3d"],
        r = {
            CSS: {},
            springs: {}
        };

    function a(e, n, t) {
        return Math.min(Math.max(e, n), t)
    }

    function u(e, n) {
        return e.indexOf(n) > -1
    }

    function o(e, n) {
        return e.apply(null, n)
    }
    var i = {
        arr: function(e) {
            return Array.isArray(e)
        },
        obj: function(e) {
            return u(Object.prototype.toString.call(e), "Object")
        },
        pth: function(e) {
            return i.obj(e) && e.hasOwnProperty("totalLength")
        },
        svg: function(e) {
            return e instanceof SVGElement
        },
        inp: function(e) {
            return e instanceof HTMLInputElement
        },
        dom: function(e) {
            return e.nodeType || i.svg(e)
        },
        str: function(e) {
            return "string" == typeof e
        },
        fnc: function(e) {
            return "function" == typeof e
        },
        und: function(e) {
            return void 0 === e
        },
        nil: function(e) {
            return i.und(e) || null === e
        },
        hex: function(e) {
            return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(e)
        },
        rgb: function(e) {
            return /^rgb/.test(e)
        },
        hsl: function(e) {
            return /^hsl/.test(e)
        },
        col: function(e) {
            return i.hex(e) || i.rgb(e) || i.hsl(e)
        },
        key: function(t) {
            return !e.hasOwnProperty(t) && !n.hasOwnProperty(t) && "targets" !== t && "keyframes" !== t
        }
    };

    function c(e) {
        var n = /\(([^)]+)\)/.exec(e);
        return n ? n[1].split(",").map((function(e) {
            return parseFloat(e)
        })) : []
    }

    function s(e, n) {
        var t = c(e),
            u = a(i.und(t[0]) ? 1 : t[0], .1, 100),
            o = a(i.und(t[1]) ? 100 : t[1], .1, 100),
            s = a(i.und(t[2]) ? 10 : t[2], .1, 100),
            l = a(i.und(t[3]) ? 0 : t[3], .1, 100),
            f = Math.sqrt(o / u),
            d = s / (2 * Math.sqrt(o * u)),
            p = d < 1 ? f * Math.sqrt(1 - d * d) : 0,
            m = d < 1 ? (d * f - l) / p : -l + f;

        function h(e) {
            var t = n ? n * e / 1e3 : e;
            return t = d < 1 ? Math.exp(-t * d * f) * (1 * Math.cos(p * t) + m * Math.sin(p * t)) : (1 + m * t) * Math.exp(-t * f), 0 === e || 1 === e ? e : 1 - t
        }
        return n ? h : function() {
            var n = r.springs[e];
            if (n) return n;
            for (var t = 1 / 6, a = 0, u = 0;;)
                if (1 === h(a += t)) {
                    if (++u >= 16) break
                } else u = 0;
            var o = a * t * 1e3;
            return r.springs[e] = o, o
        }
    }

    function l(e) {
        return void 0 === e && (e = 10),
            function(n) {
                return Math.ceil(a(n, 1e-6, 1) * e) * (1 / e)
            }
    }
    var f, d, p = function() {
            var e = .1;

            function n(e, n) {
                return 1 - 3 * n + 3 * e
            }

            function t(e, n) {
                return 3 * n - 6 * e
            }

            function r(e) {
                return 3 * e
            }

            function a(e, a, u) {
                return ((n(a, u) * e + t(a, u)) * e + r(a)) * e
            }

            function u(e, a, u) {
                return 3 * n(a, u) * e * e + 2 * t(a, u) * e + r(a)
            }
            return function(n, t, r, o) {
                if (0 <= n && n <= 1 && 0 <= r && r <= 1) {
                    var i = new Float32Array(11);
                    if (n !== t || r !== o)
                        for (var c = 0; c < 11; ++c) i[c] = a(c * e, n, r);
                    return function(c) {
                        return n === t && r === o || 0 === c || 1 === c ? c : a(function(t) {
                            for (var o = 0, c = 1; 10 !== c && i[c] <= t; ++c) o += e;
                            --c;
                            var s = o + (t - i[c]) / (i[c + 1] - i[c]) * e,
                                l = u(s, n, r);
                            return l >= .001 ? function(e, n, t, r) {
                                for (var o = 0; o < 4; ++o) {
                                    var i = u(n, t, r);
                                    if (0 === i) return n;
                                    n -= (a(n, t, r) - e) / i
                                }
                                return n
                            }(t, s, n, r) : 0 === l ? s : function(e, n, t, r, u) {
                                var o, i, c = 0;
                                do {
                                    (o = a(i = n + (t - n) / 2, r, u) - e) > 0 ? t = i : n = i
                                } while (Math.abs(o) > 1e-7 && ++c < 10);
                                return i
                            }(t, o, o + e, n, r)
                        }(c), t, o)
                    }
                }
            }
        }(),
        m = (f = {
            linear: function() {
                return function(e) {
                    return e
                }
            }
        }, d = {
            Sine: function() {
                return function(e) {
                    return 1 - Math.cos(e * Math.PI / 2)
                }
            },
            Circ: function() {
                return function(e) {
                    return 1 - Math.sqrt(1 - e * e)
                }
            },
            Back: function() {
                return function(e) {
                    return e * e * (3 * e - 2)
                }
            },
            Bounce: function() {
                return function(e) {
                    for (var n, t = 4; e < ((n = Math.pow(2, --t)) - 1) / 11;);
                    return 1 / Math.pow(4, 3 - t) - 7.5625 * Math.pow((3 * n - 2) / 22 - e, 2)
                }
            },
            Elastic: function(e, n) {
                void 0 === e && (e = 1), void 0 === n && (n = .5);
                var t = a(e, 1, 10),
                    r = a(n, .1, 2);
                return function(e) {
                    return 0 === e || 1 === e ? e : -t * Math.pow(2, 10 * (e - 1)) * Math.sin((e - 1 - r / (2 * Math.PI) * Math.asin(1 / t)) * (2 * Math.PI) / r)
                }
            }
        }, ["Quad", "Cubic", "Quart", "Quint", "Expo"].forEach((function(e, n) {
            d[e] = function() {
                return function(e) {
                    return Math.pow(e, n + 2)
                }
            }
        })), Object.keys(d).forEach((function(e) {
            var n = d[e];
            f["easeIn" + e] = n, f["easeOut" + e] = function(e, t) {
                return function(r) {
                    return 1 - n(e, t)(1 - r)
                }
            }, f["easeInOut" + e] = function(e, t) {
                return function(r) {
                    return r < .5 ? n(e, t)(2 * r) / 2 : 1 - n(e, t)(-2 * r + 2) / 2
                }
            }, f["easeOutIn" + e] = function(e, t) {
                return function(r) {
                    return r < .5 ? (1 - n(e, t)(1 - 2 * r)) / 2 : (n(e, t)(2 * r - 1) + 1) / 2
                }
            }
        })), f);

    function h(e, n) {
        if (i.fnc(e)) return e;
        var t = e.split("(")[0],
            r = m[t],
            a = c(e);
        switch (t) {
            case "spring":
                return s(e, n);
            case "cubicBezier":
                return o(p, a);
            case "steps":
                return o(l, a);
            default:
                return o(r, a)
        }
    }

    function v(e) {
        try {
            return document.querySelectorAll(e)
        } catch (e) {
            return
        }
    }

    function g(e, n) {
        for (var t = e.length, r = arguments.length >= 2 ? arguments[1] : void 0, a = [], u = 0; u < t; u++)
            if (u in e) {
                var o = e[u];
                n.call(r, o, u, e) && a.push(o)
            } return a
    }

    function y(e) {
        return e.reduce((function(e, n) {
            return e.concat(i.arr(n) ? y(n) : n)
        }), [])
    }

    function b(e) {
        return i.arr(e) ? e : (i.str(e) && (e = v(e) || e), e instanceof NodeList || e instanceof HTMLCollection ? [].slice.call(e) : [e])
    }

    function w(e, n) {
        return e.some((function(e) {
            return e === n
        }))
    }

    function x(e) {
        var n = {};
        for (var t in e) n[t] = e[t];
        return n
    }

    function M(e, n) {
        var t = x(e);
        for (var r in e) t[r] = n.hasOwnProperty(r) ? n[r] : e[r];
        return t
    }

    function k(e, n) {
        var t = x(e);
        for (var r in n) t[r] = i.und(e[r]) ? n[r] : e[r];
        return t
    }

    function I(e) {
        var n = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(e);
        if (n) return n[1]
    }

    function T(e, n) {
        return i.fnc(e) ? e(n.target, n.id, n.total) : e
    }

    function S(e, n) {
        return e.getAttribute(n)
    }

    function C(e, n, t) {
        if (w([t, "deg", "rad", "turn"], I(n))) return n;
        var a = r.CSS[n + t];
        if (!i.und(a)) return a;
        var u = document.createElement(e.tagName),
            o = e.parentNode && e.parentNode !== document ? e.parentNode : document.body;
        o.appendChild(u), u.style.position = "absolute", u.style.width = 100 + t;
        var c = 100 / u.offsetWidth;
        o.removeChild(u);
        var s = c * parseFloat(n);
        return r.CSS[n + t] = s, s
    }

    function O(e, n, t) {
        if (n in e.style) {
            var r = n.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
                a = e.style[n] || getComputedStyle(e).getPropertyValue(r) || "0";
            return t ? C(e, a, t) : a
        }
    }

    function D(e, n) {
        return i.dom(e) && !i.inp(e) && (!i.nil(S(e, n)) || i.svg(e) && e[n]) ? "attribute" : i.dom(e) && w(t, n) ? "transform" : i.dom(e) && "transform" !== n && O(e, n) ? "css" : null != e[n] ? "object" : void 0
    }

    function P(e) {
        if (i.dom(e)) {
            for (var n, t = e.style.transform || "", r = /(\w+)\(([^)]*)\)/g, a = new Map; n = r.exec(t);) a.set(n[1], n[2]);
            return a
        }
    }

    function q(e, n, t, r) {
        switch (D(e, n)) {
            case "transform":
                return function(e, n, t, r) {
                    var a = u(n, "scale") ? 1 : 0 + function(e) {
                            return u(e, "translate") || "perspective" === e ? "px" : u(e, "rotate") || u(e, "skew") ? "deg" : void 0
                        }(n),
                        o = P(e).get(n) || a;
                    return t && (t.transforms.list.set(n, o), t.transforms.last = n), r ? C(e, o, r) : o
                }(e, n, r, t);
            case "css":
                return O(e, n, t);
            case "attribute":
                return S(e, n);
            default:
                return e[n] || 0
        }
    }

    function E(e, n) {
        var t = /^(\*=|\+=|-=)/.exec(e);
        if (!t) return e;
        var r = I(e) || 0,
            a = parseFloat(n),
            u = parseFloat(e.replace(t[0], ""));
        switch (t[0][0]) {
            case "+":
                return a + u + r;
            case "-":
                return a - u + r;
            case "*":
                return a * u + r
        }
    }

    function B(e, n) {
        if (i.col(e)) return function(e) {
            return i.rgb(e) ? (t = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(n = e)) ? "rgba(" + t[1] + ",1)" : n : i.hex(e) ? function(e) {
                var n = e.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (function(e, n, t, r) {
                        return n + n + t + t + r + r
                    })),
                    t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(n);
                return "rgba(" + parseInt(t[1], 16) + "," + parseInt(t[2], 16) + "," + parseInt(t[3], 16) + ",1)"
            }(e) : i.hsl(e) ? function(e) {
                var n, t, r, a = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(e) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(e),
                    u = parseInt(a[1], 10) / 360,
                    o = parseInt(a[2], 10) / 100,
                    i = parseInt(a[3], 10) / 100,
                    c = a[4] || 1;

                function s(e, n, t) {
                    return t < 0 && (t += 1), t > 1 && (t -= 1), t < 1 / 6 ? e + 6 * (n - e) * t : t < .5 ? n : t < 2 / 3 ? e + (n - e) * (2 / 3 - t) * 6 : e
                }
                if (0 == o) n = t = r = i;
                else {
                    var l = i < .5 ? i * (1 + o) : i + o - i * o,
                        f = 2 * i - l;
                    n = s(f, l, u + 1 / 3), t = s(f, l, u), r = s(f, l, u - 1 / 3)
                }
                return "rgba(" + 255 * n + "," + 255 * t + "," + 255 * r + "," + c + ")"
            }(e) : void 0;
            var n, t
        }(e);
        if (/\s/g.test(e)) return e;
        var t = I(e),
            r = t ? e.substr(0, e.length - t.length) : e;
        return n ? r + n : r
    }

    function N(e, n) {
        return Math.sqrt(Math.pow(n.x - e.x, 2) + Math.pow(n.y - e.y, 2))
    }

    function F(e) {
        for (var n, t = e.points, r = 0, a = 0; a < t.numberOfItems; a++) {
            var u = t.getItem(a);
            a > 0 && (r += N(n, u)), n = u
        }
        return r
    }

    function L(e) {
        if (e.getTotalLength) return e.getTotalLength();
        switch (e.tagName.toLowerCase()) {
            case "circle":
                return function(e) {
                    return 2 * Math.PI * S(e, "r")
                }(e);
            case "rect":
                return function(e) {
                    return 2 * S(e, "width") + 2 * S(e, "height")
                }(e);
            case "line":
                return function(e) {
                    return N({
                        x: S(e, "x1"),
                        y: S(e, "y1")
                    }, {
                        x: S(e, "x2"),
                        y: S(e, "y2")
                    })
                }(e);
            case "polyline":
                return F(e);
            case "polygon":
                return function(e) {
                    var n = e.points;
                    return F(e) + N(n.getItem(n.numberOfItems - 1), n.getItem(0))
                }(e)
        }
    }

    function $(e, n) {
        var t = n || {},
            r = t.el || function(e) {
                for (var n = e.parentNode; i.svg(n) && i.svg(n.parentNode);) n = n.parentNode;
                return n
            }(e),
            a = r.getBoundingClientRect(),
            u = S(r, "viewBox"),
            o = a.width,
            c = a.height,
            s = t.viewBox || (u ? u.split(" ") : [0, 0, o, c]);
        return {
            el: r,
            viewBox: s,
            x: s[0] / 1,
            y: s[1] / 1,
            w: o,
            h: c,
            vW: s[2],
            vH: s[3]
        }
    }

    function A(e, n, t) {
        function r(t) {
            void 0 === t && (t = 0);
            var r = n + t >= 1 ? n + t : 0;
            return e.el.getPointAtLength(r)
        }
        var a = $(e.el, e.svg),
            u = r(),
            o = r(-1),
            i = r(1),
            c = t ? 1 : a.w / a.vW,
            s = t ? 1 : a.h / a.vH;
        switch (e.property) {
            case "x":
                return (u.x - a.x) * c;
            case "y":
                return (u.y - a.y) * s;
            case "angle":
                return 180 * Math.atan2(i.y - o.y, i.x - o.x) / Math.PI
        }
    }

    function j(e, n) {
        var t = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g,
            r = B(i.pth(e) ? e.totalLength : e, n) + "";
        return {
            original: r,
            numbers: r.match(t) ? r.match(t).map(Number) : [0],
            strings: i.str(e) || n ? r.split(t) : []
        }
    }

    function H(e) {
        return g(e ? y(i.arr(e) ? e.map(b) : b(e)) : [], (function(e, n, t) {
            return t.indexOf(e) === n
        }))
    }

    function V(e) {
        var n = H(e);
        return n.map((function(e, t) {
            return {
                target: e,
                id: t,
                total: n.length,
                transforms: {
                    list: P(e)
                }
            }
        }))
    }

    function Y(e, n) {
        var t = x(n);
        if (/^spring/.test(t.easing) && (t.duration = s(t.easing)), i.arr(e)) {
            var r = e.length;
            2 !== r || i.obj(e[0]) ? i.fnc(n.duration) || (t.duration = n.duration / r) : e = {
                value: e
            }
        }
        var a = i.arr(e) ? e : [e];
        return a.map((function(e, t) {
            var r = i.obj(e) && !i.pth(e) ? e : {
                value: e
            };
            return i.und(r.delay) && (r.delay = t ? 0 : n.delay), i.und(r.endDelay) && (r.endDelay = t === a.length - 1 ? n.endDelay : 0), r
        })).map((function(e) {
            return k(e, t)
        }))
    }
    var W = {
        css: function(e, n, t) {
            return e.style[n] = t
        },
        attribute: function(e, n, t) {
            return e.setAttribute(n, t)
        },
        object: function(e, n, t) {
            return e[n] = t
        },
        transform: function(e, n, t, r, a) {
            if (r.list.set(n, t), n === r.last || a) {
                var u = "";
                r.list.forEach((function(e, n) {
                    u += n + "(" + e + ") "
                })), e.style.transform = u
            }
        }
    };

    function _(e, n) {
        V(e).forEach((function(e) {
            for (var t in n) {
                var r = T(n[t], e),
                    a = e.target,
                    u = I(r),
                    o = q(a, t, u, e),
                    i = E(B(r, u || I(o)), o),
                    c = D(a, t);
                W[c](a, t, i, e.transforms, !0)
            }
        }))
    }

    function X(e, n) {
        return g(y(e.map((function(e) {
            return n.map((function(n) {
                return function(e, n) {
                    var t = D(e.target, n.name);
                    if (t) {
                        var r = function(e, n) {
                                var t;
                                return e.tweens.map((function(r) {
                                    var a = function(e, n) {
                                            var t = {};
                                            for (var r in e) {
                                                var a = T(e[r], n);
                                                i.arr(a) && 1 === (a = a.map((function(e) {
                                                    return T(e, n)
                                                }))).length && (a = a[0]), t[r] = a
                                            }
                                            return t.duration = parseFloat(t.duration), t.delay = parseFloat(t.delay), t
                                        }(r, n),
                                        u = a.value,
                                        o = i.arr(u) ? u[1] : u,
                                        c = I(o),
                                        s = q(n.target, e.name, c, n),
                                        l = t ? t.to.original : s,
                                        f = i.arr(u) ? u[0] : l,
                                        d = I(f) || I(s),
                                        p = c || d;
                                    return i.und(o) && (o = l), a.from = j(f, p), a.to = j(E(o, f), p), a.start = t ? t.end : 0, a.end = a.start + a.delay + a.duration + a.endDelay, a.easing = h(a.easing, a.duration), a.isPath = i.pth(u), a.isPathTargetInsideSVG = a.isPath && i.svg(n.target), a.isColor = i.col(a.from.original), a.isColor && (a.round = 1), t = a, a
                                }))
                            }(n, e),
                            a = r[r.length - 1];
                        return {
                            type: t,
                            property: n.name,
                            animatable: e,
                            tweens: r,
                            duration: a.end,
                            delay: r[0].delay,
                            endDelay: a.endDelay
                        }
                    }
                }(e, n)
            }))
        }))), (function(e) {
            return !i.und(e)
        }))
    }

    function Z(e, n) {
        var t = e.length,
            r = function(e) {
                return e.timelineOffset ? e.timelineOffset : 0
            },
            a = {};
        return a.duration = t ? Math.max.apply(Math, e.map((function(e) {
            return r(e) + e.duration
        }))) : n.duration, a.delay = t ? Math.min.apply(Math, e.map((function(e) {
            return r(e) + e.delay
        }))) : n.delay, a.endDelay = t ? a.duration - Math.max.apply(Math, e.map((function(e) {
            return r(e) + e.duration - e.endDelay
        }))) : n.endDelay, a
    }
    var G = 0,
        Q = [],
        z = function() {
            var e;

            function n(t) {
                for (var r = Q.length, a = 0; a < r;) {
                    var u = Q[a];
                    u.paused ? (Q.splice(a, 1), r--) : (u.tick(t), a++)
                }
                e = a > 0 ? requestAnimationFrame(n) : void 0
            }
            return "undefined" != typeof document && document.addEventListener("visibilitychange", (function() {
                    J.suspendWhenDocumentHidden && (R() ? e = cancelAnimationFrame(e) : (Q.forEach((function(e) {
                        return e._onDocumentVisibility()
                    })), z()))
                })),
                function() {
                    e || R() && J.suspendWhenDocumentHidden || !(Q.length > 0) || (e = requestAnimationFrame(n))
                }
        }();

    function R() {
        return !!document && document.hidden
    }

    function J(t) {
        void 0 === t && (t = {});
        var r, u = 0,
            o = 0,
            c = 0,
            s = 0,
            l = null;

        function f(e) {
            var n = window.Promise && new Promise((function(e) {
                return l = e
            }));
            return e.finished = n, n
        }
        var d = function(t) {
            var r = M(e, t),
                a = M(n, t),
                u = function(e, n) {
                    var t = [],
                        r = n.keyframes;
                    for (var a in r && (n = k(function(e) {
                            for (var n = g(y(e.map((function(e) {
                                    return Object.keys(e)
                                }))), (function(e) {
                                    return i.key(e)
                                })).reduce((function(e, n) {
                                    return e.indexOf(n) < 0 && e.push(n), e
                                }), []), t = {}, r = function(r) {
                                    var a = n[r];
                                    t[a] = e.map((function(e) {
                                        var n = {};
                                        for (var t in e) i.key(t) ? t == a && (n.value = e[t]) : n[t] = e[t];
                                        return n
                                    }))
                                }, a = 0; a < n.length; a++) r(a);
                            return t
                        }(r), n)), n) i.key(a) && t.push({
                        name: a,
                        tweens: Y(n[a], e)
                    });
                    return t
                }(a, t),
                o = V(t.targets),
                c = X(o, u),
                s = Z(c, a),
                l = G;
            return G++, k(r, {
                id: l,
                children: [],
                animatables: o,
                animations: c,
                duration: s.duration,
                delay: s.delay,
                endDelay: s.endDelay
            })
        }(t);

        function p() {
            var e = d.direction;
            "alternate" !== e && (d.direction = "normal" !== e ? "normal" : "reverse"), d.reversed = !d.reversed, r.forEach((function(e) {
                return e.reversed = d.reversed
            }))
        }

        function m(e) {
            return d.reversed ? d.duration - e : e
        }

        function h() {
            u = 0, o = m(d.currentTime) * (1 / J.speed)
        }

        function v(e, n) {
            n && n.seek(e - n.timelineOffset)
        }

        function b(e) {
            for (var n = 0, t = d.animations, r = t.length; n < r;) {
                var u = t[n],
                    o = u.animatable,
                    i = u.tweens,
                    c = i.length - 1,
                    s = i[c];
                c && (s = g(i, (function(n) {
                    return e < n.end
                }))[0] || s);
                for (var l = a(e - s.start - s.delay, 0, s.duration) / s.duration, f = isNaN(l) ? 1 : s.easing(l), p = s.to.strings, m = s.round, h = [], v = s.to.numbers.length, y = void 0, b = 0; b < v; b++) {
                    var w = void 0,
                        x = s.to.numbers[b],
                        M = s.from.numbers[b] || 0;
                    w = s.isPath ? A(s.value, f * x, s.isPathTargetInsideSVG) : M + f * (x - M), m && (s.isColor && b > 2 || (w = Math.round(w * m) / m)), h.push(w)
                }
                var k = p.length;
                if (k) {
                    y = p[0];
                    for (var I = 0; I < k; I++) {
                        p[I];
                        var T = p[I + 1],
                            S = h[I];
                        isNaN(S) || (y += T ? S + T : S + " ")
                    }
                } else y = h[0];
                W[u.type](o.target, u.property, y, o.transforms), u.currentValue = y, n++
            }
        }

        function w(e) {
            d[e] && !d.passThrough && d[e](d)
        }

        function x(e) {
            var n = d.duration,
                t = d.delay,
                i = n - d.endDelay,
                h = m(e);
            d.progress = a(h / n * 100, 0, 100), d.reversePlayback = h < d.currentTime, r && function(e) {
                if (d.reversePlayback)
                    for (var n = s; n--;) v(e, r[n]);
                else
                    for (var t = 0; t < s; t++) v(e, r[t])
            }(h), !d.began && d.currentTime > 0 && (d.began = !0, w("begin")), !d.loopBegan && d.currentTime > 0 && (d.loopBegan = !0, w("loopBegin")), h <= t && 0 !== d.currentTime && b(0), (h >= i && d.currentTime !== n || !n) && b(n), h > t && h < i ? (d.changeBegan || (d.changeBegan = !0, d.changeCompleted = !1, w("changeBegin")), w("change"), b(h)) : d.changeBegan && (d.changeCompleted = !0, d.changeBegan = !1, w("changeComplete")), d.currentTime = a(h, 0, n), d.began && w("update"), e >= n && (o = 0, d.remaining && !0 !== d.remaining && d.remaining--, d.remaining ? (u = c, w("loopComplete"), d.loopBegan = !1, "alternate" === d.direction && p()) : (d.paused = !0, d.completed || (d.completed = !0, w("loopComplete"), w("complete"), !d.passThrough && "Promise" in window && (l(), f(d)))))
        }
        return f(d), d.reset = function() {
            var e = d.direction;
            d.passThrough = !1, d.currentTime = 0, d.progress = 0, d.paused = !0, d.began = !1, d.loopBegan = !1, d.changeBegan = !1, d.completed = !1, d.changeCompleted = !1, d.reversePlayback = !1, d.reversed = "reverse" === e, d.remaining = d.loop, r = d.children;
            for (var n = s = r.length; n--;) d.children[n].reset();
            (d.reversed && !0 !== d.loop || "alternate" === e && 1 === d.loop) && d.remaining++, b(d.reversed ? d.duration : 0)
        }, d._onDocumentVisibility = h, d.set = function(e, n) {
            return _(e, n), d
        }, d.tick = function(e) {
            c = e, u || (u = c), x((c + (o - u)) * J.speed)
        }, d.seek = function(e) {
            x(m(e))
        }, d.pause = function() {
            d.paused = !0, h()
        }, d.play = function() {
            d.paused && (d.completed && d.reset(), d.paused = !1, Q.push(d), h(), z())
        }, d.reverse = function() {
            p(), d.completed = !d.reversed, h()
        }, d.restart = function() {
            d.reset(), d.play()
        }, d.remove = function(e) {
            U(H(e), d)
        }, d.reset(), d.autoplay && d.play(), d
    }

    function K(e, n) {
        for (var t = n.length; t--;) w(e, n[t].animatable.target) && n.splice(t, 1)
    }

    function U(e, n) {
        var t = n.animations,
            r = n.children;
        K(e, t);
        for (var a = r.length; a--;) {
            var u = r[a],
                o = u.animations;
            K(e, o), o.length || u.children.length || r.splice(a, 1)
        }
        t.length || r.length || n.pause()
    }
    J.version = "3.2.1", J.speed = 1, J.suspendWhenDocumentHidden = !0, J.running = Q, J.remove = function(e) {
        for (var n = H(e), t = Q.length; t--;) U(n, Q[t])
    }, J.get = q, J.set = _, J.convertPx = C, J.path = function(e, n) {
        var t = i.str(e) ? v(e)[0] : e,
            r = n || 100;
        return function(e) {
            return {
                property: e,
                el: t,
                svg: $(t),
                totalLength: L(t) * (r / 100)
            }
        }
    }, J.setDashoffset = function(e) {
        var n = L(e);
        return e.setAttribute("stroke-dasharray", n), n
    }, J.stagger = function(e, n) {
        void 0 === n && (n = {});
        var t = n.direction || "normal",
            r = n.easing ? h(n.easing) : null,
            a = n.grid,
            u = n.axis,
            o = n.from || 0,
            c = "first" === o,
            s = "center" === o,
            l = "last" === o,
            f = i.arr(e),
            d = f ? parseFloat(e[0]) : parseFloat(e),
            p = f ? parseFloat(e[1]) : 0,
            m = I(f ? e[1] : e) || 0,
            v = n.start || 0 + (f ? d : 0),
            g = [],
            y = 0;
        return function(e, n, i) {
            if (c && (o = 0), s && (o = (i - 1) / 2), l && (o = i - 1), !g.length) {
                for (var h = 0; h < i; h++) {
                    if (a) {
                        var b = s ? (a[0] - 1) / 2 : o % a[0],
                            w = s ? (a[1] - 1) / 2 : Math.floor(o / a[0]),
                            x = b - h % a[0],
                            M = w - Math.floor(h / a[0]),
                            k = Math.sqrt(x * x + M * M);
                        "x" === u && (k = -x), "y" === u && (k = -M), g.push(k)
                    } else g.push(Math.abs(o - h));
                    y = Math.max.apply(Math, g)
                }
                r && (g = g.map((function(e) {
                    return r(e / y) * y
                }))), "reverse" === t && (g = g.map((function(e) {
                    return u ? e < 0 ? -1 * e : -e : Math.abs(y - e)
                })))
            }
            return v + (f ? (p - d) / y : d) * (Math.round(100 * g[n]) / 100) + m
        }
    }, J.timeline = function(e) {
        void 0 === e && (e = {});
        var t = J(e);
        return t.duration = 0, t.add = function(r, a) {
            var u = Q.indexOf(t),
                o = t.children;

            function c(e) {
                e.passThrough = !0
            }
            u > -1 && Q.splice(u, 1);
            for (var s = 0; s < o.length; s++) c(o[s]);
            var l = k(r, M(n, e));
            l.targets = l.targets || e.targets;
            var f = t.duration;
            l.autoplay = !1, l.direction = t.direction, l.timelineOffset = i.und(a) ? f : E(a, f), c(t), t.seek(l.timelineOffset);
            var d = J(l);
            c(d), o.push(d);
            var p = Z(o, e);
            return t.delay = p.delay, t.endDelay = p.endDelay, t.duration = p.duration, t.seek(0), t.reset(), t.autoplay && t.play(), t
        }, t
    }, J.easing = h, J.penner = m, J.random = function(e, n) {
        return Math.floor(Math.random() * (n - e + 1)) + e
    };
    const ee = J;
    let ne = 0;

    function te(e) {
        let n = 0 === ne ? Number(e) - 273.1 : 1.8 * (Number(e) - 273) + 32;
        return Math.round(10 * n) / 10
    }
    let re = [document.querySelector("#result-temp"), document.querySelector("#result-mintemp"), document.querySelector("#result-maxtemp"), document.querySelector("#result-feeling")];
    localStorage.getItem("user_city");
    let ae = document.querySelector("#main-screen"),
        ue = document.querySelector("#result-screen");
    window.addEventListener("load", (e => {
        ee({
            targets: ae,
            opacity: [0, 1],
            translateY: [-10, 0],
            duration: 3e3
        })
    }));
    let oe = document.querySelector("#search-input");
    document.querySelector("#search-btn").addEventListener("click", ce), document.addEventListener("keydown", (e => {
        "Enter" === e.key && ce()
    }));
    let ie = document.querySelector("#error");
    async function ce() {
        if ("" !== oe.value) try {
            await async function(e) {
                try {
                    let n = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${e}&appid=653ada71ed7b4d56228b06e2f0fc17b5`);
                    return await n.json()
                } catch (e) {
                    console.log(e)
                }
            }(oe.value).then((e => function({
                place: e,
                weatherTitle: n,
                weatherDesc: t,
                feeling: r,
                humidity: a,
                pressure: u,
                temp: o,
                maxTemp: i,
                minTemp: c
            }) {
                let s = [{
                    elementId: "#result-temp",
                    value: `${o}??`
                }, {
                    elementId: "#result-place",
                    value: e
                }, {
                    elementId: "#result-weather",
                    value: n
                }, {
                    elementId: "#result-weather-desc",
                    value: t
                }, {
                    elementId: "#result-feeling",
                    value: `${r}??`
                }, {
                    elementId: "#result-humidity",
                    value: `${a}%`
                }, {
                    elementId: "#result-pressure",
                    value: `${u}mb`
                }, {
                    elementId: "#result-mintemp",
                    value: `${c}??`
                }, {
                    elementId: "#result-maxtemp",
                    value: `${i}??`
                }];
                for (let {
                        elementId: e,
                        value: n
                    } of s) document.querySelector(e).innerText = n
            }(function(e) {
                let n = `${e.name}, ${e.sys.country}`,
                    {
                        main: t,
                        description: r
                    } = e.weather[0],
                    a = e.main,
                    {
                        feels_like: u,
                        humidity: o,
                        pressure: i,
                        temp: c,
                        temp_max: s,
                        temp_min: l
                    } = a;
                return {
                    place: n,
                    weatherTitle: t,
                    weatherDesc: r,
                    feeling: te(u),
                    humidity: o,
                    pressure: i,
                    temp: te(c),
                    maxTemp: te(s),
                    minTemp: te(l)
                }
            }(e)))), ee({
                targets: ue,
                opacity: [0, 1],
                translateY: [-10, 0],
                duration: 3e3,
                begin: () => {
                    ae.style.display = "none", ue.style.display = "block"
                }
            })
        } catch (e) {
            console.log(e), ie.innerText = "No location found!", ee({
                targets: ie,
                opacity: [0, 1],
                begin: () => {
                    ie.style.display = "block"
                }
            })
        } else await ee({
            targets: oe,
            translateX: [-20, 0]
        })
    }
    document.querySelector("#return-btn").addEventListener("click", (async function() {
        oe.value = "", ie.style.display = "none", ee({
            targets: ae,
            opacity: [0, 1],
            translateY: [-10, 0],
            duration: 3e3,
            begin: () => {
                ae.style.display = "block", ue.style.display = "none"
            }
        })
    }));
    const se = document.querySelector("#convert-units-btn");
    se.addEventListener("click", (e => {
        (function() {
            let e = re.map((e => e.innerText.match(/-?[\d\.]+(?=[??])/)[0]));
            re.forEach(((n, t) => {
                let r = (a = e[t], 0 === ne ? 1.8 * Number(a) + 32 : 1 === ne ? 5 / 9 * (Number(a) - 32) : void 0);
                var a;
                n.innerText = Math.round(10 * r) / 10 + "??"
            })), ne = 0 === ne ? 1 : 0
        })(), se.innerText = "F??" == se.innerText ? "C??" : "F??"
    }))
})();