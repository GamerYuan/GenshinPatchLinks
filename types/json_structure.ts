export interface JsonStructure {
  retcode: number;
  message: string;
  data: Data;
}

export interface Data {
  game_packages: GamePackage[];
}

export interface GamePackage {
  game: Game;
  main: DownloadInfo;
  pre_download: DownloadInfo;
}

export interface Game {
  id: string;
  biz: string;
}

export interface DownloadInfo {
  major: DownloadStructure;
  patches: DownloadStructure[];
}

export interface DownloadStructure {
  version: string;
  game_pkgs: GamePkg[];
  audio_pkgs: AudioPkg[];
  res_list_url: string;
}

export interface GamePkg {
  url: string;
  md5: string;
  size: string;
  decompressed_size: string;
}

export interface AudioPkg {
  language: string;
  url: string;
  md5: string;
  size: string;
  decompressed_size: string;
}
