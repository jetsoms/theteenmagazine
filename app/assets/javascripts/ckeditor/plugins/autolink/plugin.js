﻿/*
 Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
*/
(function () {
  var f = /"/g;
  CKEDITOR.plugins.add("autolink", {
    requires: "clipboard,textmatch",
    init: function (b) {
      function e(a) {
        a = { text: a, link: a.replace(f, "%22") };
        a = a.link.match(b.config.autolink_urlRegex)
          ? g.output(a)
          : h.output(a);
        if (b.plugins.link) {
          a = CKEDITOR.dom.element.createFromHtml(a);
          var c = CKEDITOR.plugins.link.parseLinkAttributes(b, a),
            c = CKEDITOR.plugins.link.getLinkAttributes(b, c);
          CKEDITOR.tools.isEmpty(c.set) || a.setAttributes(c.set);
          c.removed.length && a.removeAttributes(c.removed);
          a.removeAttribute("data-cke-saved-href");
          a = a.getOuterHtml();
        }
        return a;
      }
      function k(a, c) {
        var b = a.slice(0, c).split(/\s+/);
        return (b = b[b.length - 1]) && d(b)
          ? { start: a.lastIndexOf(b), end: c }
          : null;
      }
      function d(a) {
        return (
          a.match(b.config.autolink_urlRegex) ||
          a.match(b.config.autolink_emailRegex)
        );
      }
      var g = new CKEDITOR.template(
          '\x3ca href\x3d"{link}"\x3e{text}\x3c/a\x3e'
        ),
        h = new CKEDITOR.template(
          '\x3ca href\x3d"mailto:{link}"\x3e{text}\x3c/a\x3e'
        );
      b.on("paste", function (a) {
        if (
          a.data.dataTransfer.getTransferType(b) !=
          CKEDITOR.DATA_TRANSFER_INTERNAL
        ) {
          var c = a.data.dataValue;
          -1 < c.indexOf("\x3c") ||
            !d(c) ||
            ((a.data.dataValue = e(c)), (a.data.type = "html"));
        }
      });
      if (!CKEDITOR.env.ie || CKEDITOR.env.edge)
        b.on("key", function (a) {
          if (
            "wysiwyg" === b.mode &&
            -1 !=
              CKEDITOR.tools.indexOf(
                b.config.autolink_commitKeystrokes,
                a.data.keyCode
              )
          ) {
            var c = CKEDITOR.plugins.textMatch.match(
              b.getSelection().getRanges()[0],
              k
            );
            if (
              c &&
              ((a = b.getSelection()),
              !a.getRanges()[0].startContainer.getAscendant("a", !0) &&
                (a.selectRanges([c.range]),
                b.insertHtml(e(c.text), "text"),
                !CKEDITOR.env.webkit))
            ) {
              var c = a.getRanges()[0],
                d = b.createRange();
              d.setStartAfter(c.startContainer);
              a.selectRanges([d]);
            }
          }
        });
    },
  });
  CKEDITOR.config.autolink_commitKeystrokes = [13, 32];
  CKEDITOR.config.autolink_urlRegex =
    /^(https?|ftp):\/\/(-\.)?([^\s\/?\.#]+\.?)+(\/[^\s]*)?[^\s\.,]$/i;
  CKEDITOR.config.autolink_emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
})();
