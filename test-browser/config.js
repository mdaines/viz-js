// Set autostart to true if we don't see "noautostart" in the query string.
QUnit.config.autostart = /noautostart/.test(window.location.search) == false;
