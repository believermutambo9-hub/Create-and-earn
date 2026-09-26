import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Shared server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// Fallback high-quality African & Zambian creative data presets
const SAMPLE_IDEAS = [
  {
    category: 'Couple Comedy',
    title: 'Just a Like',
    concept: 'A boyfriend accidentally likes a high school friend\'s glamour photo at 2:00 AM while lying right next to his light-sleeping girlfriend.',
    hook: '"Babe, whose finger tapped that heart icon?" Silence descends into an Olympic interrogation.',
    characters: ['Boyfriend (Bwembya - sweating nervously)', 'Girlfriend (Mwaka - master interrogator)', 'Phone Voice (Siri/notification)'],
    location: 'Dimly lit bedroom in Lusaka',
    punchline: 'Girlfriend: "You unliked it in 0.3 seconds? That means you were thinking about what you did!"',
    suggestedDuration: '45 seconds',
    audience: 'Couples, Young adults, Social media users',
    tone: 'Hilarious, fast-paced, relatable'
  },
  {
    category: 'Village vs Town',
    title: 'Smart TV & The Ancestors',
    concept: 'Uncle Phiri comes from Eastern Province to visit his nephew in a smart home apartment in Lusaka and thinks Alexa is a trapped witch.',
    hook: 'Uncle Phiri bows to the robotic vacuum cleaner as if it were a high chief.',
    characters: ['Uncle Phiri (Traditional elder)', 'Kondwani (Modern tech nephew)', 'Smart Speaker Voice'],
    location: 'Modern apartment living room with automated lights',
    punchline: 'Uncle Phiri threatens the speaker with his walking stick: "Tell me who cooked this voice or I pour salt on your router!"',
    suggestedDuration: '60 seconds',
    audience: 'General audience, Diaspora, Family',
    tone: 'Witty, cultural contrast, energetic'
  },
  {
    category: 'Workplace',
    title: 'The Friday 4:59 PM Email',
    concept: 'An employee packed his bag, logged out, and put his phone on airplane mode, when the boss shouts across the office hallway.',
    hook: 'Sneaking past the CEO door like a ninja in formal shoes.',
    characters: ['Mulenga (Eager-to-leave employee)', 'Mr. Banda (The workaholic boss)', 'Security Guard (Snack buddy)'],
    location: 'Corporate office reception & elevator lobby',
    punchline: 'Boss: "Before you leave, can you quickly revamp the 90-slide Q3 deck?" Mulenga feigns static noise verbally: *Krrrh, boss I\'m entering a tunnel...*',
    suggestedDuration: '30 seconds',
    audience: 'Corporate workers, Gen-Z creators',
    tone: 'Satirical, relatable everyday humor'
  },
  {
    category: 'Business & Brand Ads',
    title: 'The Hungry Lion Secret Weapon',
    concept: 'A student tries to convince his strict grandmother to buy takeout chicken by pretending it is an ancient medicinal recipe.',
    hook: '"Grandma, modern science proved that 8 pieces of spicy wings lower blood pressure!"',
    characters: ['Junior (Clever student)', 'Bana Mulenga (Sharp grandma)', 'Delivery Rider'],
    location: 'Family kitchen & dining table',
    punchline: 'Grandma bites the crunchy drumstick: "This medicine has too much flavor... give me the recipe and 3 more wings."',
    suggestedDuration: '45 seconds',
    audience: 'Food lovers, Family, Local businesses',
    tone: 'Commercial, appetizing, heartwarming comedy'
  }
];

