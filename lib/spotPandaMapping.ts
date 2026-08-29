export type SpotPandaEntry = {
  spawnPointId: string
  pandaId: string
}

export const SPOT_PANDA_MAPPING: SpotPandaEntry[] = [
  { spawnPointId: 'zoo-entrance',      pandaId: 'kirari'   },
  { spawnPointId: 'zoo-panda-house',   pandaId: 'light'    },
  { spawnPointId: 'roadside-station',  pandaId: 'kanoko'   },
  { spawnPointId: 'lawn-plaza-a',      pandaId: 'kaede'    },
  { spawnPointId: 'lawn-plaza-b',      pandaId: 'reifa'    },
  { spawnPointId: 'musubi-hiroba',     pandaId: 'mocchi'   },
  { spawnPointId: 'fountain',          pandaId: 'minfa'    },
  { spawnPointId: 'nishiyama-bridge',  pandaId: 'taiyo'    },
  { spawnPointId: 'upper-garden',      pandaId: 'matsuba'  },
  { spawnPointId: 'north-garden',      pandaId: 'kanta'    },
  { spawnPointId: 'panda-land-a',      pandaId: 'niko'     },
  { spawnPointId: 'panda-land-b',      pandaId: 'mocchi'   },
  { spawnPointId: 'love-bell',         pandaId: 'tiara'    },
  { spawnPointId: 'shodo-an',          pandaId: 'matsuba'  },
]

export function getPandaIdBySpot(spawnPointId: string): string | undefined {
  return SPOT_PANDA_MAPPING.find((e) => e.spawnPointId === spawnPointId)?.pandaId
}

export function getSpotsByPandaId(pandaId: string): string[] {
  return SPOT_PANDA_MAPPING.filter((e) => e.pandaId === pandaId).map((e) => e.spawnPointId)
}
