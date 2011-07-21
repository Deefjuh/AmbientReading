function renderEPUB(epub){
            var epubFile = epub; // Use HTML5 files or download via XHR.
            var epub = new JSEpub(epubFile);

            var showFirstPage = function () {
            // The spine lists all pages in correct order
            var spine = epub.opf.spine[0];

            // The manifest contains the href of the file
            var href = epub.opf.manifest[spine]["href"];

            // All the files are stored in here, indexed by href
            var doc = epub.files[href];

            // The doc is a DOMparser created DOM. You may want to
            // work with a string version of the page contents.
            var html = new XMLSerializer().serializeToString(doc);

            // Use "html" to your hearts content!
            return html;
            }

        // Each time something happens in the processing, the callbakc is called. The
        // step is a number, representing the actual step that was performed. You
        // can use this to render status messages to the user as you process the file.
        // The processor will also insert a tiny delay between each operation, so that
        // you don't get the browser slow script warnings.

            epub.processInSteps(function (step, extras) {
                var msg;

                if (step === 1) {
                    hint("Unzipping");
                } else if (step === 2) {
                    hint("Uncompressing " + extras);
                } else if (step === 3) {
                    hint("Reading OPF");
                } else if (step === 4) {
                    hint("Post processing");
                } else if (step === 5) {
                    msg = "Finishing";
                    showFirstPage();
                }

                // Render the "msg" here.
                });
        }