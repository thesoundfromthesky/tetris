#!/usr/bin/env bash

export NODE_ENV=production
export VITE_BASE_HREF=/

npm run nx preview tetris -- --mode=production
