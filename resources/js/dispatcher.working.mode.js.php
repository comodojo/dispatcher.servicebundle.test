<?php

$rw = filter_var($_GET["rw"], FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false';

echo('dispatcher.rewrite = '.$rw.';')

?>