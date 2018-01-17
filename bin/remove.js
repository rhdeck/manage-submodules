#!/usr/bin/env node
const msm = require("../index");
const arg = process.argv[2];
if (arg) {
  if (arg == "all") msm.removeAll();
  else msm.remove(arg);
} else {
  console.log('Usage: remove <submodulename or "all">');
}
