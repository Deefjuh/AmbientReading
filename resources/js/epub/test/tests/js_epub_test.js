TestCase("JsEpubTest", {
    setUp: function () {
    },

    tearDown: function () {
    },

    "test integration of processInSteps": function () {
        var e = new JSEpub();
        e.withTimeout = function (cb, n) { cb.call(this, n) }
        e.unzipper = function () {
            return {
                isZipFile: function () { return true },
                readEntries: function () {
                    this.entries = [
                        {
                            fileName: "mimetype",
                            data: "application/epub+zip",
                            compressionMethod: 0
                        },
                        {
                            fileName: "META-INF/container.xml",
                            data: ""
                                + '<?xml version="1.0" encoding="UTF-8"?>'
                                + '<container version="1.0">'
                                + '  <rootfiles>'
                                + '    <rootfile full-path="foo.opf" />'
                                + '  </rootfiles>'
                                + '</container>',
                            compressionMethod: 8
                        },
                        {
                            fileName: "foo.opf",
                            data: ""
                                + '<?xml version="1.0" encoding="UTF-8"?>\n'
                                + '<package>\n'
                                + '  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">\n'
                                + '    <dc:title>My Book</dc:title>\n'
                                + '  </metadata>\n'
                                + '  <manifest>\n'
                                + '    <item id="chap1" href="chap1.html" media-type="application/xhtml+xml"/>\n'
                                + '  </manifest>\n'
                                + '  <spine toc="ncx">\n'
                                + '    <itemref idref="chap1"/>\n'
                                + '  </spine>\n'
                                + '</package>\n',
                            compressionMethod: 8
                        },
                        {
                            fileName: "chap1",
                            data: "<html><head></head></html>",
                            compressionMethod: 8
                        }
                    ]
                }
                
            }
        }

        e.inflate = function (d) { return d };
        // It is tested elsewhere.
        e.postProcess = function () {}

        var actualSteps = [];
        var actualExtras = [];
        var notifier = function (stepId, extras) {
            actualSteps.push(stepId);
            if (extras) {
                actualExtras.push(extras);
            }
        }
        e.processInSteps(notifier);

        assertEquals([1,2,2,2,2,3,4,5], actualSteps);
        assertEquals(["mimetype","META-INF/container.xml","foo.opf","chap1"], actualExtras);
    },

    "test unzipping blob": function () {
	var expectedBlob = "arf";
	var actualBlob;
	var entries = "any object here";

	var e = new JSEpub(expectedBlob);
        e.unzipper = function (blob) {
            actualBlob = blob;
            return {
	        isZipFile: function () { return true },
	        readEntries: function () {},
	        entries: entries
            }
        }

        e.unzipBlob();
	assertEquals(expectedBlob, actualBlob);
	assertEquals(entries, e.compressedFiles);
    },

    "test unzipping blob failing": function () {
        var e = new JSEpub("...");
        e.unzipper = function () {
            return {
                isZipFile: function () { return false }
            }
        }
        
        var calls = [];
        var notifier = function () {
            calls.push(arguments);
        }

        assertFalse(e.unzipBlob(notifier));
        assertEquals([[-1]], calls);
    },

    "test uncompress": function () {
	var e = new JSEpub();
	var timesInflated = 0;

        e.inflate = function (data) {
	    timesInflated++;
            return data + " for real";
        }

	// Mocked JSUnzip output.
	e.entries = [
	    {
		fileName: "mimetype",
		data: "application/epub+zip",
		compressionMethod: 0
	    },
	    {
		fileName: "META-INF/container.xml", 
		data: "",
		compressionMethod: 8
	    },
	    {
		fileName: "anything.nxc",
		data: "",
		compressionMethod: 8
	    },
	    {
		fileName: "content/a_page.html",
		data: "",
		compressionMethod: 8
	    },
            {
                fileName: "content/b_page.html",
                data: "here I am",
                compressionMethod: 0
            },
            {
                fileName: "content/c_page.html",
                data: "compressed",
                compressionMethod: 8
            }
	]

	e.uncompressFiles();

	assertEquals(4, timesInflated);
	assertEquals("application/epub+zip", e.mimetype);
        assertEquals(e.files["content/b_page.html"], "here I am");
        assertEquals(e.files["content/c_page.html"], "compressed for real");
    },

    "test invalid compression method": function () {
    },

    "test valitate": function () {
    },

    "test reading container": function () {
        var xml = ""
            + '<?xml version="1.0" encoding="UTF-8"?>\n'
            + '<container version="1.0">\n'
            + '  <rootfiles>\n'
            + '    <rootfile full-path="foo.opf" />\n'
            + '  </rootfiles>\n'
            + '</container>\n';
        var e = new JSEpub();
        e.container = xml;
        assertEquals("foo.opf", e.getOpfPathFromContainer());
    },

    "test reading  opf": function () {
        var xml = ""
            + '<?xml version="1.0" encoding="UTF-8"?>\n'
            + '<package>\n'
            + '  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">\n'
            + '    <dc:language>en</dc:language>\n'
            + '    <dc:title>My Book</dc:title>\n'
            + '    <dc:creator opf:role="aut">Santa Claus</dc:creator>\n'
            + '    <dc:creator opf:role="aut">Rudolf</dc:creator>\n'
            + '    <dc:publisher>North Pole</dc:publisher>\n'
            + '    <dc:identifier opf:scheme="ISBN">1-123456-78-9</dc:identifier>\n'
            + '  </metadata>\n'
            + '  <manifest>\n'
            + '    <item id="book-css" href="css/book.css" media-type="text/css"/>\n'
            + '    <item id="chap1" href="chap1.html" media-type="application/xhtml+xml"/>\n'
            + '    <item id="chap2" href="chap2.html" media-type="application/xhtml+xml"/>\n'
            + '    <item id="nxc" href="toc.ncx" media-type="application/x-dtbncx+xml"/>\n'
            + '  </manifest>\n'
            + '  <spine toc="ncx">\n'
            + '    <itemref idref="chap1"/>\n'
            + '    <itemref idref="chap2"/>\n'
            + '  </spine>\n'
            + '</package>\n';
        var e = new JSEpub();
        e.opfPath = "content.opf";
        e.readOpf(xml);
        assertEquals(e.opf.metadata["dc:language"]._text, "en");
        assertEquals(e.opf.metadata["dc:creator"]["opf:role"], "aut");
        assertEquals(e.opf.metadata["dc:identifier"]["opf:scheme"], "ISBN");
        assertEquals(e.opf.metadata["dc:identifier"]._text, "1-123456-78-9");
        assertEquals(e.opf.manifest["book-css"]["href"], "css/book.css");
        assertEquals(e.opf.manifest["book-css"]["media-type"], "text/css");
        assertEquals(e.opf.manifest["chap1"]["href"], "chap1.html");
        assertEquals(e.opf.spine, ["chap1", "chap2"]);
    },

    "test opf paths are relative to opf location": function () {
        var xml = ""
            + '<?xml version="1.0" encoding="UTF-8"?>\n'
            + '<package>\n'
            + '  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">\n'
            + '    <dc:title>My Book</dc:title>\n'
            + '  </metadata>\n'
            + '  <manifest>\n'
            + '    <item id="chap1" href="chap1.html" media-type="application/xhtml+xml"/>\n'
            + '    <item id="chap2" href="chap2.html" media-type="application/xhtml+xml"/>\n'
            + '  </manifest>\n'
            + '  <spine toc="ncx">\n'
            + '    <itemref idref="chap1"/>\n'
            + '    <itemref idref="chap2"/>\n'
            + '  </spine>\n'
            + '</package>\n';
        var e = new JSEpub();
        e.opfPath = "OPS/ind.opf";
        e.readOpf(xml);
        assertEquals(e.opf.manifest["chap1"]["href"], "OPS/chap1.html");
    },

    "test resolve path": function () {
        var e = new JSEpub();
        assertEquals("images/foo.jpg", e.resolvePath("../images/foo.jpg", "css/test.css"));
        assertEquals("images/foo.jpg", e.resolvePath("../../images/foo.jpg", "css/stuff/test.css"));
        assertEquals("images/foo.jpg", e.resolvePath("../css/../images/foo.jpg", "css/test.css"));
        assertEquals("foo.jpg", e.resolvePath("../foo.jpg", "css/foo.css"));
        assertEquals("css/foo.css", e.resolvePath("foo.css", "css/foo.css"));
    },

    "test find media type by href": function () {
        var e = new JSEpub();
        e.opf = {
            manifest: {
                "foo": {"href": "this", "media-type": "that"},
                "bar": {"href": "the moon", "media-type": "application/cheese"},
                "baz": {"href": "zap", "media-type": "zup"}
            }
        };

        assertEquals("that", e.findMediaTypeByHref("this"));
        assertEquals("application/cheese", e.findMediaTypeByHref("the moon"));
        assertEquals(undefined, e.findMediaTypeByHref("waffles"));
    },

    "test making data URIs in CSS files": function () {
        var e = new JSEpub();
        e.opf = {
            manifest: {
                "book-css": {"href": "css/book.css", "media-type": "text/css"},
                "h1-underline": {"href": "images/h1-underline.gif", "media-type": "image/gif"},
                "foo": {"href": "foo.jpg", "media-type": "image/jpg"}
            }
        }
        e.files = {
            "css/book.css": ""
                + "h1 {\n"
                + "  background: url(../images/h1-underline.gif) repeat-x bottom;\n"
                + "  background: url(data:donottouch);\n"
                + "  background: url(../foo.jpg);\n"
                + "  background: url(../notinmanifest.png);\n"
                + "}",
            "images/h1-underline.gif": "foo, bar! Bits & bytes.",
            "foo.jpg": "a // jpg // image)",
            "notinmanifest.png": "they do that from time to time..."
        }

        var expected = ""
            + "h1 {\n"
            + "  background: url(data:image/gif,foo%2C%20bar%21%20Bits%20%26%20bytes.) repeat-x bottom;\n"
            + "  background: url(data:donottouch);\n"
            + "  background: url(data:image/jpg,a%20//%20jpg%20//%20image%29);\n"
            + "  background: url(data:image/png,they%20do%20that%20from%20time%20to%20time...);\n"
            + "}"
        e.postProcess();
        assertEquals(expected, e.files["css/book.css"]);
    },

    "test making data URIs in HTML files": function () {
        var e = new JSEpub();
        e.opf = {
            manifest: {
                "chap1": {"href": "contents/chap1.html", "media-type": "application/xhtml+xml"},
                "imga": {"href": "contents/resources/foo.png", "media-type": "anything/really"},
                "imgb": {"href": "contents/resources/test.jpg", "media-type": "img/jpg"}
            }
        };
        e.files = {
            "contents/chap1.html": ""
                + '<html><head>\n'
                + '<link rel="stylesheet" type="text/css" href="../css/book.css"></link>'
                + '<link rel="stylesheet" type="zombie/woof" href="thing.xpgt"></link>'
                + '</head><body>\n'
                + '  <p>Foodi boody.</p>\n'
                + '  <img alt=""\n'
                + 'src="resources/test.jpg"\n'
                + 'title="foo" />\n'
                + '  <img src="resources/foo.png" />\n'
                + '  <p>Text is so boring. More images please!</p>\n'
                + '  <img alt="" src="data:image/png,bitsandbytes" />\n' 
                + '</body></html>',
            "contents/resources/foo.png": "I <am> a <img /> image that tries to break escapes%%\\",
            "contents/resources/test.jpg": "hello",
            "css/book.css": "body { background: red; }"
        };

        e.postProcess();
        var doc = e.files["contents/chap1.html"];

        assertEquals(doc.getElementsByTagName("link").length, 1);

        var style = doc.getElementsByTagName("style")[0];
        assertEquals(style.textContent, "body { background: red; }");

        var imgs = doc.getElementsByTagName("img");
        assertEquals("data:img/jpg,hello", imgs[0].getAttribute("src"));
        assertEquals("data:anything/really,I%20%3Cam%3E%20a%20%3Cimg%20/%3E%20image%20that%20tries%20to%20break%20escapes%25%25%5C", imgs[1].getAttribute("src"));
        assertEquals("data:image/png,bitsandbytes", imgs[2].getAttribute("src"));
    }
});