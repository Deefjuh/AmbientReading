<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
    <head>
	<title>Ambient Reading - Reading 2.0!</title>
    <meta http-equiv=”Content-Type” content=”text/html; charset=utf-8? />
        <link href='http://fonts.googleapis.com/css?family=Lobster' rel='stylesheet' type='text/css'>
        <link type="text/css" rel="stylesheet" href="http://jqueryui.com/themes/base/ui.all.css" />
        <link rel="stylesheet" href="./resources/css/ui/jquery-ui-1.8.4.custom.css" type="text/css" media="all" />
        <link rel="stylesheet" href="./resources/css/basic.css" type="text/css" media="all" />
        <link rel="stylesheet" href="./resources/css/jquery.jgrowl.css" type="text/css" media="all" />

        
        <script type="text/javascript" src="http://jqueryui.com/js/jquery.js"></script>
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
        <script type="text/javascript" src="./resources/js/jquery.jgrowl.js"></script>
        <script type="text/javascript" src="./resources/js/jquery-ui.min.js"></script>
        <script type="text/javascript" src="./resources/js/js-inflate.js"></script>
        <script type="text/javascript" src="./resources/js/js-unzip.js"></script>
        <script type="text/javascript" src="./resources/js/js-epub.js"></script>
        <script type="text/javascript" src="./resources/js/js-renderer.js"></script>


    </head>
    <body>
        <div class="ui-widget-overlay"></div>
        <div  class="topholder" id="top">
            <div id="topheader" class="ui-state-default ui-corner-all">Ambient Reading</div>
            <div id="switcher"></div>
        </div>

        <div class="ui-widget-content" id="content">
            <div>
                <div  class="ui-state-default ui-corner-all" id="drop_zone"><br />Drop EPUB here</div>
                <output id="list"></output>

            </div>
            <div></div>
        </div>
          <script>
          $(document).ready(function(){
            $('#switcher').themeswitcher();
          });
          </script>
        </head>
        <body style="font-size:62.5%;">
          
        <script type="text/javascript"
          src="http://jqueryui.com/themeroller/themeswitchertool/">
        </script>
        <script type="text/javascript" src="./resources/js/basics.js"></script>
    </body>
</html>
