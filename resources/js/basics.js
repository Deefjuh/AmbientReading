	if (window.File && window.FileReader && window.FileList && window.Blob) {
  // Great success! All the File APIs are supported.
} else {

}
    
    $(function() {
		$("button").button();
		
		$("a", ".demo").click(function() { return false; });
	});

  function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files;// FileList object

        //DS: alleen de eerste
       f = files[0];  

          // Only process epub files.

          if (!f.type.match('.*epub.*')) {
            warninghint('Please use an EPUB file.');
            return;
          }

          var reader = new FileReader();

          // Closure to capture the file information.
          reader.onload = (function(theFile) {
            return function(e) {
              // Render thumbnail.

             $('#content').html(renderEPUB(e.target.result));
                           
            };
          })(f);

          // Read the EPUB
          reader.readAsBinaryString(f);
    }

  

  function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
  }

  // Setup the dnd listeners.
  var dropZone = document.getElementById('drop_zone');
  dropZone.addEventListener('dragover', handleDragOver, false);
  dropZone.addEventListener('drop', handleFileSelect, false);


function errorhint(msg){
$.jGrowl(msg, { header: 'ERROR:' });
}

function warninghint(msg){
$.jGrowl(msg, { header: 'Warning:' });
}

function hint(msg){
$.jGrowl(msg);
}
//$.jGrowl("Stick this!", { sticky: true });
// Sample 3
//$.jGrowl("A message with a header", { header: 'Important' });
