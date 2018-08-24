#!/bin/bash
npm run tsc
npm run jasmine-node -- dist/server_spec.js --verbose
