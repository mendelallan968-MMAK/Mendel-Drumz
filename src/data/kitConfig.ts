import { DrumPadConfig } from '../types';

export const KIT_PADS: DrumPadConfig[] = [
  // Cymbals
  {
    id: 'crash',
    name: 'Crash Cymbal 18"',
    keyLabel: 'C',
    keyCode: 'KeyC',
    category: 'cymbals',
    xPercent: 18,
    yPercent: 18,
    size: 'large',
    color: '#f59e0b'
  },
  {
    id: 'hihatOpen',
    name: 'Open Hi-Hat 14"',
    keyLabel: 'Y',
    keyCode: 'KeyY',
    category: 'cymbals',
    xPercent: 12,
    yPercent: 44,
    size: 'medium',
    color: '#eab308'
  },
  {
    id: 'hihatClosed',
    name: 'Closed Hi-Hat',
    keyLabel: 'H',
    keyCode: 'KeyH',
    category: 'cymbals',
    xPercent: 24,
    yPercent: 46,
    size: 'medium',
    color: '#f59e0b'
  },
  {
    id: 'hihatPedal',
    name: 'Hi-Hat Foot Pedal',
    keyLabel: 'G',
    keyCode: 'KeyG',
    category: 'cymbals',
    xPercent: 20,
    yPercent: 82,
    size: 'small',
    color: '#d97706'
  },
  {
    id: 'rideBell',
    name: 'Ride Bell',
    keyLabel: 'E',
    keyCode: 'KeyE',
    category: 'cymbals',
    xPercent: 78,
    yPercent: 24,
    size: 'small',
    color: '#fbbf24'
  },
  {
    id: 'ride',
    name: 'Ride Cymbal 21"',
    keyLabel: 'R',
    keyCode: 'KeyR',
    category: 'cymbals',
    xPercent: 82,
    yPercent: 38,
    size: 'large',
    color: '#f59e0b'
  },
  // Drums
  {
    id: 'tomHigh',
    name: 'Rack Tom 10"',
    keyLabel: 'J',
    keyCode: 'KeyJ',
    category: 'drums',
    xPercent: 42,
    yPercent: 26,
    size: 'medium',
    color: '#71717a'
  },
  {
    id: 'tomMid',
    name: 'Rack Tom 12"',
    keyLabel: 'K',
    keyCode: 'KeyK',
    category: 'drums',
    xPercent: 58,
    yPercent: 26,
    size: 'medium',
    color: '#71717a'
  },
  {
    id: 'snare',
    name: 'Custom Snare 14"',
    keyLabel: 'S',
    keyCode: 'KeyS',
    category: 'drums',
    xPercent: 38,
    yPercent: 58,
    size: 'large',
    color: '#e4e4e7'
  },
  {
    id: 'snareRim',
    name: 'Snare Rimshot',
    keyLabel: 'D',
    keyCode: 'KeyD',
    category: 'drums',
    xPercent: 30,
    yPercent: 62,
    size: 'small',
    color: '#a1a1aa'
  },
  {
    id: 'crossStick',
    name: 'Cross Stick',
    keyLabel: 'X',
    keyCode: 'KeyX',
    category: 'drums',
    xPercent: 28,
    yPercent: 72,
    size: 'small',
    color: '#a1a1aa'
  },
  {
    id: 'kick',
    name: 'Maple Bass Drum 22"',
    keyLabel: 'SPACE / B',
    keyCode: 'Space',
    category: 'drums',
    xPercent: 50,
    yPercent: 78,
    size: 'huge',
    color: '#f4f4f5'
  },
  {
    id: 'tomFloor',
    name: 'Floor Tom 16"',
    keyLabel: 'L',
    keyCode: 'KeyL',
    category: 'drums',
    xPercent: 70,
    yPercent: 64,
    size: 'large',
    color: '#71717a'
  },
  {
    id: 'cowbell',
    name: 'Studio Cowbell',
    keyLabel: 'V',
    keyCode: 'KeyV',
    category: 'percussion',
    xPercent: 50,
    yPercent: 14,
    size: 'small',
    color: '#fbbf24'
  }
];
