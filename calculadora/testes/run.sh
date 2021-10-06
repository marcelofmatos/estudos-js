#!/bin/bash

[[ -f .env ]] && . .env

node --trace-warnings --unhandled-rejections=strict app.js
