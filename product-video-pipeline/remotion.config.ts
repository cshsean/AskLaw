import { Config } from "@remotion/cli/config";
import path from "node:path";

Config.setPublicDir(path.resolve(process.cwd(), "assets"));
Config.setVideoImageFormat("jpeg");