// Helper to safely parse JSON from model response
function extractJsonFromText(text: string): any {
  try {
    const cleaned = text.replace(/```json\s*|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    return null;
  }
}

// 1. API: Generate Idea
app.post('/api/generate/idea', async (req: Request, res: Response) => {
  const { category = 'Couple Comedy', prompt = '', tone = 'Relatable Comedy', duration = '45 seconds', language = 'English & Local slang' } = req.body;

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are the lead comedy and viral content creator director for CREATE & EARN, an African creator mobile platform (Zambian, Nigerian, Kenyan, South African creator vibe).
Generate a viral video idea based on:
Category: ${category}
User premise/prompt: ${prompt || 'A very funny, relatable everyday social or cultural conflict'}
Tone: ${tone}
Duration: ${duration}
Language: ${language}

Return strictly a JSON object with this exact shape:
{
  "title": "Creative catchy title",
  "category": "${category}",
  "concept": "2-3 sentence engaging premise",
  "hook": "Strong opening 3-second visual or dialogue hook that stops scrolling",
  "characters": ["Character 1 (brief role)", "Character 2 (brief role)"],
  "location": "Relatable realistic filming location",
  "punchline": "The climax laugh or unexpected twist",
  "suggestedDuration": "${duration}",
  "audience": "Target demographic",
  "tone": "${tone}",
  "viralScore": "9.4/10"
}`,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.85,
        },
      });

      const parsed = extractJsonFromText(response.text || '');
      if (parsed && parsed.title) {
        return res.json({ success: true, data: parsed, source: 'ai' });
      }
    } catch (err: any) {
      console.warn('Gemini idea generation failed, falling back to curated preset:', err.message);
    }
  }

  // Fallback preset
  const matched = SAMPLE_IDEAS.find(i => i.category.toLowerCase().includes(category.toLowerCase())) || SAMPLE_IDEAS[0];
  const customized = {
    ...matched,
    title: prompt ? `The Case of "${prompt.slice(0, 30)}..."` : matched.title,
    concept: prompt ? `${matched.concept} Inspired by: ${prompt}.` : matched.concept,
    suggestedDuration: duration,
    tone: tone,
    viralScore: '9.6/10'
  };
  return res.json({ success: true, data: customized, source: 'curated' });
});

