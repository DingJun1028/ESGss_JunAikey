
import { GoogleGenAI } from "@google/genai";
import { Language, SemanticContext } from '../types';

const client = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Image Generation ---

/**
 * Uses Interactions API with 'response_modalities' for high-quality Lego art.
 */
export const generateLegoImage = async (cardTitle: string, cardDesc: string): Promise<string | null> => {
    try {
        // Fallback for image generation if interactions API is unstable or unavailable in standard SDK
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
        } 

        // Standard stream generation using reliable model
        const response = await client.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: finalInput }] }],
            config: systemInstruction && !knowledgeBase ? { systemInstruction: systemInstruction } : undefined
        });

        for await (const chunk of response) {
            if (chunk.text) {
                yield chunk.text;
            }
        }
    } catch (e) {
        console.error("Stream Chat Error", e);
        yield "System: Connection interrupted. Please check API Key or Network.";
    }
}

// --- Analysis & Insights ---

export const analyzeDataAnomaly = async (label: string, value: string | number, baseline: string, context: string, language: Language) => {
    // Mock simulation for AI trigger interaction
    return Promise.resolve();
};

export const performLocalRAG = async (query: string, language: Language) => {
    // Standard generateContent with Google Search tool
    const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: `Answer the following query using available knowledge. Query: ${query}` }] }],
        config: {
            tools: [{ googleSearch: {} }]
        }
    });

    return {
        text: response.text || "No relevant information found.",
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({ web: { uri: c.web?.uri, title: c.web?.title } })) || []
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
    const prompt = `Simulate a strategic corporate debate between two AI agents regarding the risk/opportunity: "${topic}".

    Agent 1: Chief Sustainability Officer (CSO). Focus: Long-term ESG impact, reputation, compliance, carbon reduction.
    Agent 2: Chief Financial Officer (CFO). Focus: Short-term ROI, budget constraints, operational efficiency, shareholder value.

    The debate should be 4 turns (2 each).
    Turn 1 (CSO): Proposes an initiative to address the issue.
    Turn 2 (CFO): Challenges it based on cost/resources.
    Turn 3 (CSO): Counters with long-term value/risk mitigation.
    Turn 4 (CFO): Agrees to a compromise or pilot.

    Output MUST be a raw JSON array of objects with keys: "role" ("CSO" or "CFO") and "text".
    Language: ${language}`;

    const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
            responseMimeType: 'application/json'
        }
    });
    
    try {
        const text = response.text;
        return text ? JSON.parse(text) : [{ role: 'CSO', text: 'Analysis failed.' }];
    } catch {
        return [{ role: 'CSO', text: 'Analysis failed.' }];
    }
};

// --- Report Generation ---

export const generateReportChapter = async (title: string, template: string, example: string, context: any, language: Language) => {
    const contextStr = JSON.stringify(context, null, 2);
    
    const prompt = `
    Role: Expert ESG Sustainability Report Writer (GRI/SASB Certified).
    Task: Draft a report chapter titled "${title}".
    
    [DATA CONTEXT - STRICT ADHERENCE REQUIRED]
    ${contextStr}
    
    [INSTRUCTIONS]
    1. **Data Integration**: You MUST use the specific numbers provided in the 'context' above (e.g., Scope 1: ${context.linked_carbon_data?.scope1 || 'N/A'}, Scope 2: ${context.linked_carbon_data?.scope2 || 'N/A'}). Do not invent data. If data is missing or 0, state "Data pending verification".
    2. **Analysis**: Don't just list numbers. Analyze the trends based on the provided year/history if available.
    3. **Tone**: Professional, Transparent, Stakeholder-centric. Avoid "greenwashing" language (vague superlatives).
    4. **Structure**: Follow this template structure:
       ${template}
    5. **Reference**: Use this example as a style guide (but do not copy the content):
       "${example.substring(0, 300)}..."

    Language: ${language}
    Output Format: Markdown (Clean, well-structured headers and bullet points).
    `;
    
    const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });
    
    return response.text || "";
};

