#!/usr/bin/env bash

export NODE_ENV=production

npm run nx build tetris -- --mode=production
