#!/usr/bin/python

import os

path = os.path.expanduser('~/.emscripten')
with open(path, 'r') as f:
  contents = f.read()
  exec(contents)

print EMSCRIPTEN_ROOT