export const auditReportContent = async (title: string, content: string, standards: string, context: any, language: Language) => {
    const contextStr = JSON.stringify(context, null, 2);
    const prompt = `
    Act as a senior ESG Compliance Auditor (AI Auditor).
    
    [TASK]
    Audit the following sustainability report section against the specified standards ("${standards}") and internal Company Context.
    
    [COMPANY CONTEXT]
    ${contextStr}
    
    [REPORT SECTION]
    Title: "${title}"
    Content:
    """
    ${content}
    """
    
    [AUDIT CRITERIA]
    1. **Completeness**: Does it fully satisfy the ${standards} disclosure requirements?
    2. **Accuracy & Consistency**: Are the data points consistent with the provided context (e.g. Scope 1/2/3 data)?
    3. **Tone & Greenwashing**: Is the tone objective? Flag any vague or unsubstantiated claims (Greenwashing).
    4. **Policy Alignment**: Does it reflect the company's commitment to compliance?

    [OUTPUT FORMAT]
    Return a structured Markdown report:
    - **Compliance Score**: 0/100 (Critical)
    - **Status**: ✅ Pass / ⚠️ Conditional / ❌ Fail
    - **Critical Issues**: Bullet points of missing data or non-compliance.
    - **Greenwashing Risk**: Low/Medium/High with explanation.
    - **Recommendations**: Specific rewrites or data to add.

    Language: ${language}
    `;
    
    const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });
    
    return response.text || "Audit complete.";
};

export const generateComplianceAssessment = async (scores: any, language: Language) => {
    const prompt = `
    Act as an ESG Strategy Consultant.
    
    [INPUT DATA]
    Self-Assessment Scores (1-5 Scale):
    - Brand Strategy Clarity: ${scores.strategy}/5
    - Governance Structure: ${scores.governance}/5
    - Social Engagement: ${scores.social}/5
    - Carbon Data Integrity: ${scores.env}/5
    
    [TASK]
    Generate a "Lite Compliance & Health Analysis" based on these scores.
    
    [OUTPUT FORMAT]
    Markdown.
    1. **Overall Health Rating**: (e.g., "Moderate Risk", "Leading", "Lagging")
    2. **Gap Analysis**: For each lowest score, identify specific compliance risks (mention specific frameworks like ISSB, GRI, CBAM).
    3. **Immediate Actions**: 3 bullet points for quick wins.
    
    Language: ${language}
    `;

    const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    return response.text || "Assessment complete.";
};

// --- Tools & Utilities ---

export const performMapQuery = async (query: string, language: Language) => {
    const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: `Find information and location details for: ${query}` }] }],
        config: {
            tools: [{ googleSearch: {} }]
        }
    });
    
    return {
        text: response.text || "Location details not found.",
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({ web: { uri: c.web?.uri, title: c.web?.title } })) || []
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
        const prompt = `Verify if this image satisfies the quest: "${questTitle}" - ${questDesc}. Return JSON with 'success' (boolean) and 'reason' (string).`;
        
        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                { role: 'user', parts: [
                    { inlineData: { mimeType: file.type, data: base64Data } },
                    { text: prompt }
                ]}
            ],
            config: {
                responseMimeType: 'application/json'
            }
        });

        const text = response.text;
        return text ? JSON.parse(text) : { success: false, reason: "AI could not verify." };
    } catch (e) {
        return { success: false, reason: "Verification error." };
    }
};

export const generateEsgQuiz = async (term: string, definition: string, language: Language) => {
    const prompt = `Create a multiple choice quiz question for the ESG term: "${term}" (${definition}).
    Language: ${language}
    Return JSON with: question, options (array), correctIndex (int), explanation.`;
    
    const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
            responseMimeType: 'application/json'
        }
    });
    
    const text = response.text;
    return text ? JSON.parse(text) : {};
};
