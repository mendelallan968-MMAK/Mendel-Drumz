import { Lesson } from '../types';

export const LESSONS_DATA: Lesson[] = [
  {
    id: 'lesson-1-1',
    title: 'Kit Anatomy, Ergonomics & Grip',
    module: 'Foundations & The Pocket',
    moduleIndex: 1,
    level: 'Beginner',
    duration: '12 min',
    tempoTarget: 60,
    summary: 'Master your throne height, pedal angles, and balanced American/German matched grip before striking your first note.',
    keyTakeaway: 'Relaxed shoulders and proper fulcrum between thumb and index finger unlock 80% of your future speed.',
    stickingPattern: 'R L R L  R L R L',
    subdivisionCountText: '1 & 2 & 3 & 4 &',
    patternSteps: [
      { step: 0, drum: 'hihatClosed' },
      { step: 2, drum: 'hihatClosed' },
      { step: 4, drum: 'hihatClosed' },
      { step: 6, drum: 'hihatClosed' },
      { step: 8, drum: 'hihatClosed' },
      { step: 10, drum: 'hihatClosed' },
      { step: 12, drum: 'hihatClosed' },
      { step: 14, drum: 'hihatClosed' },
      { step: 0, drum: 'kick' },
      { step: 8, drum: 'kick' },
      { step: 4, drum: 'snare' },
      { step: 12, drum: 'snare' },
    ],
    stepsBreakdown: [
      {
        title: 'Throne Setup & Hip Angle',
        description: 'Position your drum stool so your thighs angle slightly downward (roughly 100° to 105° at the knee). This relieves hip flexor strain.'
      },
      {
        title: 'The Fulcrum (Stick Balance Point)',
        description: 'Pinch the stick roughly one-third of the way up between the pad of your thumb and first knuckle of your index finger. Test rebound freely.'
      },
      {
        title: 'Pedal Ergonomics',
        description: 'Keep your heel resting gently on the base plate or hover lightly for heel-up power. Never lock your calf muscles.'
      }
    ],
    commonMistakes: [
      'Sitting too low (restricting hip mobility and pedal speed)',
      'Death-gripping the stick with all five fingers tightly squeezed',
      'Flaring elbows out like wings instead of resting naturally by your sides'
    ],
    proTip: 'Drop the stick onto the snare head and let it bounce naturally 5-6 times without your fingers stopping it. That natural rebound is free energy!',
    practiceGoals: [
      'Set up throne height and verify knee angle in mirror',
      'Test 20 relaxed rebound bounces in each hand',
      'Play relaxed alternating single strokes on pad for 3 minutes'
    ]
  },
  {
    id: 'lesson-1-2',
    title: 'The Money Beat (Essential 8th-Note Rock Groove)',
    module: 'Foundations & The Pocket',
    moduleIndex: 1,
    level: 'Beginner',
    duration: '15 min',
    tempoTarget: 80,
    summary: 'The backbone of modern drumming: steady 8th-note hi-hat pulse, punchy backbeat on 2 & 4, and grounded kicks on 1 & 3.',
    keyTakeaway: 'Keep the hi-hat velocity smooth and consistent so the snare backbeat punches cleanly through.',
    stickingPattern: 'Right Hand: Hi-Hat / Left Hand: Snare / Right Foot: Kick',
    subdivisionCountText: '1 & 2 & 3 & 4 &',
    patternSteps: [
      { step: 0, drum: 'hihatClosed' },
      { step: 2, drum: 'hihatClosed' },
      { step: 4, drum: 'hihatClosed' },
      { step: 6, drum: 'hihatClosed' },
      { step: 8, drum: 'hihatClosed' },
      { step: 10, drum: 'hihatClosed' },
      { step: 12, drum: 'hihatClosed' },
      { step: 14, drum: 'hihatClosed' },
      { step: 0, drum: 'kick', accent: true },
      { step: 4, drum: 'snare', accent: true },
      { step: 8, drum: 'kick', accent: true },
      { step: 12, drum: 'snare', accent: true },
    ],
    stepsBreakdown: [
      {
        title: 'Step 1: The Hi-Hat Engine',
        description: 'Play steady 8th notes on the closed hi-hat with your right stick: "1 & 2 & 3 & 4 &". Keep the stick tip centered.'
      },
      {
        title: 'Step 2: Add the Kick Anchor',
        description: 'Drop the bass drum on beats 1 and 3 exactly unison with the hi-hat notes. Feel the bottom end lock.'
      },
      {
        title: 'Step 3: Drop the Snare Backbeat',
        description: 'Strike the snare center firmly on beats 2 and 4. Aim for identical strike velocity on every backbeat.'
      }
    ],
    commonMistakes: [
      'Flamming: Right hand and foot hitting at slightly different milliseconds instead of dead unison',
      'Speeding up during the snare backbeats',
      'Letting the hi-hat ring open by not keeping firm pedal pressure'
    ],
    proTip: 'Record yourself playing this groove for 2 minutes without stopping. Listen back: does the tempo sway or stay solid like a clock?',
    practiceGoals: [
      'Play 16 continuous bars at 70 BPM without rushing',
      'Increase tempo cleanly to 85 BPM',
      'Focus on zero flam between kick and hi-hat on beat 1'
    ]
  },
  {
    id: 'lesson-1-3',
    title: 'Syncopated Kick Drum Variations',
    module: 'Foundations & The Pocket',
    moduleIndex: 1,
    level: 'Beginner',
    duration: '18 min',
    tempoTarget: 85,
    summary: 'Elevate your rock groove by adding the legendary "and-of-two" kick drum that propels classic funk and indie rock tracks.',
    keyTakeaway: 'Off-beat kick notes require limb independence between right hand (constant 8ths) and right foot (syncopated).',
    stickingPattern: 'Kick on 1, & of 2, 3',
    subdivisionCountText: '1 & 2 [&] 3 & 4 &',
    patternSteps: [
      { step: 0, drum: 'hihatClosed' },
      { step: 2, drum: 'hihatClosed' },
      { step: 4, drum: 'hihatClosed' },
      { step: 6, drum: 'hihatClosed' },
      { step: 8, drum: 'hihatClosed' },
      { step: 10, drum: 'hihatClosed' },
      { step: 12, drum: 'hihatClosed' },
      { step: 14, drum: 'hihatClosed' },
      { step: 0, drum: 'kick', accent: true },
      { step: 4, drum: 'snare', accent: true },
      { step: 6, drum: 'kick', accent: false },
      { step: 8, drum: 'kick', accent: true },
      { step: 12, drum: 'snare', accent: true },
    ],
    stepsBreakdown: [
      {
        title: 'Step 1: Isolate the Kick Foot',
        description: 'Count aloud: "1 & 2 & 3 & 4 &". Stomp your foot on 1, the "&" after 2, and 3.'
      },
      {
        title: 'Step 2: Layer Hands Slowly',
        description: 'Drop your snare hand onto 2 and 4. Notice how the snare on 2 is immediately answered by the kick on the "&".'
      },
      {
        title: 'Step 3: Seamless Integration',
        description: 'Bring the tempo down to 60 BPM until the kick-snare conversation feels effortless and rhythmic.'
      }
    ],
    commonMistakes: [
      'Delaying the kick after 2 so it turns into beat 3 prematurely',
      'Letting the hi-hat drop out when the extra kick strikes'
    ],
    proTip: 'Sing the phrase: "BOOM - CHACK - BOOM BOOM - CHACK". If you can vocalize it in time, your limbs can play it!',
    practiceGoals: [
      'Execute the syncopated kick at 65 BPM with count-in',
      'Smoothly loop 8 bars into 8 bars of standard money beat',
      'Reach target speed of 85 BPM'
    ]
  },
  {
    id: 'lesson-1-4',
    title: 'First Drum Fills: Moving Around the Toms',
    module: 'Foundations & The Pocket',
    moduleIndex: 1,
    level: 'Beginner',
    duration: '16 min',
    tempoTarget: 75,
    summary: 'Learn clean 16th-note fills moving from Snare to High Tom, Mid Tom, and Floor Tom, finishing on a unified Crash + Kick on beat 1.',
    keyTakeaway: 'A great drummer lands back on beat 1 with authority. Never sacrifice time for flashy stick speed.',
    stickingPattern: 'Snare (4) -> High Tom (4) -> Mid Tom (4) -> Floor Tom (4) -> CRASH',
    subdivisionCountText: '1 e & a 2 e & a 3 e & a 4 e & a',
    patternSteps: [
      { step: 0, drum: 'snare' },
      { step: 1, drum: 'snare' },
      { step: 2, drum: 'snare' },
      { step: 3, drum: 'snare' },
      { step: 4, drum: 'tomHigh' },
      { step: 5, drum: 'tomHigh' },
      { step: 6, drum: 'tomHigh' },
      { step: 7, drum: 'tomHigh' },
      { step: 8, drum: 'tomMid' },
      { step: 9, drum: 'tomMid' },
      { step: 10, drum: 'tomMid' },
      { step: 11, drum: 'tomMid' },
      { step: 12, drum: 'tomFloor' },
      { step: 13, drum: 'tomFloor' },
      { step: 14, drum: 'tomFloor' },
      { step: 15, drum: 'tomFloor' },
    ],
    stepsBreakdown: [
      {
        title: 'Step 1: Sticking Symmetry',
        description: 'Alternate strictly R-L-R-L. 4 strokes on Snare, 4 strokes on High Tom, 4 on Mid Tom, 4 on Floor Tom.'
      },
      {
        title: 'Step 2: Body Pivot',
        description: 'Pivot at your waist smoothly rather than stretching arms awkwardly. Keep posture upright.'
      },
      {
        title: 'Step 3: The Resolution (Crash + Kick)',
        description: 'On beat 1 of the next measure, strike Crash Cymbal and Kick Drum simultaneously, then resume groove.'
      }
    ],
    commonMistakes: [
      'Hitting the rim accidentally while moving between toms',
      'Dragging the tempo during the floor tom',
      'Forgetting the bass drum punch when striking the crash cymbal'
    ],
    proTip: 'Think of the crash cymbal like an exclamation mark: it needs the kick drum underneath to provide weight.',
    practiceGoals: [
      'Practice 3 bars of 4/4 groove + 1 bar tom fill',
      'Land clean on the crash with zero hesitation on beat 1',
      'Play smoothly at 75 BPM'
    ]
  },
  {
    id: 'lesson-2-1',
    title: 'Single Paradiddle Groove Application',
    module: 'Rudiments & Hand Technique',
    moduleIndex: 2,
    level: 'Intermediate',
    duration: '20 min',
    tempoTarget: 95,
    summary: 'Transform the rudiment RLRR LRLL from a practice pad exercise into an expressive funk-rock groove on the kit.',
    keyTakeaway: 'Accenting the first note of each paradiddle and ghosting the rest creates natural organic groove dynamics.',
    stickingPattern: 'R L R R  L R L L',
    subdivisionCountText: '1 e & a 2 e & a 3 e & a 4 e & a',
    patternSteps: [
      { step: 0, drum: 'hihatClosed', accent: true },
      { step: 0, drum: 'kick', accent: true },
      { step: 1, drum: 'snare', accent: false },
      { step: 2, drum: 'hihatClosed', accent: false },
      { step: 3, drum: 'hihatClosed', accent: false },
      { step: 4, drum: 'snare', accent: true },
      { step: 5, drum: 'hihatClosed', accent: false },
      { step: 6, drum: 'snare', accent: false },
      { step: 7, drum: 'snare', accent: false },
      { step: 8, drum: 'hihatClosed', accent: true },
      { step: 8, drum: 'kick', accent: true },
      { step: 9, drum: 'snare', accent: false },
      { step: 10, drum: 'hihatClosed', accent: false },
      { step: 11, drum: 'hihatClosed', accent: false },
      { step: 12, drum: 'snare', accent: true },
      { step: 13, drum: 'hihatClosed', accent: false },
      { step: 14, drum: 'snare', accent: false },
      { step: 15, drum: 'snare', accent: false },
    ],
    stepsBreakdown: [
      {
        title: 'Step 1: Pad Practice First',
        description: 'Lock in R L R R  L R L L with exaggerated accents on 1 and 2 (downstrokes) and whispers on taps (upstrokes).'
      },
      {
        title: 'Step 2: Right Hand to Hi-Hat, Left Hand to Snare',
        description: 'Keep your right hand on hi-hat and left hand on snare drum. The doubles naturally weave the groove.'
      },
      {
        title: 'Step 3: Accent the Backbeat on Snare',
        description: 'When the left hand hits beat 2 and 4, deliver a full backbeat while ghosting the diddles.'
      }
    ],
    commonMistakes: [
      'Playing all notes at equal volume (destroys the groove pocket)',
      'Accidentally playing double stroke rolls instead of paradiddles'
    ],
    proTip: 'Control height: accented hits start 12 inches high, while ghosted diddles start only 1-2 inches above the drum head.',
    practiceGoals: [
      'Master RLRR LRLL stickings at 80 BPM on pad',
      'Transfer to kit and play 2 minutes without dropping stickings',
      'Push tempo to 95 BPM'
    ]
  },
  {
    id: 'lesson-2-2',
    title: 'Ghost Notes & Funk Dynamics',
    module: 'Rudiments & Hand Technique',
    moduleIndex: 2,
    level: 'Intermediate',
    duration: '22 min',
    tempoTarget: 90,
    summary: 'Unlock the secret sauce of Bernard Purdie, David Garibaldi, and Chad Smith: feather-light ghost notes between backbeats.',
    keyTakeaway: 'Ghost notes should be felt rather than heard loud. Keep your snare stick mere millimeters off the mesh.',
    stickingPattern: 'Kick on 1 & 3, Accents on 2 & 4, Ghosted snare 16ths',
    subdivisionCountText: '1 e & [a] 2 [e] & a 3 e & a 4 [e] & a',
    patternSteps: [
      { step: 0, drum: 'hihatClosed' },
      { step: 0, drum: 'kick', accent: true },
      { step: 2, drum: 'hihatClosed' },
      { step: 3, drum: 'snare', accent: false },
      { step: 4, drum: 'hihatClosed' },
      { step: 4, drum: 'snare', accent: true },
      { step: 5, drum: 'snare', accent: false },
      { step: 6, drum: 'hihatClosed' },
      { step: 8, drum: 'hihatClosed' },
      { step: 8, drum: 'kick', accent: true },
      { step: 10, drum: 'hihatClosed' },
      { step: 10, drum: 'kick', accent: false },
      { step: 12, drum: 'hihatClosed' },
      { step: 12, drum: 'snare', accent: true },
      { step: 13, drum: 'snare', accent: false },
      { step: 14, drum: 'hihatClosed' },
    ],
    stepsBreakdown: [
      {
        title: 'Step 1: The Tap Stroke',
        description: 'Drop your left wrist with zero wrist snap. The stick falls under gravity to produce a quiet "tic".'
      },
      {
        title: 'Step 2: Contrast Against the Accent',
        description: 'The backbeat on 2 and 4 should be 400% louder than the ghost notes surrounding it.'
      },
      {
        title: 'Step 3: Groove Lock',
        description: 'Play with a metronome and ensure the ghost notes do not push the hi-hat speed.'
      }
    ],
    commonMistakes: [
      'Playing ghost notes too loud, making the groove sound frantic and messy',
      'Tensing the forearm during low-height taps'
    ],
    proTip: 'Imagine the snare drum head is covered in delicate tissue paper you must not tear when playing ghost notes.',
    practiceGoals: [
      'Maintain clear 4:1 dynamic ratio between backbeat and ghost notes',
      'Lock in 4 bars at 80 BPM',
      'Reach comfortable funk tempo at 92 BPM'
    ]
  },
  {
    id: 'lesson-3-1',
    title: '16th-Note Hi-Hat Grooves & Open Hat Barks',
    module: 'Groove Mastery & Musical Styles',
    moduleIndex: 3,
    level: 'Intermediate',
    duration: '25 min',
    tempoTarget: 100,
    summary: 'Drive high-energy disco, pop, and modern rock with continuous 16th-note hi-hat patterns and crisp open-hat sizzles.',
    keyTakeaway: 'Release hi-hat foot pedal on the "&" count and slam it shut right on the next downbeat for that iconic sizzle-choke.',
    stickingPattern: 'Two hands on hi-hat (RLRL) or One-handed sprint',
    subdivisionCountText: '1 e & a 2 e & a 3 e & a 4 e & a',
    patternSteps: [
      { step: 0, drum: 'hihatClosed' },
      { step: 0, drum: 'kick', accent: true },
      { step: 1, drum: 'hihatClosed' },
      { step: 2, drum: 'hihatClosed' },
      { step: 3, drum: 'hihatClosed' },
      { step: 4, drum: 'hihatClosed' },
      { step: 4, drum: 'snare', accent: true },
      { step: 5, drum: 'hihatClosed' },
      { step: 6, drum: 'hihatOpen', accent: true },
      { step: 7, drum: 'hihatClosed' },
      { step: 8, drum: 'hihatClosed' },
      { step: 8, drum: 'kick', accent: true },
      { step: 9, drum: 'hihatClosed' },
      { step: 10, drum: 'hihatClosed' },
      { step: 11, drum: 'hihatClosed' },
      { step: 12, drum: 'hihatClosed' },
      { step: 12, drum: 'snare', accent: true },
      { step: 13, drum: 'hihatClosed' },
      { step: 14, drum: 'hihatOpen', accent: true },
      { step: 15, drum: 'hihatClosed' },
    ],
    stepsBreakdown: [
      {
        title: 'Step 1: Two-Handed Hi-Hat Foundation',
        description: 'Play R L R L on hi-hat. When beat 2 and 4 arrive, the right hand stays on hi-hat while left hand drops to snare.'
      },
      {
        title: 'Step 2: The Open-Hat Bark',
        description: 'Slightly lift your left toe just as the stick strikes the hi-hat, then press down immediately on the next 16th.'
      },
      {
        title: 'Step 3: Tight Foot Pressure',
        description: 'When closed, apply solid heel pressure so the cymbals sizzle tightly with zero sloshy overhang.'
      }
    ],
    commonMistakes: [
      'Leaving the hi-hat open too long into beat 3 or 1',
      'Uneven volume between Right and Left hand on the 16th notes'
    ],
    proTip: 'Angle your stick so the shoulder hits the edge of the hi-hat cymbals on accents, and stick tip hits the top on quiet subdivisions.',
    practiceGoals: [
      'Clean open-choke bark on the "&" of 2 and 4',
      'Solid 2-handed flow at 90 BPM',
      'Dance club tempo at 105 BPM'
    ]
  },
  {
    id: 'lesson-3-2',
    title: 'The Legendary Purdie Half-Time Shuffle',
    module: 'Groove Mastery & Musical Styles',
    moduleIndex: 3,
    level: 'Advanced',
    duration: '28 min',
    tempoTarget: 82,
    summary: 'The holy grail of pocket drumming invented by Bernard Purdie, popularized in Steely Dan and Led Zeppelin tracks.',
    keyTakeaway: 'Triplets on the hi-hat with ghosted snare notes filling the inner triplet spaces around a thunderous backbeat on beat 3.',
    stickingPattern: 'Triplet grid: 1-trip-let 2-trip-let 3-trip-let 4-trip-let',
    subdivisionCountText: '1 - da 2 - da 3 - da 4 - da',
    patternSteps: [
      { step: 0, drum: 'hihatClosed', accent: true },
      { step: 0, drum: 'kick', accent: true },
      { step: 1, drum: 'snare', accent: false },
      { step: 2, drum: 'hihatClosed' },
      { step: 4, drum: 'hihatClosed', accent: true },
      { step: 5, drum: 'snare', accent: false },
      { step: 6, drum: 'hihatClosed' },
      { step: 8, drum: 'hihatClosed', accent: true },
      { step: 8, drum: 'snare', accent: true },
      { step: 9, drum: 'snare', accent: false },
      { step: 10, drum: 'hihatClosed' },
      { step: 12, drum: 'hihatClosed', accent: true },
      { step: 13, drum: 'snare', accent: false },
      { step: 14, drum: 'hihatClosed' },
    ],
    stepsBreakdown: [
      {
        title: 'Step 1: The Shuffle Hi-Hat',
        description: 'Play triplet swing on the hi-hat: hit the first and third note of each triplet ("1 - a 2 - a 3 - a 4 - a").'
      },
      {
        title: 'Step 2: Half-Time Backbeat',
        description: 'In half-time, the main snare backbeat lands ONLY on beat 3 (instead of 2 and 4). Make it fat.'
      },
      {
        title: 'Step 3: The Ghosted Middle Triplet',
        description: 'Drop quiet snare ghost notes into the empty middle slot of the triplets. This creates the undulating wave.'
      }
    ],
    commonMistakes: [
      'Rushing the triplets into straight 16ths',
      'Snare ghost notes bleeding into the accent on beat 3'
    ],
    proTip: 'Listen to "Rosanna" by Toto and "Babylon Sisters" by Steely Dan. Bob your head to the triplet swing before sitting down to play.',
    practiceGoals: [
      'Master the triplet pulse at 65 BPM',
      'Incorporate ghost notes without breaking swing cadence',
      'Achieve authentic relaxed swagger at 82 BPM'
    ]
  },
  {
    id: 'lesson-4-1',
    title: 'Linear Chops & Gospel Drumming Concepts',
    module: 'Fills, Timekeeping & Performance',
    moduleIndex: 4,
    level: 'Advanced',
    duration: '30 min',
    tempoTarget: 100,
    summary: 'Linear drumming means no two limbs play simultaneously. Learn blazing fast kick-snare-tom combinations.',
    keyTakeaway: 'Because limbs hit sequentially, volume and clarity skyrocket, creating jaw-dropping modern fills.',
    stickingPattern: 'R(Tom1) - L(Snare) - Kick - Kick - R(Tom2) - L(Floor) - Kick - Kick',
    subdivisionCountText: '1 e & a 2 e & a 3 e & a 4 e & a',
    patternSteps: [
      { step: 0, drum: 'tomHigh', accent: true },
      { step: 1, drum: 'snare' },
      { step: 2, drum: 'kick', accent: true },
      { step: 3, drum: 'kick' },
      { step: 4, drum: 'tomMid', accent: true },
      { step: 5, drum: 'snare' },
      { step: 6, drum: 'kick', accent: true },
      { step: 7, drum: 'kick' },
      { step: 8, drum: 'tomFloor', accent: true },
      { step: 9, drum: 'snare' },
      { step: 10, drum: 'kick', accent: true },
      { step: 11, drum: 'kick' },
      { step: 12, drum: 'snare', accent: true },
      { step: 13, drum: 'tomFloor' },
      { step: 14, drum: 'kick', accent: true },
      { step: 15, drum: 'kick' },
    ],
    stepsBreakdown: [
      {
        title: 'Step 1: The 4-Note Cell (Hand - Hand - Foot - Foot)',
        description: 'Right stick -> Left stick -> Double kick. Repeat this 4-note loop until it feels like a rolling wheel.'
      },
      {
        title: 'Step 2: Orchestration Around the Kit',
        description: 'Send the Right hand across High Tom, Mid Tom, and Ride Cymbal, keeping Left hand anchored on Snare.'
      },
      {
        title: 'Step 3: Double Kick Execution',
        description: 'Use slide or heel-toe technique on single pedal, or alternate feet cleanly on double pedal.'
      }
    ],
    commonMistakes: [
      'Hitting the hand and kick at the same time (destroys the linear clarity)',
      'Uneven spacing between the two foot strokes'
    ],
    proTip: 'Practice on your lap first: Right Hand, Left Hand, Right Foot, Right Foot. Get the mental firing order automatic.',
    practiceGoals: [
      'Clean 4-note cell at 75 BPM',
      'Smooth orchestration across all 3 toms',
      'Full 16-note linear blast at 100 BPM'
    ]
  }
];
