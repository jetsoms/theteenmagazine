﻿/*
 Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
*/
(function () {
  function d(a) {
    a = a.attributes;
    return "application/x-shockwave-flash" == a.type || f.test(a.src || "");
  }
  function e(a, b) {
    return a.createFakeParserElement(b, "cke_flash", "flash", !0);
  }
  var f = /\.swf(?:$|\?)/i;
  CKEDITOR.plugins.add("flash", {
    requires: "dialog,fakeobjects",
    lang: "af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn",
    icons: "flash",
    hidpi: !0,
    onLoad: function () {
      CKEDITOR.addCss(
        "img.cke_flash{background-image: url(" +
          CKEDITOR.getUrl(this.path + "images/placeholder.png") +
          ");background-position: center center;background-repeat: no-repeat;border: 1px solid #a9a9a9;width: 80px;height: 80px;}"
      );
    },
    init: function (a) {
      var b =
        "object[classid,codebase,height,hspace,vspace,width];param[name,value];embed[height,hspace,pluginspage,src,type,vspace,width]";
      CKEDITOR.dialog.isTabEnabled(a, "flash", "properties") &&
        (b += ";object[align]; embed[allowscriptaccess,quality,scale,wmode]");
      CKEDITOR.dialog.isTabEnabled(a, "flash", "advanced") &&
        (b += ";object[id]{*}; embed[bgcolor]{*}(*)");
      a.addCommand(
        "flash",
        new CKEDITOR.dialogCommand("flash", {
          allowedContent: b,
          requiredContent: "embed",
        })
      );
      a.ui.addButton &&
        a.ui.addButton("Flash", {
          label: a.lang.common.flash,
          command: "flash",
          toolbar: "insert,20",
        });
      CKEDITOR.dialog.add("flash", this.path + "dialogs/flash.js");
      a.addMenuItems &&
        a.addMenuItems({
          flash: {
            label: a.lang.flash.properties,
            command: "flash",
            group: "flash",
          },
        });
      a.on("doubleclick", function (a) {
        var b = a.data.element;
        b.is("img") &&
          "flash" == b.data("cke-real-element-type") &&
          (a.data.dialog = "flash");
      });
      a.contextMenu &&
        a.contextMenu.addListener(function (a) {
          if (
            a &&
            a.is("img") &&
            !a.isReadOnly() &&
            "flash" == a.data("cke-real-element-type")
          )
            return { flash: CKEDITOR.TRISTATE_OFF };
        });
    },
    afterInit: function (a) {
      var b = a.dataProcessor;
      (b = b && b.dataFilter) &&
        b.addRules(
          {
            elements: {
              "cke:object": function (b) {
                var c = b.attributes;
                if (!((c.classid && String(c.classid).toLowerCase()) || d(b))) {
                  for (c = 0; c < b.children.length; c++)
                    if ("cke:embed" == b.children[c].name) {
                      if (!d(b.children[c])) break;
                      return e(a, b);
                    }
                  return null;
                }
                return e(a, b);
              },
              "cke:embed": function (b) {
                return d(b) ? e(a, b) : null;
              },
            },
          },
          5
        );
    },
  });
})();
CKEDITOR.tools.extend(CKEDITOR.config, {
  flashEmbedTagOnly: !1,
  flashAddEmbedTag: !0,
  flashConvertOnEdit: !1,
});
