# Changelog

## 1.0.6

* Use hasOwnProperty to check the keyword map

  If a node was named the same as a property of Object, such as "constructor", the external specialization function for keywords would identify it as a keyword and return the Object property instead of a token. This would cause such a node name to incorrectly contain an error diagnostic on viz-js.com.
  
  The specialization function was changed to use Object.hasOwn instead of just looking up a property and testing for null.
  
  Thanks to the PLSE Group at UC Santa Barbara for reporting this issue.

## 1.0.5

* Add @lezer/lr as a dependency

## 1.0.4

* Fix that types condition should be listed first

## 1.0.3

* Include types condition in exports

## 1.0.2

* Add TypeScript declaration file to package

## 1.0.1

* Add TypeScript declaration file

## 1.0.0

* Initial release
