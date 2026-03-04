import { HEAT_LABELS } from '../constants/theme';

/**
 * Steelman Engine — built on Rapoport's Rules (via Daniel Dennett).
 *
 * This module constructs the system prompt and processes user input
 * to generate steelman arguments. It's designed to work with any
 * OpenAI-compatible API (OpenAI, Anthropic via proxy, local LLMs, etc.)
 *
 * In production, API calls go through your own backend to keep keys safe.
 * For demo/dev, it returns structured mock responses.
 */

const SYSTEM_PROMPT_BASE = `You are the Steelman Engine — a world-class debater and critical thinker whose sole purpose is to construct the strongest possible case for the OPPOSING side of any opinion presented to you.

You follow Rapoport's Rules strictly:

1. **Re-express**: Restate the opposing position so clearly and fairly that even its strongest advocate would say "Thanks, I wish I'd said it that way."
2. **Common Ground**: Identify 2-3 points that both sides genuinely agree on.
3. **What You Learned**: Acknowledge at least one insight or valid concern from the original position.
4. **The Steelman**: Construct the strongest possible opposing argument using the best available reasoning, evidence, and moral frameworks — even if the original speaker didn't articulate them.

CRITICAL RULES:
- Never use strawman tactics or misrepresent either side.
- Use the most charitable interpretation of the opposing side's values and motivations.
- Do not be condescending or dismissive of any viewpoint.
- You are temporarily "taking a side" to help the user grow intellectually.
- Include specific, concrete examples and reasoning — not vague platitudes.
- End with a "Weak Point" section that identifies the most vulnerable part of the user's ORIGINAL take when confronted with this steelman.

Format your response with clear markdown headers for each section.`;

function getHeatModifier(heatLevel) {
  const modifiers = {
    1: 'Use a calm, measured, academic tone. Cite philosophical frameworks and research. Write as a tenured professor would in a peer-reviewed journal.',
    2: 'Use a thoughtful, balanced tone. Be fair and considerate, like a wise mentor explaining a nuanced perspective over coffee.',
    3: 'Use a clear, persuasive tone. Be direct and convincing, like a skilled lawyer making their closing argument.',
    4: 'Use a passionate, energetic tone. Write as a true believer who has lived this position — someone who would give a standing-ovation-worthy TED talk on this topic.',
    5: 'Use maximum rhetorical intensity. Channel the energy of a fiery activist at a rally who deeply, personally believes in this cause. Be vivid, urgent, and emotionally compelling while staying logically sound.',
  };
  return modifiers[heatLevel] || modifiers[3];
}

function buildSystemPrompt(heatLevel) {
  return `${SYSTEM_PROMPT_BASE}\n\nTONE DIRECTIVE: ${getHeatModifier(heatLevel)}`;
}

function sanitizeInput(text) {
  // Strip characters that could be interpreted as prompt control sequences
  return text.replace(/[<>{}[\]]/g, '').trim();
}

function buildUserPrompt(opinion) {
  const sanitized = sanitizeInput(opinion);
  return `Here is the opinion/hot take I want you to steelman the OPPOSING side of:\n\n"${sanitized}"\n\nNow construct the strongest possible case for the opposing view, following Rapoport's Rules.`;
}

/**
 * Generate a steelman response.
 *
 * @param {string} opinion - The user's opinion/hot take
 * @param {number} heatLevel - 1-5 intensity scale
 * @param {string|null} apiKey - API key (null for demo mode)
 * @param {string} apiEndpoint - API endpoint URL
 * @returns {Promise<SteelmanResponse>}
 */
export async function generateSteelman(opinion, heatLevel = 3, apiKey = null, apiEndpoint = null) {
  const systemPrompt = buildSystemPrompt(heatLevel);
  const userPrompt = buildUserPrompt(opinion);

  // If API key is configured, make real API call
  if (apiKey && apiEndpoint) {
    return callAPI(systemPrompt, userPrompt, apiKey, apiEndpoint);
  }

  // Demo mode: return structured mock response
  return generateDemoResponse(opinion, heatLevel);
}

async function callAPI(systemPrompt, userPrompt, apiKey, apiEndpoint) {
  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  return parseResponse(content);
}

