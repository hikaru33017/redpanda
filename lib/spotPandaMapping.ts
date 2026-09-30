export type SpotPandaEntry = {
  spawnPointId: string
  pandaId: string
}

// TASK23で統合後のスポットIDに対応。現在飼育中の8頭を12ヶ所に配置
export const SPOT_PANDA_MAPPING: SpotPandaEntry[] = [
  { spawnPointId: 'nishiyama-zoo',          pandaId: 'light'    },
  { spawnPointId: 'panda-land',             pandaId: 'tiara'    },
  { spawnPointId: 'kyoyo-teien',            pandaId: 'matsuba'  },
  { spawnPointId: 'observatory-love-bell',  pandaId: 'akebi'    },
  { spawnPointId: 'big-fountain',           pandaId: 'matsuba'  },
  { spawnPointId: 'musubi-chime',           pandaId: 'mocchi'   },
  { spawnPointId: 'lawn-plaza',             pandaId: 'kanta'    },
  { spawnPointId: 'michinoeki-nishiyama',   pandaId: 'kanoko'   },
  { spawnPointId: 'manabe-hall',            pandaId: 'taiyo'    },
  { spawnPointId: 'inori-no-michi',         pandaId: 'akebi'    },
  { spawnPointId: 'nishiyama-bridge',       pandaId: 'taiyo'    },
  { spawnPointId: 'megane-clock',           pandaId: 'mocchi'   },
]

export function getPandaIdBySpot(spawnPointId: string): string | undefined {
  return SPOT_PANDA_MAPPING.find((e) => e.spawnPointId === spawnPointId)?.pandaId
}

export function getSpotsByPandaId(pandaId: string): string[] {
  return SPOT_PANDA_MAPPING.filter((e) => e.pandaId === pandaId).map((e) => e.spawnPointId)
}
