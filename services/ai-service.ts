
import { GoogleGenAI } from "@google/genai";
import { Language, SemanticContext } from '../types';

const client = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Image Generation ---

/**
 * Uses Interactions API with 'response_modalities' for high-quality Lego art.
 */
export const generateLegoImage = async (cardTitle: string, cardDesc: string): Promise<string | null> => {
    try {
        const prompt = `Create a LEGO brick art image for the concept: "${cardTitle}" - ${cardDesc}. 
        The image should feature a central LEGO model built from colorful bricks, representing the ESG concept (Environmental, Social, or Governance).
        Style: Isometric view, 3D render, studio lighting, clean background, high detail LEGO texture.`;

        const interaction = await client.interactions.create({
            model: 'gemini-3-pro-image-preview',
            input: prompt,
            response_modalities: ['IMAGE']
        });

        // Iterate outputs to find image
        for (const output of interaction.outputs || []) {
            if (output.type === 'image') {
                return `data:image/png;base64,${output.data}`;
            }
        }
        return null;
    } catch (e) {
        console.error("Lego Gen Error", e);
        return null;
    }
};

// --- Text & Chat ---

export async function* streamChat(
    prompt: string, 
    language: Language, 
    systemInstruction?: string,
    knowledgeBase?: string[]
) {
    try {
        let finalInput = prompt;

        // If Knowledge Base is present, construct RAG Logic in prompt
        if (knowledgeBase && knowledgeBase.length > 0) {
            const kbContent = knowledgeBase.join('\n\n');
            const personaNameMatch = systemInstruction?.match(/You are (.*?)[.,]/) || systemInstruction?.match(/你是(.*?)[，。]/);
            const personaName = personaNameMatch ? personaNameMatch[1] : 'AI Assistant';

            finalInput = `
${systemInstruction || ''}

[KNOWLEDGE BASE ACTIVATED]
The user has provided the following specific knowledge context. You must prioritize this information.

--- START KNOWLEDGE BASE ---
${kbContent.substring(0, 100000)} 
--- END KNOWLEDGE BASE ---

[STRICT RESPONSE RULES]
1. First, search the "KNOWLEDGE BASE" above for the answer to the user's query.
2. If the answer is found within the Knowledge Base, answer clearly using that information.
3. If the specific event or information is NOT found in the Knowledge Base:
   - You MUST explicitly state: "抱歉，知識庫中未找到關於此事件的具體資訊。" (Sorry, specific information about this event was not found in the knowledge base.)
   - THEN, proceed to offer help or answer generally based on your persona as ${personaName}.

User Query: ${prompt}
`;
        } else if (systemInstruction) {
            finalInput = `${systemInstruction}\n\nUser Query: ${prompt}`;
        }

        const stream = await client.interactions.create({
            model: 'gemini-2.5-flash',
            input: finalInput,
            stream: true
        });

        for await (const chunk of stream) {
            if (chunk.event_type === 'content.delta') {
                if (chunk.delta.type === 'text') {
                    yield chunk.delta.text;
                }
            }
        }
    } catch (e) {
        console.error("Stream Chat Error", e);
        yield "System: Connection interrupted.";
    }
}

// --- Analysis & Insights ---

export const analyzeDataAnomaly = async (label: string, value: string | number, baseline: string, context: string, language: Language) => {
    // Mock simulation for AI trigger interaction
    return Promise.resolve();
};

export const performLocalRAG = async (query: string, language: Language) => {
    const prompt = `Answer the following query using available knowledge. Query: ${query}`;
    
    // Interactions API with Google Search Tool
    const interaction = await client.interactions.create({
        model: 'gemini-2.5-flash',
        input: prompt,
        tools: [{ type: 'google_search' }]
    });

    const textOutput = interaction.outputs?.find(o => o.type === 'text');
    
    return {
        text: textOutput?.text || "No relevant information found.",
        sources: [] // Interactions API search sources structure differs, keeping empty for now or needing parsing from 'groundingMetadata' if available on output
    };
};

export const performWebSearch = performLocalRAG; // Alias for Business Intelligence

export const quantizeData = async (input: string, language: Language) => {
    // Mocking quantum node generation to save tokens/latency in demo
    return [
        { id: `q-${Date.now()}-1`, atom: 'Scope 1', vector: ['Direct', 'Fuel'], weight: 0.9, connections: [] },
        { id: `q-${Date.now()}-2`, atom: 'Scope 2', vector: ['Indirect', 'Electricity'], weight: 0.85, connections: [] },
        { id: `q-${Date.now()}-3`, atom: 'Scope 3', vector: ['Value Chain', 'Upstream'], weight: 0.7, connections: [] }
    ];
};

