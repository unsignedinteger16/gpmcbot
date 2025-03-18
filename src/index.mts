import { InitMc } from "./mc/index.mjs";
import { InitDc } from "./dc/index.mjs";

InitMc()
let promiseDc = InitDc()

await promiseDc;
