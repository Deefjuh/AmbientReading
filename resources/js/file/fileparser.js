$.fileparser =  {
    m_target : 'drop_zone',
    handleFileSelect : function(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        var files = evt.dataTransfer.files; // FileList object.

        // files is a FileList of File objects. List some properties.
        var output = [];
        for (var i = 0, f; f = files[i]; i++) {
            console.log(f);
            var epubFile = f.getAsBinary();
           var epub = new JSEpub(epubFile);
            epub.processInSteps(function (step, extras) {
    var msg;

    if (step === 1) {
        msg = "Unzipping";
    } else if (step === 2) {
        msg = "Uncompressing " + extras;
    } else if (step === 3) {
        msg = "Reading OPF";
    } else if (step === 4) {
        msg = "Post processing";
    } else if (step === 5) {
        msg = "Finishing";

    }
    console.log(msg);
    // Render the "msg" here.
});

        }
      //  document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
   },

    handleDragOver : function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
    }
}
var dropZone = document.getElementById('drop_zone');
  dropZone.addEventListener('dragover', $.fileparser.handleDragOver, false);
  dropZone.addEventListener('drop', $.fileparser.handleFileSelect, false);
