﻿/*
 Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
*/
(function () {
  function f(c) {
    var a = this.att;
    c = (c && c.hasAttribute(a) && c.getAttribute(a)) || "";
    void 0 !== c && this.setValue(c);
  }
  function g() {
    for (var c, a = 0; a < arguments.length; a++)
      if (arguments[a] instanceof CKEDITOR.dom.element) {
        c = arguments[a];
        break;
      }
    if (c) {
      var a = this.att,
        b = this.getValue();
      b ? c.setAttribute(a, b) : c.removeAttribute(a, b);
    }
  }
  var k = { id: 1, dir: 1, classes: 1, styles: 1 };
  CKEDITOR.plugins.add("dialogadvtab", {
    requires: "dialog",
    allowedContent: function (c) {
      c || (c = k);
      var a = [];
      c.id && a.push("id");
      c.dir && a.push("dir");
      var b = "";
      a.length && (b += "[" + a.join(",") + "]");
      c.classes && (b += "(*)");
      c.styles && (b += "{*}");
      return b;
    },
    createAdvancedTab: function (c, a, b) {
      a || (a = k);
      var d = c.lang.common,
        h = {
          id: "advanced",
          label: d.advancedTab,
          title: d.advancedTab,
          elements: [{ type: "vbox", padding: 1, children: [] }],
        },
        e = [];
      if (a.id || a.dir)
        a.id &&
          e.push({
            id: "advId",
            att: "id",
            type: "text",
            requiredContent: b ? b + "[id]" : null,
            label: d.id,
            setup: f,
            commit: g,
          }),
          a.dir &&
            e.push({
              id: "advLangDir",
              att: "dir",
              type: "select",
              requiredContent: b ? b + "[dir]" : null,
              label: d.langDir,
              default: "",
              style: "width:100%",
              items: [
                [d.notSet, ""],
                [d.langDirLTR, "ltr"],
                [d.langDirRTL, "rtl"],
              ],
              setup: f,
              commit: g,
            }),
          h.elements[0].children.push({
            type: "hbox",
            widths: ["50%", "50%"],
            children: [].concat(e),
          });
      if (a.styles || a.classes)
        (e = []),
          a.styles &&
            e.push({
              id: "advStyles",
              att: "style",
              type: "text",
              requiredContent: b ? b + "{cke-xyz}" : null,
              label: d.styles,
              default: "",
              validate: CKEDITOR.dialog.validate.inlineStyle(
                d.invalidInlineStyle
              ),
              onChange: function () {},
              getStyle: function (a, c) {
                var b = this.getValue().match(
                  new RegExp("(?:^|;)\\s*" + a + "\\s*:\\s*([^;]*)", "i")
                );
                return b ? b[1] : c;
              },
              updateStyle: function (a, b) {
                var d = this.getValue(),
                  e = c.document.createElement("span");
                e.setAttribute("style", d);
                e.setStyle(a, b);
                d = CKEDITOR.tools.normalizeCssText(e.getAttribute("style"));
                this.setValue(d, 1);
              },
              setup: f,
              commit: g,
            }),
          a.classes &&
            e.push({
              type: "hbox",
              widths: ["45%", "55%"],
              children: [
                {
                  id: "advCSSClasses",
                  att: "class",
                  type: "text",
                  requiredContent: b ? b + "(cke-xyz)" : null,
                  label: d.cssClasses,
                  default: "",
                  setup: f,
                  commit: g,
                },
              ],
            }),
          h.elements[0].children.push({
            type: "hbox",
            widths: ["50%", "50%"],
            children: [].concat(e),
          });
      return h;
    },
  });
})();
