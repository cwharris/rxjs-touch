{exec, spawn} = require 'child_process'

build = ->
  exec 'npm install'
  exec 'coffee -c .'

task 'build', 'Build', build
task 'sbuild', 'Build', build