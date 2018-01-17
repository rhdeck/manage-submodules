#!/usr/bin/env node
const msm = require("../index");
const arg = process.argv[2];
if (arg) {
  if (arg == "all") msm.updateAll();
  else msm.update(arg);
} else {
  console.log('Usage: update <submodulename or "all">');
}