export const inferSemanticContext = async (query: string, language: Language): Promise<SemanticContext> => {
    return {
        intent: 'exploration',
        keywords: query.split(' ').filter(w => w.length > 3),
        requiredConfidence: 0.8
    };
};

export const generateAgentDebate = async (topic: string, language: Language) => {
    const prompt = `Simulate a debate between a CSO (Chief Sustainability Officer) and a CFO (Chief Financial Officer) regarding: "${topic}".
    The debate should highlight the conflict between cost and sustainability.
    Language: ${language}`;

    const schema = {
        type: 'ARRAY',
        items: {
            type: 'OBJECT',
            properties: {
                role: { type: 'STRING', enum: ['CSO', 'CFO'] },
                text: { type: 'STRING' }
            },
            required: ['role', 'text']
        }
    };

    const interaction = await client.interactions.create({
        model: 'gemini-2.5-flash',
        input: prompt,
        response_format: schema
    });
    
    try {
        const text = interaction.outputs?.[0]?.text;
        return text ? JSON.parse(text) : [{ role: 'CSO', text: 'Analysis failed.' }];
    } catch {
        return [{ role: 'CSO', text: 'Analysis failed.' }];
    }
};

// --- Report Generation ---

export const generateReportChapter = async (title: string, template: string, example: string, context: any, language: Language) => {
    const prompt = `Write a sustainability report chapter titled "${title}".
    Context: ${JSON.stringify(context)}
    Template: ${template}
    Language: ${language}
    Tone: Professional, Data-driven, GRI Compliant.`;
    
    const interaction = await client.interactions.create({
        model: 'gemini-2.5-flash',
        input: prompt
    });
    
    const textOutput = interaction.outputs?.find(o => o.type === 'text');
    return textOutput?.text || "";
};

export const auditReportContent = async (title: string, content: string, standards: string, language: Language) => {
    const prompt = `Audit the following report content against ${standards}.
    Title: ${title}
    Content: ${content}
    Provide a brief audit summary and list missing requirements in Markdown.`;
    
    const interaction = await client.interactions.create({
        model: 'gemini-2.5-flash',
        input: prompt
    });
    
    const textOutput = interaction.outputs?.find(o => o.type === 'text');
    return textOutput?.text || "Audit complete.";
};

// --- Tools & Utilities ---

export const performMapQuery = async (query: string, language: Language) => {
    const interaction = await client.interactions.create({
        model: 'gemini-2.5-flash',
        input: `Find information and location details for: ${query}`,
        tools: [{ type: 'google_search' }]
    });
    
    const textOutput = interaction.outputs?.find(o => o.type === 'text');
    return {
        text: textOutput?.text || "Location details not found.",
        sources: []
    };
};

export const predictFutureTrends = async (metric: string, history: number[], context: string, language: Language) => {
    return Promise.resolve();
};

const fileToPart = (file: File): Promise<string> => new Promise(resolve => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
});

export const verifyQuestImage = async (questTitle: string, questDesc: string, file: File, language: Language) => {
    try {
        const base64Data = await fileToPart(file);
        const prompt = `Verify if this image satisfies the quest: "${questTitle}" - ${questDesc}.`;
        
        const schema = {
            type: 'OBJECT',
            properties: {
                success: { type: 'BOOLEAN' },
                reason: { type: 'STRING' }
            },
            required: ['success', 'reason']
        };

        const interaction = await client.interactions.create({
            model: 'gemini-2.5-flash',
            input: [
                { type: 'image', data: base64Data, mime_type: file.type },
                { type: 'text', text: prompt }
            ],
            response_format: schema
        });

        const text = interaction.outputs?.[0]?.text;
        return text ? JSON.parse(text) : { success: false, reason: "AI could not verify." };
    } catch (e) {
        return { success: false, reason: "Verification error." };
    }
};

export const generateEsgQuiz = async (term: string, definition: string, language: Language) => {
    const prompt = `Create a multiple choice quiz question for the ESG term: "${term}" (${definition}).
    Language: ${language}`;
    
    const schema = {
        type: 'OBJECT',
        properties: {
            question: { type: 'STRING' },
            options: { type: 'ARRAY', items: { type: 'STRING' } },
            correctIndex: { type: 'INTEGER' },
            explanation: { type: 'STRING' }
        },
        required: ['question', 'options', 'correctIndex', 'explanation']
    };
    
    const interaction = await client.interactions.create({
        model: 'gemini-2.5-flash',
        input: prompt,
        response_format: schema
    });
    
    const text = interaction.outputs?.[0]?.text;
    return text ? JSON.parse(text) : {};
};
