#!/usr/bin/env node
const msm = require("../index");
const list = msm.list();
console.log(JSON.stringify(list, null, 2));
