﻿/*
 Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
*/
(function () {
  function r() {
    return !1;
  }
  var n = CKEDITOR.tools,
    B = CKEDITOR.plugins.pastetools,
    t = B.filters.common,
    k = t.styles,
    C = t.createAttributeStack,
    z = t.lists.getElementIndentation,
    D = ["o:p", "xml", "script", "meta", "link"],
    E =
      "v:arc v:curve v:line v:oval v:polyline v:rect v:roundrect v:group".split(
        " "
      ),
    A = {},
    y = 0,
    q = {},
    g,
    p;
  CKEDITOR.plugins.pastetools.filters.word = q;
  CKEDITOR.plugins.pastefromword = q;
  q.rules = function (b, a, c) {
    function e(d) {
      (d.attributes["o:gfxdata"] || "v:group" === d.parent.name) &&
        l.push(d.attributes.id);
    }
    var f = Boolean(b.match(/mso-list:\s*l\d+\s+level\d+\s+lfo\d+/)),
      l = [],
      w = {
        root: function (d) {
          d.filterChildren(c);
          CKEDITOR.plugins.pastefromword.lists.cleanup(g.createLists(d));
        },
        elementNames: [
          [/^\?xml:namespace$/, ""],
          [/^v:shapetype/, ""],
          [new RegExp(D.join("|")), ""],
        ],
        elements: {
          a: function (d) {
            if (d.attributes.name) {
              if ("_GoBack" == d.attributes.name) {
                delete d.name;
                return;
              }
              if (d.attributes.name.match(/^OLE_LINK\d+$/)) {
                delete d.name;
                return;
              }
            }
            if (d.attributes.href && d.attributes.href.match(/#.+$/)) {
              var a = d.attributes.href.match(/#(.+)$/)[1];
              A[a] = d;
            }
            d.attributes.name &&
              A[d.attributes.name] &&
              ((d = A[d.attributes.name]),
              (d.attributes.href = d.attributes.href.replace(
                /.*#(.*)$/,
                "#$1"
              )));
          },
          div: function (d) {
            if (a.plugins.pagebreak && d.attributes["data-cke-pagebreak"])
              return d;
            k.createStyleStack(d, c, a);
          },
          img: function (d) {
            if (d.parent && d.parent.attributes) {
              var a = d.parent.attributes;
              (a = a.style || a.STYLE) &&
                a.match(/mso\-list:\s?Ignore/) &&
                (d.attributes["cke-ignored"] = !0);
            }
            k.mapCommonStyles(d);
            d.attributes.src &&
              d.attributes.src.match(/^file:\/\//) &&
              d.attributes.alt &&
              d.attributes.alt.match(/^https?:\/\//) &&
              (d.attributes.src = d.attributes.alt);
            d = d.attributes["v:shapes"]
              ? d.attributes["v:shapes"].split(" ")
              : [];
            a = CKEDITOR.tools.array.every(d, function (a) {
              return -1 < l.indexOf(a);
            });
            if (d.length && a) return !1;
          },
          p: function (d) {
            d.filterChildren(c);
            if (
              d.attributes.style &&
              d.attributes.style.match(/display:\s*none/i)
            )
              return !1;
            if (g.thisIsAListItem(a, d))
              p.isEdgeListItem(a, d) && p.cleanupEdgeListItem(d),
                g.convertToFakeListItem(a, d),
                n.array.reduce(
                  d.children,
                  function (a, d) {
                    "p" === d.name &&
                      (0 < a &&
                        new CKEDITOR.htmlParser.element("br").insertBefore(d),
                      d.replaceWithChildren(),
                      (a += 1));
                    return a;
                  },
                  0
                );
            else {
              var b = d.getAscendant(function (a) {
                  return "ul" == a.name || "ol" == a.name;
                }),
                e = n.parseCssText(d.attributes.style);
              b &&
                !b.attributes["cke-list-level"] &&
                e["mso-list"] &&
                e["mso-list"].match(/level/) &&
                (b.attributes["cke-list-level"] =
                  e["mso-list"].match(/level(\d+)/)[1]);
              a.config.enterMode == CKEDITOR.ENTER_BR &&
                (delete d.name, d.add(new CKEDITOR.htmlParser.element("br")));
            }
            k.createStyleStack(d, c, a);
          },
          pre: function (d) {
            g.thisIsAListItem(a, d) && g.convertToFakeListItem(a, d);
            k.createStyleStack(d, c, a);
          },
          h1: function (d) {
            g.thisIsAListItem(a, d) && g.convertToFakeListItem(a, d);
            k.createStyleStack(d, c, a);
          },
          h2: function (d) {
            g.thisIsAListItem(a, d) && g.convertToFakeListItem(a, d);
            k.createStyleStack(d, c, a);
          },
          h3: function (d) {
            g.thisIsAListItem(a, d) && g.convertToFakeListItem(a, d);
            k.createStyleStack(d, c, a);
          },
          h4: function (d) {
            g.thisIsAListItem(a, d) && g.convertToFakeListItem(a, d);
            k.createStyleStack(d, c, a);
          },
          h5: function (d) {
            g.thisIsAListItem(a, d) && g.convertToFakeListItem(a, d);
            k.createStyleStack(d, c, a);
          },
          h6: function (d) {
            g.thisIsAListItem(a, d) && g.convertToFakeListItem(a, d);
            k.createStyleStack(d, c, a);
          },
          font: function (d) {
            if (d.getHtml().match(/^\s*$/))
              return (
                d.parent.type === CKEDITOR.NODE_ELEMENT &&
                  new CKEDITOR.htmlParser.text(" ").insertAfter(d),
                !1
              );
            a &&
              !0 === a.config.pasteFromWordRemoveFontStyles &&
              d.attributes.size &&
              delete d.attributes.size;
            CKEDITOR.dtd.tr[d.parent.name] &&
            CKEDITOR.tools.arrayCompare(
              CKEDITOR.tools.object.keys(d.attributes),
              ["class", "style"]
            )
              ? k.createStyleStack(d, c, a)
              : C(d, c);
          },
          ul: function (a) {
            if (f)
              return (
                "li" == a.parent.name &&
                  0 === n.indexOf(a.parent.children, a) &&
                  k.setStyle(a.parent, "list-style-type", "none"),
                g.dissolveList(a),
                !1
              );
          },
          li: function (d) {
            p.correctLevelShift(d);
            f &&
              ((d.attributes.style = k.normalizedStyles(d, a)),
              k.pushStylesLower(d));
          },
          ol: function (a) {
            if (f)
              return (
                "li" == a.parent.name &&
                  0 === n.indexOf(a.parent.children, a) &&
                  k.setStyle(a.parent, "list-style-type", "none"),
                g.dissolveList(a),
                !1
              );
          },
          span: function (d) {
            d.filterChildren(c);
            d.attributes.style = k.normalizedStyles(d, a);
            if (
              !d.attributes.style ||
              d.attributes.style.match(/^mso\-bookmark:OLE_LINK\d+$/) ||
              d.getHtml().match(/^(\s|&nbsp;)+$/)
            )
              return t.elements.replaceWithChildren(d), !1;
            d.attributes.style.match(/FONT-FAMILY:\s*Symbol/i) &&
              d.forEach(
                function (a) {
                  a.value = a.value.replace(/&nbsp;/g, "");
                },
                CKEDITOR.NODE_TEXT,
                !0
              );
            k.createStyleStack(d, c, a);
          },
          "v:imagedata": r,
          "v:shape": function (a) {
            var b = !1;
            if (null === a.getFirst("v:imagedata")) e(a);
            else {
              a.parent.find(function (c) {
                "img" == c.name &&
                  c.attributes &&
                  c.attributes["v:shapes"] == a.attributes.id &&
                  (b = !0);
              }, !0);
              if (b) return !1;
              var f = "";
              "v:group" === a.parent.name
                ? e(a)
                : (a.forEach(
                    function (a) {
                      a.attributes &&
                        a.attributes.src &&
                        (f = a.attributes.src);
                    },
                    CKEDITOR.NODE_ELEMENT,
                    !0
                  ),
                  a.filterChildren(c),
                  (a.name = "img"),
                  (a.attributes.src = a.attributes.src || f),
                  delete a.attributes.type);
            }
          },
          style: function () {
            return !1;
          },
          object: function (a) {
            return !(!a.attributes || !a.attributes.data);
          },
          br: function (b) {
            if (
              a.plugins.pagebreak &&
              ((b = n.parseCssText(b.attributes.style, !0)),
              "always" === b["page-break-before"] ||
                "page" === b["break-before"])
            )
              return (
                (b = CKEDITOR.plugins.pagebreak.createElement(a)),
                CKEDITOR.htmlParser.fragment.fromHtml(b.getOuterHtml())
                  .children[0]
              );
          },
        },
        attributes: {
          style: function (b, c) {
            return k.normalizedStyles(c, a) || !1;
          },
          class: function (a) {
            a = a.replace(
              /(el\d+)|(font\d+)|msonormal|msolistparagraph\w*/gi,
              ""
            );
            return "" === a ? !1 : a;
          },
          cellspacing: r,
          cellpadding: r,
          border: r,
          "v:shapes": r,
          "o:spid": r,
        },
        comment: function (a) {
          a.match(/\[if.* supportFields.*\]/) && y++;
          "[endif]" == a && (y = 0 < y ? y - 1 : 0);
          return !1;
        },
        text: function (a, b) {
          if (y) return "";
          var c = b.parent && b.parent.parent;
          return c &&
            c.attributes &&
            c.attributes.style &&
            c.attributes.style.match(/mso-list:\s*ignore/i)
            ? a.replace(/&nbsp;/g, " ")
            : a;
        },
      };
    n.array.forEach(E, function (a) {
      w.elements[a] = e;
    });
    return w;
  };
  q.lists = {
    thisIsAListItem: function (b, a) {
      return p.isEdgeListItem(b, a) ||
        (a.attributes.style &&
          a.attributes.style.match(/mso\-list:\s?l\d/) &&
          "li" !== a.parent.name) ||
        a.attributes["cke-dissolved"] ||
        a.getHtml().match(/<!\-\-\[if !supportLists]\-\->/)
        ? !0
        : !1;
    },
    convertToFakeListItem: function (b, a) {
      p.isDegenerateListItem(b, a) && p.assignListLevels(b, a);
      this.getListItemInfo(a);
      if (!a.attributes["cke-dissolved"]) {
        var c;
        a.forEach(function (a) {
          !c &&
            "img" == a.name &&
            a.attributes["cke-ignored"] &&
            "*" == a.attributes.alt &&
            ((c = "·"), a.remove());
        }, CKEDITOR.NODE_ELEMENT);
        a.forEach(function (a) {
          c || a.value.match(/^ /) || (c = a.value);
        }, CKEDITOR.NODE_TEXT);
        if ("undefined" == typeof c) return;
        a.attributes["cke-symbol"] = c.replace(/(?: |&nbsp;).*$/, "");
        g.removeSymbolText(a);
      }
      var e = a.attributes && n.parseCssText(a.attributes.style);
      if (e["margin-left"]) {
        var f = e["margin-left"],
          l = a.attributes["cke-list-level"];
        (f = Math.max(CKEDITOR.tools.convertToPx(f) - 40 * l, 0))
          ? (e["margin-left"] = f + "px")
          : delete e["margin-left"];
        a.attributes.style = CKEDITOR.tools.writeCssText(e);
      }
      a.name = "cke:li";
    },
    convertToRealListItems: function (b) {
      var a = [];
      b.forEach(
        function (b) {
          "cke:li" == b.name && ((b.name = "li"), a.push(b));
        },
        CKEDITOR.NODE_ELEMENT,
        !1
      );
      return a;
    },
    removeSymbolText: function (b) {
      var a = b.attributes["cke-symbol"],
        c = b.findOne(function (b) {
          return b.value && -1 < b.value.indexOf(a);
        }, !0),
        e;
      c &&
        ((c.value = c.value.replace(a, "")),
        (e = c.parent),
        e.getHtml().match(/^(\s|&nbsp;)*$/) && e !== b
          ? e.remove()
          : c.value || c.remove());
    },
    setListSymbol: function (b, a, c) {
      c = c || 1;
      var e = n.parseCssText(b.attributes.style);
      if ("ol" == b.name) {
        if (b.attributes.type || e["list-style-type"]) return;
        var f = {
            "[ivx]": "lower-roman",
            "[IVX]": "upper-roman",
            "[a-z]": "lower-alpha",
            "[A-Z]": "upper-alpha",
            "\\d": "decimal",
          },
          l;
        for (l in f)
          if (g.getSubsectionSymbol(a).match(new RegExp(l))) {
            e["list-style-type"] = f[l];
            break;
          }
        b.attributes["cke-list-style-type"] = e["list-style-type"];
      } else
        (f = { "·": "disc", o: "circle", "§": "square" }),
          !e["list-style-type"] && f[a] && (e["list-style-type"] = f[a]);
      g.setListSymbol.removeRedundancies(e, c);
      (b.attributes.style = CKEDITOR.tools.writeCssText(e)) ||
        delete b.attributes.style;
    },
    setListStart: function (b) {
      for (var a = [], c = 0, e = 0; e < b.children.length; e++)
        a.push(b.children[e].attributes["cke-symbol"] || "");
      a[0] || c++;
      switch (b.attributes["cke-list-style-type"]) {
        case "lower-roman":
        case "upper-roman":
          b.attributes.start = g.toArabic(g.getSubsectionSymbol(a[c])) - c;
          break;
        case "lower-alpha":
        case "upper-alpha":
          b.attributes.start =
            g
              .getSubsectionSymbol(a[c])
              .replace(/\W/g, "")
              .toLowerCase()
              .charCodeAt(0) -
            96 -
            c;
          break;
        case "decimal":
          b.attributes.start =
            parseInt(g.getSubsectionSymbol(a[c]), 10) - c || 1;
      }
      "1" == b.attributes.start && delete b.attributes.start;
      delete b.attributes["cke-list-style-type"];
    },
    numbering: {
      toNumber: function (b, a) {
        function c(a) {
          a = a.toUpperCase();
          for (var b = 1, c = 1; 0 < a.length; c *= 26)
            (b +=
              "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(a.charAt(a.length - 1)) * c),
              (a = a.substr(0, a.length - 1));
          return b;
        }
        function e(a) {
          var b = [
            [1e3, "M"],
            [900, "CM"],
            [500, "D"],
            [400, "CD"],
            [100, "C"],
            [90, "XC"],
            [50, "L"],
            [40, "XL"],
            [10, "X"],
            [9, "IX"],
            [5, "V"],
            [4, "IV"],
            [1, "I"],
          ];
          a = a.toUpperCase();
          for (var c = b.length, d = 0, e = 0; e < c; ++e)
            for (
              var g = b[e], u = g[1].length;
              a.substr(0, u) == g[1];
              a = a.substr(u)
            )
              d += g[0];
          return d;
        }
        return "decimal" == a
          ? Number(b)
          : "upper-roman" == a || "lower-roman" == a
          ? e(b.toUpperCase())
          : "lower-alpha" == a || "upper-alpha" == a
          ? c(b)
          : 1;
      },
      getStyle: function (b) {
        b = b.slice(0, 1);
        var a = {
          i: "lower-roman",
          v: "lower-roman",
          x: "lower-roman",
          l: "lower-roman",
          m: "lower-roman",
          I: "upper-roman",
          V: "upper-roman",
          X: "upper-roman",
          L: "upper-roman",
          M: "upper-roman",
        }[b];
        a ||
          ((a = "decimal"),
          b.match(/[a-z]/) && (a = "lower-alpha"),
          b.match(/[A-Z]/) && (a = "upper-alpha"));
        return a;
      },
    },
    getSubsectionSymbol: function (b) {
      return (b.match(/([\da-zA-Z]+).?$/) || ["placeholder", "1"])[1];
    },
    setListDir: function (b) {
      var a = 0,
        c = 0;
      b.forEach(function (b) {
        "li" == b.name &&
          ("rtl" == (b.attributes.dir || b.attributes.DIR || "").toLowerCase()
            ? c++
            : a++);
      }, CKEDITOR.ELEMENT_NODE);
      c > a && (b.attributes.dir = "rtl");
    },
    createList: function (b) {
      return (b.attributes["cke-symbol"].match(/([\da-np-zA-NP-Z]).?/) || [])[1]
        ? new CKEDITOR.htmlParser.element("ol")
        : new CKEDITOR.htmlParser.element("ul");
    },
    createLists: function (b) {
      function a(a) {
        return CKEDITOR.tools.array.reduce(
          a,
          function (a, b) {
            if (b.attributes && b.attributes.style)
              var c = CKEDITOR.tools.parseCssText(b.attributes.style)[
                "margin-left"
              ];
            return c ? a + parseInt(c, 10) : a;
          },
          0
        );
      }
      var c,
        e,
        f,
        l = g.convertToRealListItems(b);
      if (0 === l.length) return [];
      var k = g.groupLists(l);
      for (b = 0; b < k.length; b++) {
        var d = k[b],
          h = d[0];
        for (f = 0; f < d.length; f++)
          if (1 == d[f].attributes["cke-list-level"]) {
            h = d[f];
            break;
          }
        var h = [g.createList(h)],
          m = h[0],
          u = [h[0]];
        m.insertBefore(d[0]);
        for (f = 0; f < d.length; f++) {
          c = d[f];
          for (e = c.attributes["cke-list-level"]; e > h.length; ) {
            var v = g.createList(c),
              x = m.children;
            0 < x.length
              ? x[x.length - 1].add(v)
              : ((x = new CKEDITOR.htmlParser.element("li", {
                  style: "list-style-type:none",
                })),
                x.add(v),
                m.add(x));
            h.push(v);
            u.push(v);
            m = v;
            e == h.length && g.setListSymbol(v, c.attributes["cke-symbol"], e);
          }
          for (; e < h.length; )
            h.pop(),
              (m = h[h.length - 1]),
              e == h.length &&
                g.setListSymbol(m, c.attributes["cke-symbol"], e);
          c.remove();
          m.add(c);
        }
        h[0].children.length &&
          ((f = h[0].children[0].attributes["cke-symbol"]),
          !f &&
            1 < h[0].children.length &&
            (f = h[0].children[1].attributes["cke-symbol"]),
          f && g.setListSymbol(h[0], f));
        for (f = 0; f < u.length; f++) g.setListStart(u[f]);
        for (f = 0; f < d.length; f++) this.determineListItemValue(d[f]);
      }
      CKEDITOR.tools.array.forEach(l, function (b) {
        for (var c = [], d = b.parent; d; )
          "li" === d.name && c.push(d), (d = d.parent);
        var c = a(c),
          e;
        c &&
          ((b.attributes = b.attributes || {}),
          (d = CKEDITOR.tools.parseCssText(b.attributes.style)),
          (e = d["margin-left"] || 0),
          (e = Math.max(parseInt(e, 10) - c, 0))
            ? (d["margin-left"] = e + "px")
            : delete d["margin-left"],
          (b.attributes.style = CKEDITOR.tools.writeCssText(d)));
      });
      return l;
    },
    cleanup: function (b) {
      var a = [
          "cke-list-level",
          "cke-symbol",
          "cke-list-id",
          "cke-indentation",
          "cke-dissolved",
        ],
        c,
        e;
      for (c = 0; c < b.length; c++)
        for (e = 0; e < a.length; e++) delete b[c].attributes[a[e]];
    },
    determineListItemValue: function (b) {
      if ("ol" === b.parent.name) {
        var a = this.calculateValue(b),
          c = b.attributes["cke-symbol"].match(/[a-z0-9]+/gi),
          e;
        c &&
          ((c = c[c.length - 1]),
          (e =
            b.parent.attributes["cke-list-style-type"] ||
            this.numbering.getStyle(c)),
          (c = this.numbering.toNumber(c, e)),
          c !== a && (b.attributes.value = c));
      }
    },
    calculateValue: function (b) {
      if (!b.parent) return 1;
      var a = b.parent;
      b = b.getIndex();
      var c = null,
        e,
        f,
        g;
      for (g = b; 0 <= g && null === c; g--)
        (f = a.children[g]),
          f.attributes &&
            void 0 !== f.attributes.value &&
            ((e = g), (c = parseInt(f.attributes.value, 10)));
      null === c &&
        ((c =
          void 0 !== a.attributes.start ? parseInt(a.attributes.start, 10) : 1),
        (e = 0));
      return c + (b - e);
    },
    dissolveList: function (b) {
      function a(b) {
        return 50 <= b
          ? "l" + a(b - 50)
          : 40 <= b
          ? "xl" + a(b - 40)
          : 10 <= b
          ? "x" + a(b - 10)
          : 9 == b
          ? "ix"
          : 5 <= b
          ? "v" + a(b - 5)
          : 4 == b
          ? "iv"
          : 1 <= b
          ? "i" + a(b - 1)
          : "";
      }
      function c(a, b) {
        function c(b, d) {
          return b && b.parent
            ? a(b.parent)
              ? c(b.parent, d + 1)
              : c(b.parent, d)
            : d;
        }
        return c(b, 0);
      }
      var e = function (a) {
          return function (b) {
            return b.name == a;
          };
        },
        f = function (a) {
          return e("ul")(a) || e("ol")(a);
        },
        g = CKEDITOR.tools.array,
        w = [],
        d,
        h;
      b.forEach(
        function (a) {
          w.push(a);
        },
        CKEDITOR.NODE_ELEMENT,
        !1
      );
      d = g.filter(w, e("li"));
      var m = g.filter(w, f);
      g.forEach(m, function (b) {
        var d = b.attributes.type,
          h = parseInt(b.attributes.start, 10) || 1,
          m = c(f, b) + 1;
        d || (d = n.parseCssText(b.attributes.style)["list-style-type"]);
        g.forEach(g.filter(b.children, e("li")), function (c, e) {
          var f;
          switch (d) {
            case "disc":
              f = "·";
              break;
            case "circle":
              f = "o";
              break;
            case "square":
              f = "§";
              break;
            case "1":
            case "decimal":
              f = h + e + ".";
              break;
            case "a":
            case "lower-alpha":
              f = String.fromCharCode(97 + h - 1 + e) + ".";
              break;
            case "A":
            case "upper-alpha":
              f = String.fromCharCode(65 + h - 1 + e) + ".";
              break;
            case "i":
            case "lower-roman":
              f = a(h + e) + ".";
              break;
            case "I":
            case "upper-roman":
              f = a(h + e).toUpperCase() + ".";
              break;
            default:
              f = "ul" == b.name ? "·" : h + e + ".";
          }
          c.attributes["cke-symbol"] = f;
          c.attributes["cke-list-level"] = m;
        });
      });
      d = g.reduce(
        d,
        function (a, b) {
          var c = b.children[0];
          if (
            c &&
            c.name &&
            c.attributes.style &&
            c.attributes.style.match(/mso-list:/i)
          ) {
            k.pushStylesLower(b, { "list-style-type": !0, display: !0 });
            var d = n.parseCssText(c.attributes.style, !0);
            k.setStyle(b, "mso-list", d["mso-list"], !0);
            k.setStyle(c, "mso-list", "");
            delete b["cke-list-level"];
            (c = d.display ? "display" : d.DISPLAY ? "DISPLAY" : "") &&
              k.setStyle(b, "display", d[c], !0);
          }
          if (1 === b.children.length && f(b.children[0])) return a;
          b.name = "p";
          b.attributes["cke-dissolved"] = !0;
          a.push(b);
          return a;
        },
        []
      );
      for (h = d.length - 1; 0 <= h; h--) d[h].insertAfter(b);
      for (h = m.length - 1; 0 <= h; h--) delete m[h].name;
    },
    groupLists: function (b) {
      var a,
        c,
        e = [[b[0]]],
        f = e[0];
      c = b[0];
      c.attributes["cke-indentation"] = c.attributes["cke-indentation"] || z(c);
      for (a = 1; a < b.length; a++) {
        c = b[a];
        var l = b[a - 1];
        c.attributes["cke-indentation"] =
          c.attributes["cke-indentation"] || z(c);
        c.previous !== l && (g.chopDiscontinuousLists(f, e), e.push((f = [])));
        f.push(c);
      }
      g.chopDiscontinuousLists(f, e);
      return e;
    },
    chopDiscontinuousLists: function (b, a) {
      for (var c = {}, e = [[]], f, l = 0; l < b.length; l++) {
        var k = c[b[l].attributes["cke-list-level"]],
          d = this.getListItemInfo(b[l]),
          h,
          m;
        k
          ? ((m = k.type.match(/alpha/) && 7 == k.index ? "alpha" : m),
            (m =
              "o" == b[l].attributes["cke-symbol"] && 14 == k.index
                ? "alpha"
                : m),
            (h = g.getSymbolInfo(b[l].attributes["cke-symbol"], m)),
            (d = this.getListItemInfo(b[l])),
            (k.type != h.type ||
              (f && d.id != f.id && !this.isAListContinuation(b[l]))) &&
              e.push([]))
          : (h = g.getSymbolInfo(b[l].attributes["cke-symbol"]));
        for (
          f = parseInt(b[l].attributes["cke-list-level"], 10) + 1;
          20 > f;
          f++
        )
          c[f] && delete c[f];
        c[b[l].attributes["cke-list-level"]] = h;
        e[e.length - 1].push(b[l]);
        f = d;
      }
      [].splice.apply(a, [].concat([n.indexOf(a, b), 1], e));
    },
    isAListContinuation: function (b) {
      var a = b;
      do
        if ((a = a.previous) && a.type === CKEDITOR.NODE_ELEMENT) {
          if (void 0 === a.attributes["cke-list-level"]) break;
          if (a.attributes["cke-list-level"] === b.attributes["cke-list-level"])
            return a.attributes["cke-list-id"] === b.attributes["cke-list-id"];
        }
      while (a);
      return !1;
    },
    toArabic: function (b) {
      return b.match(/[ivxl]/i)
        ? b.match(/^l/i)
          ? 50 + g.toArabic(b.slice(1))
          : b.match(/^lx/i)
          ? 40 + g.toArabic(b.slice(1))
          : b.match(/^x/i)
          ? 10 + g.toArabic(b.slice(1))
          : b.match(/^ix/i)
          ? 9 + g.toArabic(b.slice(2))
          : b.match(/^v/i)
          ? 5 + g.toArabic(b.slice(1))
          : b.match(/^iv/i)
          ? 4 + g.toArabic(b.slice(2))
          : b.match(/^i/i)
          ? 1 + g.toArabic(b.slice(1))
          : g.toArabic(b.slice(1))
        : 0;
    },
    getSymbolInfo: function (b, a) {
      var c = b.toUpperCase() == b ? "upper-" : "lower-",
        e = { "·": ["disc", -1], o: ["circle", -2], "§": ["square", -3] };
      if (b in e || (a && a.match(/(disc|circle|square)/)))
        return { index: e[b][1], type: e[b][0] };
      if (b.match(/\d/))
        return {
          index: b ? parseInt(g.getSubsectionSymbol(b), 10) : 0,
          type: "decimal",
        };
      b = b.replace(/\W/g, "").toLowerCase();
      return (!a && b.match(/[ivxl]+/i)) || (a && "alpha" != a) || "roman" == a
        ? { index: g.toArabic(b), type: c + "roman" }
        : b.match(/[a-z]/i)
        ? { index: b.charCodeAt(0) - 97, type: c + "alpha" }
        : { index: -1, type: "disc" };
    },
    getListItemInfo: function (b) {
      if (void 0 !== b.attributes["cke-list-id"])
        return {
          id: b.attributes["cke-list-id"],
          level: b.attributes["cke-list-level"],
        };
      var a = n.parseCssText(b.attributes.style)["mso-list"],
        c = { id: "0", level: "1" };
      a &&
        ((a += " "),
        (c.level = a.match(/level(.+?)\s+/)[1]),
        (c.id = a.match(/l(\d+?)\s+/)[1]));
      b.attributes["cke-list-level"] =
        void 0 !== b.attributes["cke-list-level"]
          ? b.attributes["cke-list-level"]
          : c.level;
      b.attributes["cke-list-id"] = c.id;
      return c;
    },
  };
  g = q.lists;
  q.images = {
    extractFromRtf: function (b) {
      var a = [],
        c =
          /\{\\pict[\s\S]+?\\bliptag\-?\d+(\\blipupi\-?\d+)?(\{\\\*\\blipuid\s?[\da-fA-F]+)?[\s\}]*?/,
        e;
      b = b.match(
        new RegExp("(?:(" + c.source + "))([\\da-fA-F\\s]+)\\}", "g")
      );
      if (!b) return a;
      for (var f = 0; f < b.length; f++)
        if (c.test(b[f])) {
          if (-1 !== b[f].indexOf("\\pngblip")) e = "image/png";
          else if (-1 !== b[f].indexOf("\\jpegblip")) e = "image/jpeg";
          else continue;
          a.push({
            hex: e ? b[f].replace(c, "").replace(/[^\da-fA-F]/g, "") : null,
            type: e,
          });
        }
      return a;
    },
    extractTagsFromHtml: function (b) {
      for (var a = /<img[^>]+src="([^"]+)[^>]+/g, c = [], e; (e = a.exec(b)); )
        c.push(e[1]);
      return c;
    },
  };
  q.heuristics = {
    isEdgeListItem: function (b, a) {
      if (!CKEDITOR.env.edge || !b.config.pasteFromWord_heuristicsEdgeList)
        return !1;
      var c = "";
      a.forEach &&
        a.forEach(function (a) {
          c += a.value;
        }, CKEDITOR.NODE_TEXT);
      return c.match(/^(?: |&nbsp;)*\(?[a-zA-Z0-9]+?[\.\)](?: |&nbsp;){2,}/)
        ? !0
        : p.isDegenerateListItem(b, a);
    },
    cleanupEdgeListItem: function (b) {
      var a = !1;
      b.forEach(function (b) {
        a ||
          ((b.value = b.value.replace(/^(?:&nbsp;|[\s])+/, "")),
          b.value.length && (a = !0));
      }, CKEDITOR.NODE_TEXT);
    },
    isDegenerateListItem: function (b, a) {
      return (
        !!a.attributes["cke-list-level"] ||
        (a.attributes.style &&
          !a.attributes.style.match(/mso\-list/) &&
          !!a.find(function (b) {
            if (
              b.type == CKEDITOR.NODE_ELEMENT &&
              a.name.match(/h\d/i) &&
              b.getHtml().match(/^[a-zA-Z0-9]+?[\.\)]$/)
            )
              return !0;
            var e = n.parseCssText(b.attributes && b.attributes.style, !0);
            if (!e) return !1;
            var f = e["font-family"] || "";
            return (
              ((e.font || e["font-size"] || "").match(/7pt/i) &&
                !!b.previous) ||
              f.match(/symbol/i)
            );
          }, !0).length)
      );
    },
    assignListLevels: function (b, a) {
      if (!a.attributes || void 0 === a.attributes["cke-list-level"]) {
        for (
          var c = [z(a)], e = [a], f = [], g = CKEDITOR.tools.array, k = g.map;
          a.next &&
          a.next.attributes &&
          !a.next.attributes["cke-list-level"] &&
          p.isDegenerateListItem(b, a.next);

        )
          (a = a.next), c.push(z(a)), e.push(a);
        var d = k(c, function (a, b) {
            return 0 === b ? 0 : a - c[b - 1];
          }),
          h = this.guessIndentationStep(
            g.filter(c, function (a) {
              return 0 !== a;
            })
          ),
          f = k(c, function (a) {
            return Math.round(a / h);
          });
        -1 !== g.indexOf(f, 0) &&
          (f = k(f, function (a) {
            return a + 1;
          }));
        g.forEach(e, function (a, b) {
          a.attributes["cke-list-level"] = f[b];
        });
        return { indents: c, levels: f, diffs: d };
      }
    },
    guessIndentationStep: function (b) {
      return b.length ? Math.min.apply(null, b) : null;
    },
    correctLevelShift: function (b) {
      if (this.isShifted(b)) {
        var a = CKEDITOR.tools.array.filter(b.children, function (a) {
            return "ul" == a.name || "ol" == a.name;
          }),
          c = CKEDITOR.tools.array.reduce(
            a,
            function (a, b) {
              return (
                b.children &&
                1 == b.children.length &&
                p.isShifted(b.children[0])
                  ? [b]
                  : b.children
              ).concat(a);
            },
            []
          );
        CKEDITOR.tools.array.forEach(a, function (a) {
          a.remove();
        });
        CKEDITOR.tools.array.forEach(c, function (a) {
          b.add(a);
        });
        delete b.name;
      }
    },
    isShifted: function (b) {
      return "li" !== b.name
        ? !1
        : 0 ===
            CKEDITOR.tools.array.filter(b.children, function (a) {
              return a.name &&
                ("ul" == a.name ||
                  "ol" == a.name ||
                  ("p" == a.name && 0 === a.children.length))
                ? !1
                : !0;
            }).length;
    },
  };
  p = q.heuristics;
  g.setListSymbol.removeRedundancies = function (b, a) {
    ((1 === a && "disc" === b["list-style-type"]) ||
      "decimal" === b["list-style-type"]) &&
      delete b["list-style-type"];
  };
  CKEDITOR.cleanWord = CKEDITOR.pasteFilters.word = B.createFilter({
    rules: [t.rules, q.rules],
    additionalTransforms: function (b) {
      CKEDITOR.plugins.clipboard.isCustomDataTypesSupported &&
        (b = t.styles.inliner.inline(b).getBody().getHtml());
      return b.replace(/<!\[/g, "\x3c!--[").replace(/\]>/g, "]--\x3e");
    },
  });
  CKEDITOR.config.pasteFromWord_heuristicsEdgeList = !0;
})();
