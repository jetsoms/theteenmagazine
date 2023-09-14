CKEDITOR.ClassicEditor.create(document.querySelector("#editor"), {
  ckbox: {
    tokenUrl:
      "https://100142.cke-cs.com/token/dev/to726l0e2ziEvM2HFco41aOAgK8XeKAlbMnt?limit=10",
  },
  heading: {
    options: [
      { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
      {
        model: "heading2",
        view: "h2",
        title: "Heading 2",
        class: "ck-heading_heading2",
      },
      {
        model: "heading3",
        view: "h3",
        title: "Heading 3",
        class: "ck-heading_heading3",
      },
      {
        model: "heading4",
        view: "h4",
        title: "Heading 4",
        class: "ck-heading_heading4",
      },
      {
        model: "heading5",
        view: "h5",
        title: "Heading 5",
        class: "ck-heading_heading5",
      },
      {
        model: "heading6",
        view: "h6",
        title: "Heading 6",
        class: "ck-heading_heading6",
      },
    ],
  },
  placeholder: "",
  toolbar: [
    "heading",
    "|",
    "bold",
    "underline",
    "link",
    "bulletedList",
    "numberedList",
    "alignment",
    "|",
    "blockQuote",
    "ckbox",
    "htmlEmbed",
    "undo",
    "redo",
    "|",
    "selectAll",
    "findAndReplace",
    "removeFormat",
  ],
  htmlSupport: {
    allow: [
      {
        name: /.*/,
        attributes: true,
        classes: true,
        styles: true,
      },
    ],
    disallow: ["span", "br"],
  },
  htmlEmbed: {
    showPreviews: true,
  },
  removePlugins: [
    "ImageToolbar",
    "ImageResize",
    "CKFinder",
    "EasyImage",
    "RestrictedEditingMode",
    "RealTimeCollaborativeComments",
    "RealTimeCollaborativeTrackChanges",
    "RealTimeCollaborativeRevisionHistory",
    "PresenceList",
    "Comments",
    "TrackChanges",
    "TrackChangesData",
    "RevisionHistory",
    "Pagination",
    "WProofreader",
    "MathType",
    "SlashCommand",
    "Template",
    "DocumentOutline",
    "FormatPainter",
    "TableOfContents",
    "PasteFromOfficeEnhanced",
  ],
}).catch((error) => {
  console.error(error);
});
