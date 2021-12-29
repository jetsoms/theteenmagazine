﻿/*
 Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
*/
(function () {
  function k(a, b) {
    var c = a.config,
      d = b.lang,
      e = new CKEDITOR.style(b.styleDefinition),
      f = new l({
        entries: b.entries,
        styleVariable: b.styleVariable,
        styleDefinition: b.styleDefinition,
      }),
      g;
    a.addCommand(b.commandName, {
      exec: function (a, b) {
        var c = b.newStyle,
          d = b.oldStyle,
          e = a.getSelection().getRanges()[0],
          f = void 0 === c;
        if (d || c)
          if ((d && e.collapsed && m({ editor: a, range: e, style: d }), f))
            a.removeStyle(d);
          else {
            if ((e = d))
              (e =
                d instanceof CKEDITOR.style && c instanceof CKEDITOR.style
                  ? CKEDITOR.style.getStyleText(d.getDefinition()) ===
                    CKEDITOR.style.getStyleText(c.getDefinition())
                  : !1),
                (e = !e);
            e && a.removeStyle(d);
            a.applyStyle(c);
          }
      },
      refresh: function (a, b) {
        e.checkApplicable(b, a, a.activeFilter) ||
          this.setState(CKEDITOR.TRISTATE_DISABLED);
      },
    });
    g = a.getCommand(b.commandName);
    a.ui.addRichCombo(b.comboName, {
      label: d.label,
      title: d.panelTitle,
      command: b.commandName,
      toolbar: "styles," + b.order,
      defaultValue: "cke-default",
      allowedContent: e,
      requiredContent: e,
      contentTransformations:
        "span" === b.styleDefinition.element
          ? [
              [
                {
                  element: "font",
                  check: "span",
                  left: function (a) {
                    return (
                      !!a.attributes.size ||
                      !!a.attributes.align ||
                      !!a.attributes.face
                    );
                  },
                  right: function (a) {
                    var b =
                      " x-small small medium large x-large xx-large 48px".split(
                        " "
                      );
                    a.name = "span";
                    a.attributes.size &&
                      ((a.styles["font-size"] = b[a.attributes.size]),
                      delete a.attributes.size);
                    a.attributes.align &&
                      ((a.styles["text-align"] = a.attributes.align),
                      delete a.attributes.align);
                    a.attributes.face &&
                      ((a.styles["font-family"] = a.attributes.face),
                      delete a.attributes.face);
                  },
                },
              ],
            ]
          : null,
      panel: {
        css: [CKEDITOR.skin.getPath("editor")].concat(c.contentsCss),
        multiSelect: !1,
        attributes: { "aria-label": d.panelTitle },
      },
      init: function () {
        var b = "(" + a.lang.common.optionDefault + ")";
        this.startGroup(d.panelTitle);
        this.add(this.defaultValue, b, b);
        f.addToCombo(this);
      },
      onClick: function (c) {
        var d = this.getValue();
        a.focus();
        a.fire("saveSnapshot");
        a.execCommand(b.commandName, {
          newStyle: f.getStyle(c),
          oldStyle: f.getStyle(d),
        });
        a.fire("saveSnapshot");
      },
      onRender: function () {
        a.on(
          "selectionChange",
          function (c) {
            var d = this.getValue();
            (c = f.getMatchingValue(a, c.data.path))
              ? c != d && this.setValue(c)
              : this.setValue("", b.defaultLabel);
          },
          this
        );
        g.on(
          "state",
          function () {
            this.setState(g.state);
          },
          this
        );
      },
      refresh: function () {
        this.setState(g.state);
      },
    });
  }
  function m(a) {
    var b = a.editor,
      c = a.range,
      d = a.style,
      e,
      f,
      g;
    e = b.elementPath();
    if (
      (a = e.contains(function (a) {
        return d.checkElementRemovable(a);
      }))
    ) {
      f = c.checkBoundaryOfElement(a, CKEDITOR.START);
      g = c.checkBoundaryOfElement(a, CKEDITOR.END);
      if (f && g) {
        for (f = c.createBookmark(); (e = a.getFirst()); ) e.insertBefore(a);
        a.remove();
        c.moveToBookmark(f);
      } else
        f || g
          ? c.moveToPosition(
              a,
              f ? CKEDITOR.POSITION_BEFORE_START : CKEDITOR.POSITION_AFTER_END
            )
          : (c.splitElement(a),
            c.moveToPosition(a, CKEDITOR.POSITION_AFTER_END)),
          h(c, e.elements.slice(), a);
      b.getSelection().selectRanges([c]);
    }
  }
  function h(a, b, c) {
    var d = b.pop();
    if (d) {
      if (c) return h(a, b, d.equals(c) ? null : c);
      c = d.clone();
      a.insertNode(c);
      a.moveToPosition(c, CKEDITOR.POSITION_AFTER_START);
      h(a, b);
    }
  }
  var l = CKEDITOR.tools.createClass({
    $: function (a) {
      var b = a.entries.split(";");
      this._.data = {};
      this._.names = [];
      for (var c = 0; c < b.length; c++) {
        var d = b[c],
          e,
          f;
        d
          ? ((d = d.split("/")),
            (e = d[0]),
            (d = d[1]),
            (f = {}),
            (f[a.styleVariable] = d || e),
            (this._.data[e] = new CKEDITOR.style(a.styleDefinition, f)),
            (this._.data[e]._.definition.name = e),
            this._.names.push(e))
          : (b.splice(c, 1), c--);
      }
    },
    proto: {
      getStyle: function (a) {
        return this._.data[a];
      },
      addToCombo: function (a) {
        for (var b = 0; b < this._.names.length; b++) {
          var c = this._.names[b];
          a.add(c, this.getStyle(c).buildPreview(), c);
        }
      },
      getMatchingValue: function (a, b) {
        for (var c = b.elements, d = 0, e; d < c.length; d++)
          if (((e = c[d]), (e = this._.findMatchingStyleName(a, e)))) return e;
        return null;
      },
    },
    _: {
      findMatchingStyleName: function (a, b) {
        return CKEDITOR.tools.array.find(
          this._.names,
          function (c) {
            return this.getStyle(c).checkElementMatch(b, !0, a);
          },
          this
        );
      },
    },
  });
  CKEDITOR.plugins.add("font", {
    requires: "richcombo",
    lang: "af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn",
    init: function (a) {
      var b = a.config;
      k(a, {
        comboName: "Font",
        commandName: "font",
        styleVariable: "family",
        lang: a.lang.font,
        entries: b.font_names,
        defaultLabel: b.font_defaultLabel,
        styleDefinition: b.font_style,
        order: 30,
      });
      k(a, {
        comboName: "FontSize",
        commandName: "fontSize",
        styleVariable: "size",
        lang: a.lang.font.fontSize,
        entries: b.fontSize_sizes,
        defaultLabel: b.fontSize_defaultLabel,
        styleDefinition: b.fontSize_style,
        order: 40,
      });
    },
  });
})();
CKEDITOR.config.font_names =
  "Arial/Arial, Helvetica, sans-serif;Comic Sans MS/Comic Sans MS, cursive;Courier New/Courier New, Courier, monospace;Georgia/Georgia, serif;Lucida Sans Unicode/Lucida Sans Unicode, Lucida Grande, sans-serif;Tahoma/Tahoma, Geneva, sans-serif;Times New Roman/Times New Roman, Times, serif;Trebuchet MS/Trebuchet MS, Helvetica, sans-serif;Verdana/Verdana, Geneva, sans-serif";
CKEDITOR.config.font_defaultLabel = "";
CKEDITOR.config.font_style = {
  element: "span",
  styles: { "font-family": "#(family)" },
  overrides: [{ element: "font", attributes: { face: null } }],
};
CKEDITOR.config.fontSize_sizes =
  "8/8px;9/9px;10/10px;11/11px;12/12px;14/14px;16/16px;18/18px;20/20px;22/22px;24/24px;26/26px;28/28px;36/36px;48/48px;72/72px";
CKEDITOR.config.fontSize_defaultLabel = "";
CKEDITOR.config.fontSize_style = {
  element: "span",
  styles: { "font-size": "#(size)" },
  overrides: [{ element: "font", attributes: { size: null } }],
};
