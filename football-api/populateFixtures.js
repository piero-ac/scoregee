// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import mongoose from 'mongoose';
import { Standing } from '../models/standing.js';
const axios = require("axios");
import { config } from "./config.js";

main()
.then(() => {
    console.log("MONGO CONNECTION OPENED");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/scoregee');
}