// 2. API: Generate Script
app.post('/api/generate/script', async (req: Request, res: Response) => {
  const { title = 'Just a Like', category = 'Couple Comedy', duration = '60 seconds', genre = 'Comedy', characters = 'Boyfriend, Girlfriend', idea = '' } = req.body;

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are an award-winning screenplay writer for mobile video creators in Africa (TikTok, YouTube Shorts, Reels).
Write a high-energy script for:
Title: ${title}
Category: ${category}
Genre: ${genre}
Duration: ${duration}
Characters: ${characters}
Premise: ${idea || 'A hilarious misunderstanding'}

Return strictly JSON matching this structure:
{
  "title": "${title}",
  "genre": "${genre}",
  "duration": "${duration}",
  "characters": ["Boyfriend", "Girlfriend"],
  "location": "Main setting",
  "openingHook": "Visual hook description in first 3 seconds",
  "scenes": [
    {
      "sceneNumber": 1,
      "heading": "SCENE 01 - BEDROOM - NIGHT",
      "location": "Bedroom",
      "duration": "10s",
      "action": "Boyfriend is scrolling on phone in dark, screen glow illuminates his face.",
      "dialogue": "Boyfriend: (Whispering) Just one more video then sleep... *taps heart* Oh no.",
      "expression": "Sudden sheer terror, wide eyes",
      "cameraCue": "Medium close-up, slow push in"
    },
    {
      "sceneNumber": 2,
      "heading": "SCENE 02 - BEDROOM - CONTINUOUS",
      "location": "Bedroom",
      "duration": "15s",
      "action": "Girlfriend turns around instantly like a motion sensor light turning on.",
      "dialogue": "Girlfriend: Who is that smiling back at you in the dark, Bwembya?",
      "expression": "Cold investigative stare, eyebrows raised",
      "cameraCue": "Over-the-shoulder Dutch angle"
    },
    {
      "sceneNumber": 3,
      "heading": "SCENE 03 - CONFRONTATION - CONTINUOUS",
      "location": "Bedroom",
      "duration": "20s",
      "action": "Boyfriend attempts to explain while hands shake visibly holding phone.",
      "dialogue": "Boyfriend: It was an algorithm glitch! My thumb experienced a spontaneous muscle spasm!",
      "expression": "Defensive nervous breakdown",
      "cameraCue": "Rapid whip pan between both faces"
    },
    {
      "sceneNumber": 4,
      "heading": "SCENE 04 - THE PUNCHLINE & CLIMAX",
      "location": "Bedroom doorway",
      "duration": "15s",
      "action": "Girlfriend reveals she already has his screen mirrored onto her tablet.",
      "dialogue": "Girlfriend: Pack your things and go explain that muscle spasm to your WiFi provider.",
      "expression": "Smug victorious smirk",
      "cameraCue": "Wide shot, crash zoom onto shocked face"
    }
  ],
  "punchline": "Girlfriend: Unliking in 0.2 seconds means you premeditated the crime!",
  "ending": "Fade to black with classic dramatic African sting sound effect"
}`,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.8,
        },
      });

      const parsed = extractJsonFromText(response.text || '');
      if (parsed && parsed.scenes && parsed.scenes.length > 0) {
        return res.json({ success: true, data: parsed, source: 'ai' });
      }
    } catch (err: any) {
      console.warn('Gemini script generation error:', err.message);
    }
  }

  // Fallback screenplay
  const fallbackScript = {
    title: title || 'Just a Like',
    genre: genre || 'Comedy',
    duration: duration || '60 seconds',
    characters: ['Boyfriend (Bwembya)', 'Girlfriend (Mwaka)'],
    location: 'Modern Apartment Living Room',
    openingHook: 'Boyfriend smiles gleefully at phone screen, then freezes as a shadow looms over him.',
    scenes: [
      {
        sceneNumber: 1,
        heading: 'SCENE 01 - THE INNOCENT SCROLL',
        location: 'Living room couch',
        duration: '10s',
        action: 'Boyfriend relaxed with feet up, double taps a post without noticing girlfriend standing right behind the curtains.',
        dialogue: 'Boyfriend (to himself): "Hehe, look at this funny meme..." *heart pops up*',
        expression: 'Relaxed joy turning instantly to panic',
        cameraCue: 'Medium shot from 45 degree angle'
      },
      {
        sceneNumber: 2,
        heading: 'SCENE 02 - THE DETECTIVE ENTERS',
        location: 'Behind the couch',
        duration: '15s',
        action: 'Girlfriend clears throat with authority of a supreme court judge.',
        dialogue: 'Girlfriend: "Nice picture, Bwembya. Is she from your ancestral village or should I search your DMs?"',
        expression: 'Piercing, calm interrogation look',
        cameraCue: 'Close-up on girlfriend\'s unforgiving stare'
      },
      {
        sceneNumber: 3,
        heading: 'SCENE 03 - THE FAILED DEFENSE',
        location: 'Couch',
        duration: '20s',
        action: 'Boyfriend frantically tries to show it was an accident, drops phone between couch cushions.',
        dialogue: 'Boyfriend: "It was an accident! I was trying to swipe down and my thumb betrayed me!"',
        expression: 'Profuse sweating, frantic hand gestures',
        cameraCue: 'Handheld shaky cam for comedic tension'
      },
      {
        sceneNumber: 4,
        heading: 'SCENE 04 - THE VERDICT',
        location: 'Living room',
        duration: '15s',
        action: 'Girlfriend takes his phone and locks it in a biometric safe.',
        dialogue: 'Girlfriend: "Court is adjourned. Dinner is postponed. You sleep on the balcony."',
        expression: 'Ice cold confidence',
        cameraCue: 'Freeze frame on boyfriend\'s face with comedy music hit'
      }
    ],
    punchline: 'Girlfriend: "You can explain the algorithm to the mosquitoes tonight!"',
    ending: 'Dramatic comedy freeze frame with laughing audience cue'
  };
  return res.json({ success: true, data: fallbackScript, source: 'curated' });
});

// 3. API: Generate Scenes (filmable shot list)
app.post('/api/generate/scenes', async (req: Request, res: Response) => {
  const { scriptTitle = 'Just a Like', scriptContent = '' } = req.body;

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are an expert film director and DP for mobile creators.
Convert this creator script "${scriptTitle}" into an actionable, filmable scene-by-scene shot list.
Script context: ${scriptContent || 'Hilarious comedy confrontation between couple'}

Return strictly JSON with an array of detailed scenes:
{
  "scenes": [
    {
      "sceneNumber": 1,
      "title": "Scene 1: The Incriminating Like",
      "location": "Bedroom - Soft lamp glow",
      "characters": "Boyfriend",
      "dialogue": "Boyfriend: (Whispering) It was just a tap...",
      "facialExpression": "Guilty, wide-eyed, nervous swallow",
      "bodyLanguage": "Hunches over phone, instinctively covers screen with forearm",
      "cameraShot": "Medium shot (Chest level)",
      "cameraMovement": "Slow creeping push-in",
      "lighting": "Dark room with bright cyan phone glow on face",
      "soundSuggestion": "Subtle clock ticking + sudden heart beat thud",
      "estimatedDuration": "8 seconds"
    },
    {
      "sceneNumber": 2,
      "title": "Scene 2: Shadow in the Doorway",
      "location": "Doorway & Bedside",
      "characters": "Girlfriend",
      "dialogue": "Girlfriend: Who is she, Bwembya?",
      "facialExpression": "Deadpan, hyper-focused, unblinking",
      "bodyLanguage": "Arms crossed tightly, head tilted 15 degrees",
      "cameraShot": "Low angle dramatic shot",
      "cameraMovement": "Static locked-off shot for intimidating presence",
      "lighting": "Backlit from hallway creating silhouette halo",
      "soundSuggestion": "Horror violin screech sting (comedic)",
      "estimatedDuration": "10 seconds"
    },
    {
      "sceneNumber": 3,
      "title": "Scene 3: The Interrogation",
      "location": "Bedside",
      "characters": "Boyfriend & Girlfriend",
      "dialogue": "Boyfriend: It\'s not what you think! It\'s sponsored content!",
      "facialExpression": "Panic versus Sherlock Holmes composure",
      "bodyLanguage": "Boyfriend waving hands frantically; Girlfriend taps foot rhythmically",
      "cameraShot": "Over-the-shoulder ping pong",
      "cameraMovement": "Rapid whip-pans between speakers",
      "lighting": "Full room light clicked on suddenly (blinding)",
      "soundSuggestion": "Fast tempo comedic marimba / drums",
      "estimatedDuration": "14 seconds"
    },
    {
      "sceneNumber": 4,
      "title": "Scene 4: The Climax Punchline",
      "location": "Living room hallway",
      "characters": "Both",
      "dialogue": "Girlfriend: Enjoy liking photos outside the gate.",
      "facialExpression": "Defeated disbelief",
      "bodyLanguage": "Slumping shoulders, hands on head in despair",
      "cameraShot": "Extreme close-up on eye twitch, cut to wide walking away",
      "cameraMovement": "Crash zoom on phone dropping to floor",
      "lighting": "High contrast comedy flat lighting",
      "soundSuggestion": "Bass drop + viral comedy laugh track",
      "estimatedDuration": "8 seconds"
    }
  ]
}`,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.8,
        },
      });

      const parsed = extractJsonFromText(response.text || '');
      if (parsed && parsed.scenes) {
        return res.json({ success: true, data: parsed.scenes, source: 'ai' });
      }
    } catch (err: any) {
      console.warn('Gemini scenes generation error:', err.message);
    }
  }

  // Fallback scene shot list
  const scenes = [
    {
      sceneNumber: 1,
      title: 'Scene 1: The Incriminating Tap',
      location: 'Living room couch, Lusaka',
      characters: 'Boyfriend (Bwembya)',
      dialogue: 'Boyfriend: (Whispering) "Just scrolling before dinner..."',
      facialExpression: 'Playful grin instantly freezing into absolute horror',
      bodyLanguage: 'Freezes stiff like a statue, finger stuck on screen',
      cameraShot: 'Medium close-up (Eye level)',
      cameraMovement: 'Smooth push-in 1.5x zoom',
      lighting: 'Warm ambient evening lamp + harsh phone screen reflection',
      soundSuggestion: 'Fast heartbeat sound effect (thump-thump)',
      estimatedDuration: '7 seconds'
    },
    {
      sceneNumber: 2,
      title: 'Scene 2: The Boss Arrives',
      location: 'Hallway archway',
      characters: 'Girlfriend (Mwaka)',
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
  return res.json({ success: true, data: scenes, source: 'curated' });
});