function parseResponse(content) {
  // Parse the markdown sections from the AI response
  const sections = {
    reexpression: '',
    commonGround: '',
    learned: '',
    steelman: '',
    weakPoint: '',
    fullText: content,
  };

  const sectionPatterns = [
    { key: 'reexpression', pattern: /#{1,4}\s*(?:1\.?\s*)?Re-?express(?:ion)?.*?\n([\s\S]*?)(?=\n#{1,4}\s|$)/i },
    { key: 'commonGround', pattern: /#{1,4}\s*(?:2\.?\s*)?Common Ground.*?\n([\s\S]*?)(?=\n#{1,4}\s|$)/i },
    { key: 'learned', pattern: /#{1,4}\s*(?:3\.?\s*)?What (?:You |I )?Learned.*?\n([\s\S]*?)(?=\n#{1,4}\s|$)/i },
    { key: 'steelman', pattern: /#{1,4}\s*(?:4\.?\s*)?(?:The )?Steelman.*?\n([\s\S]*?)(?=\n#{1,4}\s|$)/i },
    { key: 'weakPoint', pattern: /#{1,4}\s*(?:5\.?\s*)?Weak Point.*?\n([\s\S]*?)(?=\n#{1,4}\s|$)/i },
  ];

  for (const { key, pattern } of sectionPatterns) {
    const match = content.match(pattern);
    if (match) {
      sections[key] = match[1].trim();
    }
  }

  return sections;
}

function generateDemoResponse(opinion, heatLevel) {
  const heat = HEAT_LABELS[heatLevel];
  const opinionLower = opinion.toLowerCase();

  // Generate contextual demo responses based on common topics
  let topic = 'general';
  if (opinionLower.includes('social media') || opinionLower.includes('twitter') || opinionLower.includes('instagram')) {
    topic = 'social_media';
  } else if (opinionLower.includes('remote') || opinionLower.includes('work from home') || opinionLower.includes('office')) {
    topic = 'remote_work';
  } else if (opinionLower.includes('ai') || opinionLower.includes('artificial intelligence')) {
    topic = 'ai';
  } else if (opinionLower.includes('college') || opinionLower.includes('university') || opinionLower.includes('education')) {
    topic = 'education';
  }

  const responses = {
    social_media: {
      reexpression: 'The opposing view holds that social media platforms, despite their flaws, represent one of the most democratizing communication technologies in human history — giving voice to the marginalized, enabling grassroots movements, and connecting people across boundaries that previously seemed insurmountable.',
      commonGround: '• Both sides agree that human connection is fundamental to well-being\n• Both acknowledge that technology shapes society in profound ways\n• Both want people, especially young people, to thrive mentally and socially',
      learned: 'The original position raises valid concerns about mental health impacts that deserve serious attention. The data on adolescent anxiety correlated with social media use is genuinely alarming and shouldn\'t be dismissed.',
      steelman: `${heatLevel >= 4 ? 'Consider this: ' : ''}Without social media, the Arab Spring doesn't happen. The #MeToo movement doesn't reach critical mass. Small businesses in rural areas don't find global customers. Isolated LGBTQ+ teenagers in hostile communities don't find their people.\n\nThe strongest case for social media isn't that it's perfect — it's that the alternative is worse. Before social media, information gatekeepers were a handful of media corporations and political institutions. Social media broke that monopoly.\n\n${heatLevel >= 3 ? 'The mental health concerns, while real, conflate correlation with causation. The rise in anxiety coincides with smartphones, economic instability, climate anxiety, and a dozen other factors. Blaming social media alone is intellectually lazy.' : 'Research suggests the relationship between social media and mental health is more nuanced than often presented.'}`,
      weakPoint: 'Your original take is most vulnerable on the question of agency: if social media is truly harmful, why do billions of informed adults continue to use it voluntarily? The "addiction" framing removes human agency from the equation in a way that may be more patronizing than protective.',
    },
    remote_work: {
      reexpression: 'The opposing perspective argues that physical co-location isn\'t just a relic of the past — it\'s a fundamental enabler of the spontaneous collaboration, mentorship, and cultural cohesion that make organizations truly innovative and fulfilling places to work.',
      commonGround: '• Both sides want workers to be productive and fulfilled\n• Both recognize that flexibility has real value\n• Both agree that poor management undermines any work arrangement',
      learned: 'The original position correctly identifies that commuting is genuinely wasteful time for many workers, and that forced office presence can feel like a trust deficit.',
      steelman: `The strongest case for office work isn't about surveillance or tradition — it's about what researchers call "weak ties" and serendipitous interaction. Studies from MIT's Human Dynamics Lab show that breakthrough innovations disproportionately emerge from unplanned conversations between people from different teams.\n\n${heatLevel >= 4 ? 'Remote work is comfortable. But comfort and growth are often inversely correlated. ' : ''}Junior employees learn by osmosis — watching how senior colleagues handle a difficult client call, overhearing problem-solving in real-time. You can't Slack-message your way to that kind of tacit knowledge transfer.\n\nThe data also shows that remote workers get promoted less, not because of bias, but because visibility and relationship-building genuinely matter for career development.`,
      weakPoint: 'Your original take is most vulnerable on the equity dimension: remote work primarily benefits knowledge workers with home offices, while creating a two-tier workforce where frontline workers bear commuting burdens without the same flexibility.',
    },
    ai: {
      reexpression: 'The opposing view holds that AI, despite legitimate concerns, represents perhaps the most powerful tool humanity has ever created for solving problems that have persisted for centuries — from disease diagnosis to climate modeling to educational access.',
      commonGround: '• Both sides agree AI\'s impact will be profound and far-reaching\n• Both recognize the need for thoughtful governance\n• Both want technology to serve human flourishing',
      learned: 'The original position raises critical points about displacement, bias, and concentration of power that must be central to any honest conversation about AI development.',
      steelman: `Every transformative technology — the printing press, electricity, the internet — was met with fear that proved partially right and mostly wrong. The printing press did enable propaganda; it also enabled the Enlightenment.\n\n${heatLevel >= 4 ? 'Here\'s what the fear narrative misses: ' : ''}AI is already saving lives. AI systems detect cancers that radiologists miss. They predict protein structures that would have taken decades to determine experimentally. They make education accessible in languages and formats that no human workforce could provide at scale.\n\nThe "AI will take our jobs" argument assumes a static economy. History shows that automation creates more jobs than it destroys — just different ones. The question isn't whether to develop AI, but whether we develop it wisely.`,
      weakPoint: 'Your original take is most vulnerable on the timeline argument: even if AI risks are real, slowing development unilaterally just means less safety-conscious actors develop it first. The genie is out of the bottle.',
    },
    education: {
      reexpression: 'The opposing perspective argues that higher education, despite rising costs, provides irreplaceable value — not just in career earnings, but in critical thinking skills, social networks, and the kind of broad intellectual formation that a democracy requires of its citizens.',
      commonGround: '• Both sides want people to have fulfilling, economically viable careers\n• Both acknowledge the student debt crisis is a real problem\n• Both value learning and intellectual development',
      learned: 'The original position correctly identifies that the cost-benefit calculation has shifted dramatically, and that many institutions have failed to adapt to modern economic realities.',
      steelman: `The college earnings premium remains substantial: college graduates earn, on average, $1.2 million more over a lifetime than those with only a high school diploma. That gap has actually widened, not narrowed.\n\n${heatLevel >= 3 ? 'But the financial argument is actually the weakest case for college. The strongest case is civilizational: ' : ''}democracy requires citizens who can evaluate evidence, understand history, and think across disciplines. A society of pure vocational training is a society that can be easily manipulated.\n\nThe most successful dropout stories (Gates, Zuckerberg) are survivorship bias at its finest — for every dropout billionaire, there are millions who dropped out into economic hardship.`,
      weakPoint: 'Your original take is most vulnerable on the access argument: criticizing college as "not worth it" disproportionately discourages first-generation students who would benefit most, while wealthy families continue sending their children regardless.',
    },
    general: {
      reexpression: `The opposing position, at its strongest, isn't what you might assume. It comes from a place of genuine concern and a different — but internally consistent — set of values and priorities that deserve to be understood on their own terms.`,
      commonGround: '• Both perspectives ultimately want good outcomes for people\n• Both are responding to real observations about the world\n• Both contain elements of truth that the other side tends to overlook',
      learned: 'Your original position identifies a real tension that deserves serious engagement, not dismissal. The concerns you raise are shared by thoughtful people across the ideological spectrum.',
      steelman: `${heatLevel >= 4 ? 'Let me be direct: ' : ''}The strongest version of the opposing argument doesn't just disagree with your conclusion — it challenges the framework you're using to reach it. Where you see a clear-cut issue, the other side sees genuine tradeoffs that your framing obscures.\n\nThe most compelling advocates of the opposing view aren't ignorant of your arguments — they've considered them and found them insufficient. They point to evidence you may not have encountered, edge cases your model doesn't handle, and real-world outcomes that complicate the narrative.\n\n${heatLevel >= 3 ? 'The inconvenient truth is that the strongest version of the opposing argument has explanatory power for phenomena that your position struggles to account for.' : 'Their perspective accounts for certain phenomena that are difficult to explain under your framework.'}`,
      weakPoint: 'Your original take is most vulnerable where it assumes the strongest motivation for the opposing view. The real advocates of the opposing position are driven by concerns you may not have fully considered, and addressing their actual reasoning — not its weakest version — would strengthen your own position considerably.',
    },
  };

  const response = responses[topic] || responses.general;

  const fullText = `## 1. Re-expression\n${response.reexpression}\n\n## 2. Common Ground\n${response.commonGround}\n\n## 3. What I Learned\n${response.learned}\n\n## 4. The Steelman\n${response.steelman}\n\n## 5. Weak Point in Your Original Take\n${response.weakPoint}`;

  return {
    ...response,
    fullText,
  };
}

/**
 * ITT Grading Engine — evaluates how well a user steelmanned a position.
 */
export async function gradeITT(topic, userAttempt, apiKey = null, apiEndpoint = null) {
  if (apiKey && apiEndpoint) {
    return gradeITTWithAPI(topic, userAttempt, apiKey, apiEndpoint);
  }
  return gradeITTDemo(topic, userAttempt);
}

async function gradeITTWithAPI(topic, userAttempt, apiKey, apiEndpoint) {
  const systemPrompt = `You are an Ideological Turing Test grader. Your job is to evaluate whether a person's written defense of a position sounds like it comes from a genuine advocate or if their personal bias is "leaking" through.

Grade on these criteria (each 1-10):
1. **Authenticity** — Does this sound like someone who genuinely holds this view?
2. **Charity** — Does the writer use the most favorable interpretation of the position's values?
3. **Specificity** — Does the writer use concrete examples and specific reasoning?
4. **Empathy** — Does the writer convey understanding of WHY someone would hold this view?
5. **Bias Leakage** — Score of 10 means NO detectable bias against the position. Score of 1 means the writer clearly doesn't believe what they're writing.

Provide a total score out of 50, a letter grade (A-F), and 2-3 sentences of specific feedback on how to improve.

Format as JSON: { "authenticity": N, "charity": N, "specificity": N, "empathy": N, "biasLeakage": N, "total": N, "grade": "X", "feedback": "..." }`;

  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Topic to defend: "${sanitizeInput(topic)}"\n\nUser's attempt:\n"${sanitizeInput(userAttempt)}"` },
      ],
      temperature: 0.5,
      max_tokens: 500,
    }),
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

function gradeITTDemo(topic, userAttempt) {
  const wordCount = userAttempt.split(/\s+/).length;
  const hasExamples = /for example|for instance|such as|like when|consider/i.test(userAttempt);
  const hasEmotion = /feel|believe|care|matter|important|love|fear|hope/i.test(userAttempt);
  const hasSpecifics = /\d|percent|study|research|data|evidence/i.test(userAttempt);
  const hasDismissive = /obviously|clearly wrong|stupid|ridiculous|nonsense/i.test(userAttempt);
  const hasFirstPerson = /\bI believe\b|\bI feel\b|\bI think\b|\bmy view\b|\bin my experience\b/i.test(userAttempt);
  const isSubstantial = wordCount > 150;

  let authenticity = Math.min(10, 4 + (wordCount > 50 ? 2 : 0) + (hasEmotion ? 2 : 0) + (hasFirstPerson ? 1 : 0) + (isSubstantial ? 1 : 0) + (hasDismissive ? -3 : 0));
  let charity = Math.min(10, 5 + (hasDismissive ? -4 : 0) + (hasEmotion ? 1 : 0) + (hasFirstPerson ? 2 : 0) + (isSubstantial ? 1 : 0));
  let specificity = Math.min(10, 3 + (hasExamples ? 3 : 0) + (hasSpecifics ? 2 : 0) + (wordCount > 100 ? 2 : 0));
  let empathy = Math.min(10, 4 + (hasEmotion ? 3 : 0) + (hasFirstPerson ? 1 : 0) + (isSubstantial ? 1 : 0) + (hasDismissive ? -3 : 0));
  let biasLeakage = Math.min(10, 6 + (hasDismissive ? -5 : 0) + (hasEmotion ? 1 : 0) + (hasFirstPerson ? 1 : 0) + (isSubstantial ? 1 : 0));

  // Clamp values
  authenticity = Math.max(1, authenticity);
  charity = Math.max(1, charity);
  specificity = Math.max(1, specificity);
  empathy = Math.max(1, empathy);
  biasLeakage = Math.max(1, biasLeakage);

  const total = authenticity + charity + specificity + empathy + biasLeakage;

  let grade, feedback;
  if (total >= 42) {
    grade = 'A';
    feedback = 'Excellent work! Your steelman sounds genuinely convincing. A true advocate would recognize themselves in your writing.';
  } else if (total >= 35) {
    grade = 'B';
    feedback = 'Good attempt! You show real understanding of the position. Try adding more specific examples and emotional connection to push it higher.';
  } else if (total >= 25) {
    grade = 'C';
    feedback = 'Decent start, but your own perspective is showing through. Try to write as if you truly believe this position — what would keep you up at night about this issue?';
  } else if (total >= 15) {
    grade = 'D';
    feedback = 'Your bias is leaking through significantly. Instead of arguing the position, you\'re summarizing it from the outside. Step into the shoes of a true believer.';
  } else {
    grade = 'F';
    feedback = 'This reads more like a critique than a defense. Try to find the genuine moral concern behind this position and argue from that foundation.';
  }

  return { authenticity, charity, specificity, empathy, biasLeakage, total, grade, feedback };
}

export { buildSystemPrompt, buildUserPrompt, sanitizeInput, SYSTEM_PROMPT_BASE };
