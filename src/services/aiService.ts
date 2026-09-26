export interface GenerateIdeaParams {
  category: string;
  prompt?: string;
  tone?: string;
  duration?: string;
  audience?: string;
  language?: string;
}

export interface GenerateScriptParams {
  title: string;
  category: string;
  duration: string;
  genre: string;
  characters: string;
  idea?: string;
}

export interface GenerateScenesParams {
  scriptTitle: string;
  scriptContent?: string;
}

export interface GenerateCaptionsParams {
  description: string;
  platform?: string;
  category?: string;
}

export async function generateIdeaAPI(params: GenerateIdeaParams) {
  try {
    const res = await fetch('/api/generate/idea', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    console.error('Failed to generate idea from server:', err);
  }

  // Client safety fallback
  return {
    title: params.prompt ? `The Story of ${params.prompt.slice(0, 24)}` : 'Just a Like',
    category: params.category || 'Couple Comedy',
    concept: 'A boyfriend is caught double-tapping an ex-classmate\'s glamorous selfie at 2:00 AM while lying right next to his light-sleeping girlfriend.',
    hook: '"Babe, whose finger just tapped that heart icon?" An instant police-level interrogation unfolds.',
    characters: ['Boyfriend (Bwembya - sweating)', 'Girlfriend (Mwaka - master interrogator)'],
    location: 'Quiet bedroom in Lusaka',
    punchline: 'Girlfriend: "You unliked it in 0.3 seconds? That means you were thinking about what you did!"',
    suggestedDuration: params.duration || '45 seconds',
    audience: 'Couples, young adults',
    tone: params.tone || 'Hilarious & Relatable',
    viralScore: '9.6/10'
  };
}

export async function generateScriptAPI(params: GenerateScriptParams) {
  try {
    const res = await fetch('/api/generate/script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    console.error('Failed to generate script from server:', err);
  }

  return {
    title: params.title || 'Just a Like',
    genre: params.genre || 'Comedy',
    duration: params.duration || '60 seconds',
    characters: ['Boyfriend (Bwembya)', 'Girlfriend (Mwaka)'],
    location: 'Bedroom & Living Room',
    openingHook: 'Boyfriend scrolling peacefully in the dark when a bright flashlight suddenly blinds him.',
    scenes: [
      {
        sceneNumber: 1,
        heading: 'SCENE 01 - THE INCRIMINATING LIKE',
        location: 'Bedroom',
        duration: '12s',
        action: 'Boyfriend taps screen, realizes what he did, and gasps silently.',
        dialogue: 'Boyfriend: (Whispering in terror) "No, no, take it back, take it back..."',
        expression: 'Wide eyes, trembling hands',
        cameraCue: 'Close-up on phone screen reflection in his eyes'
      },
      {
        sceneNumber: 2,
        heading: 'SCENE 02 - THE INTERROGATION BEGINS',
        location: 'Bedroom',
        duration: '18s',
        action: 'Girlfriend sits up in bed without making a sound.',
        dialogue: 'Girlfriend: "Who is that you\'re blessing with your thumb at 2 AM, Mr. Believer?"',
        expression: 'Piercing, calm stare',
        cameraCue: 'Slow push-in from dark corner'
      },
      {
        sceneNumber: 3,
        heading: 'SCENE 03 - THE FAILED EXCUSE',
        location: 'Living room doorway',
        duration: '15s',
        action: 'Boyfriend tries to slide phone under mattress.',
        dialogue: 'Boyfriend: "Babe, it was an algorithm glitch! My thumb suffered a sudden muscle spasm!"',
        expression: 'Panic and desperate defense',
        cameraCue: 'Shaky handheld comedic camera'
      },
      {
        sceneNumber: 4,
        heading: 'SCENE 04 - THE VERDICT',
        location: 'Balcony',
        duration: '15s',
        action: 'Girlfriend locks sliding glass door and tosses him a small blanket.',
        dialogue: 'Girlfriend: "Go explain your muscle spasm to the mosquitoes tonight."',
        expression: 'Smug confidence',
        cameraCue: 'Crash zoom onto boyfriend\'s hopeless face'
      }
    ],
    punchline: 'Girlfriend: "Unliking in 0.2 seconds proves you premeditated the crime!"',
    ending: 'Fade out with iconic African comedy flute sting'
  };
}

export async function generateScenesAPI(params: GenerateScenesParams) {
  try {
    const res = await fetch('/api/generate/scenes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    console.error('Failed to generate scenes from server:', err);
  }

  return [
    {
      sceneNumber: 1,
      title: 'Scene 1: The Incriminating Tap',
      location: 'Living room couch, Lusaka',
      characters: 'Boyfriend',
      dialogue: 'Boyfriend: (Whispering) "Just scrolling before dinner..."',
      facialExpression: 'Playful grin turning instantly into sheer horror',
      bodyLanguage: 'Freezes stiff like a statue, finger stuck on glass',
      cameraShot: 'Medium close-up (Chest level)',
      cameraMovement: 'Smooth push-in 1.5x zoom',
      lighting: 'Warm ambient evening lamp + harsh phone screen reflection',
      soundSuggestion: 'Fast heartbeat sound effect (thump-thump)',
      estimatedDuration: '7 seconds'
    },
    {
      sceneNumber: 2,
      title: 'Scene 2: The Boss Arrives',
      location: 'Hallway archway',
      characters: 'Girlfriend',
      dialogue: 'Girlfriend: "Whose beauty are you appreciating with both thumbs?"',
      facialExpression: 'Deadpan smirk with raised left eyebrow',
      bodyLanguage: 'Standing arms folded, weight on one hip',
      cameraShot: 'Low angle medium shot',
      cameraMovement: 'Slow dramatic tilt up from slippers to eyes',
      lighting: 'Cool hallway light contrasting warm room',
      soundSuggestion: 'Dramatic soap-opera sting or African drum roll',
      estimatedDuration: '10 seconds'
    },
    {
      sceneNumber: 3,
      title: 'Scene 3: The Interrogation',
      location: 'Couch',
      characters: 'Boyfriend and Girlfriend',
      dialogue: 'Boyfriend: "My finger slipped on the glass! The screen protector has static electricity!"',
      facialExpression: 'Desperate perspiration and pleading eyes',
      bodyLanguage: 'Gesturing wildly with hands, trying to shield screen',
      cameraShot: 'Over-the-shoulder ping pong / split framing',
      cameraMovement: 'Whip-pan back and forth',
      lighting: 'High clarity, bright key light',
      soundSuggestion: 'Energetic upbeat acoustic comedy riff',
      estimatedDuration: '12 seconds'
    },
    {
      sceneNumber: 4,
      title: 'Scene 4: The Punchline & Eviction',
      location: 'Front door',
      characters: 'Boyfriend holding pillow',
      dialogue: 'Girlfriend: "Go explain your static electricity to the guard dog outside."',
      facialExpression: 'Ultimate defeat, mouth slightly open',
      bodyLanguage: 'Hanging head low, walking slowly towards exit',
      cameraShot: 'Wide shot pulling backwards down the corridor',
      cameraMovement: 'Static wide shot ending with door slam',
      lighting: 'Outdoor porch light casting long comedic shadow',
      soundSuggestion: 'Cartoon slide whistle + viral crowd laugh',
      estimatedDuration: '9 seconds'
    }
  ];
}

export async function generateCaptionsAPI(params: GenerateCaptionsParams) {
  try {
    const res = await fetch('/api/generate/captions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    console.error('Failed to generate captions from server:', err);
  }

  return {
    shortCaption: 'When a 0.1-second double tap turns into a 3-hour trial. 😭💀 #JustALike',
    funnyCaption: 'I told her my phone had a muscle spasm and now I\'m sleeping on the balcony with 3% battery. 🔋 Send help! 😂',
    professionalCaption: 'Behind every viral skit is real pain! Excited to share our new comedy short created with CREATE & EARN.',
    engagementCaption: 'Drop an emoji if your partner has ever caught you liking a photo from 2019! Who was in the wrong here? Tag them below! 👇😂',
    hashtags: [
      '#Comedy',
      '#AfricanComedy',
      '#ZambianComedy',
      '#CoupleComedy',
      '#RelationshipGoals',
      '#VillageVsTown',
      '#ViralSkits',
      '#CreateAndEarn',
      '#LusakaTrending',
      '#AfricanCreators',
      '#JustALike'
    ]
  };
}
