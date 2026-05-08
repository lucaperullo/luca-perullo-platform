/**
 * Remotion config — root of the project.
 *
 * The CLI looks for `remotion.config.ts` automatically. Settings here apply
 * to every `remotion render` and `remotion studio` invocation.
 */

import { Config } from "@remotion/cli/config";

// MP4 encode quality — high CRF means we re-encode anyway when ffmpeg pulls
// out WebP frames, so we prioritise speed over file size for the intermediate.
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setEntryPoint("src/remotion/index.ts");