// 4. API: Generate Captions & Hashtags
app.post('/api/generate/captions', async (req: Request, res: Response) => {
  const { description = '', platform = 'TikTok / Reels', category = 'Comedy' } = req.body;

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are an African social media viral strategist.
Generate viral captions and trending hashtags for a mobile video:
Description: ${description || 'A funny skit about a couple arguing over liking an Instagram photo'}
Platform: ${platform}
Category: ${category}

Return strictly JSON:
{
  "shortCaption": "Punchy 1-sentence viral hook with emojis",
  "funnyCaption": "Hilarious relatable caption that triggers comments",
  "professionalCaption": "Clean brand-friendly creator caption",
  "engagementCaption": "Question-based caption that forces people to tag their friends",
  "hashtags": ["#Comedy", "#AfricanComedy", "#ZambianComedy", "#CoupleGoals", "#RelatableMemes", "#JustALike", "#CreateAndEarn", "#LusakaCreators", "#AfricanCreators", "#ViralVideo"]
}`,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.85,
        },
      });

      const parsed = extractJsonFromText(response.text || '');
      if (parsed && parsed.hashtags) {
        return res.json({ success: true, data: parsed, source: 'ai' });
      }
    } catch (err: any) {
      console.warn('Gemini captions generation error:', err.message);
    }
  }

  // Fallback captions
  const fallback = {
    shortCaption: 'When a 0.1-second double tap turns into a 3-hour trial. 😭💀 #JustALike',
    funnyCaption: 'I told her my phone had a muscle spasm and now I\'m sleeping in the car with 2% battery. 🚗🔋 Pray for me!',
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
  return res.json({ success: true, data: fallback, source: 'curated' });
});

// Setup Vite in Dev or serve static in Prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CREATE & EARN server running on http://localhost:${PORT}`);
  });
}

startServer();
