import { Box } from '@syncedstore/core';
import { sortBy } from 'lodash';
import { ApparatusKey, BarCategory, Competition as OriginalCompetition, Screen, ScreenBar, ScreenProgress, Stage, TimelinePause, TimelineRotation } from '@tgym.fr/core';
import { MappedTypeDescription } from '@syncedstore/core/types/doc';

export type Competition = Omit<OriginalCompetition, 'screens'> & {
  screens: Record<string, Box<Screen>>;
};

export function getApparatusName(apparatusKey: ApparatusKey): string {
  switch (apparatusKey) {
    case 'vault':
      return 'Saut';
    case 'unevenBars':
      return 'Barres asymétriques';
    case 'beam':
      return 'Poutre';
    case 'floor':
      return 'Sol';
    case 'highBar':
      return 'Barre fixe';
    case 'parallelBars':
      return 'Barres parallèles';
    case 'rings':
      return 'Anneaux';
    case 'pommelHorse':
      return "Cheval d'arçon";
    case 'rest':
      return "Repos";
  }
}

export function getApparatusIconPath(apparatusKey: ApparatusKey): string {
  switch (apparatusKey) {
    case 'vault':
      return '/icons/apparatuses/vault.png';
    case 'unevenBars':
      return '/icons/apparatuses/unevenBars.png';
    case 'beam':
      return '/icons/apparatuses/beam.png';
    case 'floor':
      return '/icons/apparatuses/floor.png';
    case 'highBar':
      return '/icons/apparatuses/highBar.png';
    case 'parallelBars':
      return '/icons/apparatuses/parallelBars.png';
    case 'rings':
      return '/icons/apparatuses/rings.png';
    case 'pommelHorse':
      return '/icons/apparatuses/pommelHorse.png';
    case 'rest':
      return '/icons/apparatuses/rest.png';
  }
}

export function isApparatusOptional(apparatusKey: ApparatusKey): boolean {
  switch (apparatusKey) {
    case 'vault':
    case 'unevenBars':
    case 'beam':
    case 'floor':
    case 'highBar':
    case 'parallelBars':
    case 'rings':
    case 'pommelHorse':
      return false;
    case 'rest':
      return true;
  }
}

export function getStageApparatuses(stage: Stage): ApparatusKey[] {
  return sortBy(Object.entries(stage.apparatuses), [
    ([apparatusKey, apparatusOrder]) => apparatusOrder,
  ])
    .map(([apparatusKey, apparatusOrder]) => apparatusKey as ApparatusKey)
    .filter((apparatusKey) => !isApparatusOptional(apparatusKey));
}

export function getRotationApparatuses(stage: Stage, rotation: TimelineRotation): ApparatusKey[] {
  const rotationApparatuses = getStageApparatuses(stage);

  if ('rest' in rotation.apparatuses) {
    rotationApparatuses.push('rest');
  }

  return rotationApparatuses;
}

export function stageRotations(
  stage: Stage
): (TimelineRotation | TimelinePause)[] {
  return sortBy(Object.values(stage.timeline), (rotation) => rotation.order);
}

export function getScreenName(screenType: Screen['type']): string {
  switch (screenType) {
    case 'bar':
      return 'Buvette';
    case 'progress':
      return 'Progression';
  }
}

export function getDefaultScreen(
  screenType: Screen['type']
): ScreenBar | ScreenProgress {
  switch (screenType) {
    case 'bar':
      return {
        name: '',
        shortUrlId: undefined,
        type: 'bar',
      };
    case 'progress':
      return {
        name: '',
        shortUrlId: undefined,
        type: 'progress',
        stageKey: '',
      };
  }
}

export const barDefault: Record<string, BarCategory> = {
  'a208a01a-71d0-43a7-92ca-6e95590e280d': {
    name: 'Boissons',
    order: 0,
    items: {
      '98e2cf28-6e18-4552-a688-aa79a46417bc': {
        name: 'Bière',
        price: 2.5,
        order: 0,
      },
      'e087ec2a-66bd-4ff8-8047-27a54c8fa5c5': {
        name: 'Jus de pommes',
        price: 1.5,
        order: 1,
      },
      'c34ba6de-164a-444f-aacf-c69dde2c2966': {
        name: 'Soda (Fanta,Coca,Ice Tea,Oasis)',
        price: 1.5,
        order: 2,
      },
      '87bfc404-1cb3-438b-8c64-cff4c38277b1': {
        name: 'Eau',
        price: 0.5,
        order: 3,
      },
      'e1b2f257-412b-4d72-84c1-f15b4b74de88': {
        name: 'Café, Thé',
        price: 1.0,
        order: 4,
      },
    },
  },
  'f2a2183b-d3b3-427b-84d5-3d67465bc4d4': {
    name: 'Plats',
    order: 1,
    items: {
      '20a85e1a-1659-4332-9fab-3a4e9a0677b5': {
        name: 'Hot-Dog',
        price: 3.0,
        order: 0,
      },
      '4ffcee0a-5b1c-40c9-99b6-c198bff2692f': {
        name: 'Frites',
        price: 3.0,
        order: 1,
      },
      '1d929f8d-a6b2-4078-ad24-22763b91bf41': {
        name: 'Saucisse+Frites',
        price: 5.0,
        order: 2,
      },
      'd676dd28-049a-42f8-8a98-863dbc161059': {
        name: 'Sandwich (Fromage Brie)',
        price: 3.0,
        order: 3,
      },
    },
  },
  '36027b7e-304a-440e-aa4a-519538657a3c': {
    name: 'Dessert',
    order: 2,
    items: {
      '7c605d2f-f790-400c-8449-496860c3a8e9': {
        name: 'Pomme',
        price: 0.5,
        order: 0,
      },
      'c2ed0332-0d54-4090-9ea4-588c78651481': {
        name: 'Sucette',
        price: 0.5,
        order: 1,
      },
      'e9456e70-06a3-4838-92bf-8a83bdcea030': {
        name: 'Barre Kinder Country',
        price: 1.0,
        order: 2,
      },
      '53a31174-1f33-4efd-9f3d-53bc09175c6d': {
        name: 'Crêpe (Sucre)',
        price: 2.0,
        order: 3,
      },
      '638b8d88-682b-4b5e-9d0a-ca31ae9811cb': {
        name: 'Crêpe (Nutella)',
        price: 2.5,
        order: 4,
      },
    },
  },
};

export const defaultCompetition: OriginalCompetition = {
  players: {},
  teams: {},
  progresses: {},
  bar: {},
  categories: {},
  info: {},
  screens: {},
  stages: {},
};

export type Store = MappedTypeDescription<{
  competition: Competition;
}>;
