import { filesize } from "filesize";
import { DownloadStructure, JsonStructure } from "./types/json_structure";

const JsonAPI =
  "https://sg-hyp-api.hoyoverse.com/hyp/hyp-connect/api/getGamePackages?game_ids[]=gopR6Cufr3&launcher_id=VYTpXlbWo8";

async function main(args: string[]) {
  const userAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3";

  const response = await fetch(JsonAPI, {
    headers: { "User-Agent": userAgent },
  });

  if (!response.ok) {
    console.error("Failed to fetch JSON data!");
  } else {
    if (args.length < 1 || args[0] === "/getAll") {
      const jsonObj = await response.json();
      await getRelease(jsonObj);
      await getPreDl(jsonObj);
    } else if (args[0] === "/getPreDl") {
      await getPreDl(await response.json());
    } else if (args[0] === "/getRelease") {
      await getRelease(await response.json());
    } else {
      console.log("Invalid argument!");
    }
  }
}

async function getPreDl(jsonObj: JsonStructure) {
  try {
    if (jsonObj.data?.game_packages?.[0]?.pre_download) {
      const preDl = jsonObj.data.game_packages[0].pre_download;
      if (preDl.patches) {
        const preDlDiffs: Promise<string>[] = [
          getDownloadInfo(preDl.major, preDl.major.version),
        ];
        for (const diff of preDl.patches) {
          preDlDiffs.push(getDownloadInfo(diff, preDl.major.version));
        }
        const preDlStr = await Promise.all(preDlDiffs);
        console.log(preDlStr.join("").trimEnd());
      }
    } else {
      console.log("No Pre-Download Version found!");
    }
  } catch (e) {
    console.error(`An error occurred: ${e}`);
  }
}

async function getRelease(jsonObj: JsonStructure) {
  try {
    if (jsonObj.data?.game_packages?.[0]?.main) {
      const dlDiffs: Promise<string>[] = [
        getDownloadInfo(
          jsonObj.data.game_packages[0].main.major,
          jsonObj.data.game_packages[0].main.major.version
        ),
      ];

      for (const diff of jsonObj.data.game_packages[0].main.patches) {
        dlDiffs.push(
          getDownloadInfo(
            diff,
            jsonObj.data.game_packages[0].main.major.version
          )
        );
      }
      const dlStr = await Promise.all(dlDiffs);
      console.log(dlStr.join("").trimEnd());
    } else {
      console.log("No Release Version found!");
    }
  } catch (e) {
    console.error(`An error occurred: ${e}`);
  }
}

async function getDownloadInfo(dlData: DownloadStructure, useVer: string) {
  let ret = "";
  const lastVer = dlData.version;

  const pkgs = dlData.game_pkgs;

  if (lastVer === useVer) {
    ret += `Ver ${useVer} (Full):\nGame: `;
  } else {
    ret += `Ver ${useVer} (From ${lastVer}):\nGame Patch: `;
  }

  const appendSeg = pkgs.length > 1;
  if (appendSeg) ret += "\n";

  for (let i = 0; i < pkgs.length; i++) {
    if (appendSeg) {
      ret += "\tSegment " + (i + 1) + ": ";
    }
    ret += `${pkgs[i].url} (${filesize(Number(pkgs[i].size), {
      base: 2,
    })}, md5: ${pkgs[i].md5.toUpperCase()})\n`;
  }

  for (const voicePack of dlData.audio_pkgs) {
    switch (voicePack.language) {
      case "zh-cn":
        ret += "CN_VO: ";
        break;
      case "en-us":
        ret += "EN_VO: ";
        break;
      case "ja-jp":
        ret += "JP_VO: ";
        break;
      case "ko-kr":
        ret += "KR_VO: ";
        break;
    }
    ret += `${voicePack.url} (${filesize(Number(voicePack.size), {
      base: 2,
    })}, md5: ${voicePack.md5.toUpperCase()})\n`;
  }
  return ret;
}

var args = process.argv.slice(2);
main(args);
