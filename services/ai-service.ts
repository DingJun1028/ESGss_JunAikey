import { GoogleGenAI, Type } from "@google/genai";
import { Language, SemanticContext, UniversalTag } from '../types';

const client = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Text & Chat ---
export async function* streamChat(
    prompt: string, 
    language: Language, 
    systemInstruction?: string,
    knowledgeBase?: string[]
) {
    try {
        let finalInput = prompt;
        if (knowledgeBase && knowledgeBase.length > 0) {
            const kbContent = knowledgeBase.join('\n\n');
            finalInput = `${systemInstruction || ''}\n\n[KNOWLEDGE BASE]\n${kbContent}\n\nUser Query: ${prompt}`;
        } 
        const response = await client.models.generateContentStream({
            model: 'gemini-3-flash-preview',
            contents: [{ role: 'user', parts: [{ text: finalInput }] }],
            config: systemInstruction && !knowledgeBase ? { systemInstruction: systemInstruction } : undefined
        });
        for await (const chunk of response) {
            if (chunk.text) yield chunk.text;
        }
    } catch (e) {
        yield "System: Connection interrupted.";
    }
}

/**
 * 萬能筆記 AI 改寫服務 - 工程模式 (Engineering Mode)
 */
export const rewriteNote = async (
    content: string, 
    mode: 'expand' | 'summarize' | 'condense' | 'actionable' | 'refine' | 'format', 
    language: Language
): Promise<{ text: string, reasoning: string }> => {
    const isZh = language === 'zh-TW';
    
    const taskSpecifics = {
        expand: isZh ? "擴充為具備目標、策略與執行步驟的完整 ESG 計畫" : "Expand into a full ESG plan with objectives and steps",
        summarize: isZh ? "提取核心洞察與 3-5 個關鍵重點" : "Extract core insights and 3-5 key points",
        condense: isZh ? "縮減至最精簡狀態，保留關鍵數字" : "Condense to minimum state, keep key numbers",
        actionable: isZh ? "轉換為具體待辦清單，以動詞開頭" : "Convert to action checklist starting with verbs",
        refine: isZh ? "潤飾文字以符合 GRI 專業嚴謹語氣" : "Refine tone to professional GRI standards",
        format: isZh ? "優化結構排版：使用標題、列表、粗體與 Markdown 表格強化數據可讀性" : "Optimize layout: Use headings, lists, bolding, and Markdown tables to enhance data readability"
    };

    const prompt = `
<context>
You are an Elite ESG AI Architect specializing in "Value-Creating ESG". 
Current Language: ${isZh ? 'Traditional Chinese (zh-TW)' : 'English (en-US)'}
Tone: Professional, Data-Driven, Analytical.
</context>

<task>
Perform a [${mode.toUpperCase()}] transformation on the provided ESG note.
Specific Goal: ${taskSpecifics[mode]}
</task>

<constraints>
1. ALWAYS provide your reasoning process first inside a <reasoning> tag.
2. The final result must be inside a <result> tag.
3. If mode is 'format', use clear hierarchy (H1, H2, H3), bullet points for lists, and Markdown tables for any multi-dimensional data comparisons.
4. DO NOT include any greetings or conversational filler.
5. Maintain technical accuracy regarding ESG standards (GRI, SASB, TCFD).
</constraints>

<input_content>
${content}
</input_content>
`;

    try {
        const response = await client.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: { temperature: 1.0 }
        });
        
        const output = response.text || "";
        const reasoningMatch = output.match(/<reasoning>([\s\S]*?)<\/reasoning>/);
        const resultMatch = output.match(/<result>([\s\S]*?)<\/result>/);
        
        return {
            text: resultMatch ? resultMatch[1].trim() : output,
            reasoning: reasoningMatch ? reasoningMatch[1].trim() : "Direct transformation applied."
        };
    } catch (e) {
        return { text: content, reasoning: "Error connecting to AIOS Kernel." };
    }
};

/**
 * AI Tag Suggestion Service
 * Analyzes content and matches it against an existing library of Universal Tags
 * or suggests new keyword-based tags.
 */
export const suggestUniversalTags = async (
    content: string, 
    existingTags: UniversalTag[], 
    language: Language
): Promise<{ matchedTagIds: string[], suggestedNewTags: string[] }> => {
    const isZh = language === 'zh-TW';
    const tagLibraryStr = JSON.stringify(existingTags.map(t => ({ id: t.id, label: isZh ? t.labelZh : t.labelEn })));

    const prompt = `
<context>
You are an ESG Taxonomy Specialist. You analyze technical notes to categorize them using a specific tag library.
</context>

<task>
1. Identify which existing tags from the library below strictly apply to the content.
2. If the content contains important ESG keywords NOT in the library, suggest up to 3 new simple tags.
</task>

<library>
${tagLibraryStr}
</library>

<input_content>
${content}
</input_content>

<constraints>
- Output MUST be JSON.
- matchedTagIds: Array of IDs from the library.
- suggestedNewTags: Array of strings (new keywords).
- Be conservative with matchedTagIds; only include highly relevant ones.
</constraints>
`;

    try {
        const response = await client.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: { responseMimeType: "application/json" }
        });
        
        const result = JSON.parse(response.text || "{}");
        return {
            matchedTagIds: result.matchedTagIds || [],
            suggestedNewTags: result.suggestedNewTags || []
        };
    } catch (e) {
        return { matchedTagIds: [], suggestedNewTags: [] };
    }
};

/**
 * 萬能知識王 - 工程化挑戰生成 (Engineering Mode Quiz)
 */
export const generateEngineeringChallenge = async (contextNotes: string, language: Language) => {
    const isZh = language === 'zh-TW';
    const prompt = `
<context>
You are the "Knowledge King" Proctor. You design rigorous ESG reasoning challenges.
Context provided by user's current notes: ${contextNotes}
</context>

<task>
Generate a high-order reasoning multiple-choice question based on the context.
The question must test the logic of ESG implementation, not just definitions.
</task>

<constraints>
1. Format: Output MUST be a single JSON block.
2. Include "reasoning_path" explaining the logic of the question.
3. Language: ${isZh ? 'Traditional Chinese' : 'English'}.
</constraints>

<schema>
{
  "reasoning_path": "String (Detailed logic chain)",
  "question": "String",
  "options": ["A", "B", "C", "D"],
  "correctIndex": Number (0-3),
  "technical_explanation": "String (Post-answer reasoning)"
}
</schema>
`;

    try {
        const response = await client.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: { responseMimeType: "application/json", temperature: 1.0 }
        });
        return JSON.parse(response.text || "{}");
    } catch (e) {
        return { 
            question: isZh ? "範疇 3 排放通常占企業總排放的多少百分比？" : "Scope 3 usually accounts for what % of total emissions?",
            options: ["10-20%", "40-50%", "70-90%", "100%"],
            correctIndex: 2,
            technical_explanation: "Value chain emissions are typically the largest contributor."
        };
    }
};

export const extractNoteMetadata = async (content: string, language: Language): Promise<{ summary: string; tags: string[] }> => {
    const isZh = language === 'zh-TW';
    const prompt = `
<task>Analyze technical content and output JSON metadata.</task>
<schema>{"summary": "String", "tags": ["String"]}</schema>
<input>${content}</input>
`;

    try {
        const response = await client.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: { responseMimeType: "application/json" }
        });
        return JSON.parse(response.text || "{}");
    } catch (e) {
        return { summary: "Note processed.", tags: ["ESG"] };
    }
};

export const performLocalRAG = async (query: string, language: Language) => {
    const response = await client.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: query }] }],
        config: { tools: [{ googleSearch: {} }] }
    });
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => chunk.web).filter(Boolean) || [];
    return { text: response.text || "", sources };
};

export const generateAgentDebate = async (topic: string, language: Language) => {
    const response = await client.models.generateContent({ 
        model: 'gemini-3-flash-preview', 
        contents: [{ role: 'user', parts: [{ text: `Generate debate between CSO/CFO about ${topic}. Return JSON array.` }] }], 
        config: { responseMimeType: 'application/json' } 
    });
    try { return JSON.parse(response.text || "[]"); } catch (e) { return []; }
};

export const generateEsgQuiz = async (term: string, definition: string, language: Language) => {
    const response = await client.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: `Quiz about ${term}. JSON format.` }] }],
        config: { responseMimeType: "application/json" }
    });
    try { return JSON.parse(response.text || "{}"); } catch (e) { return {}; }
};

export const generateLegoImage = async (title: string, description: string) => {
    try {
        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: [{ parts: [{ text: `3D Lego model: ${title}. ${description}` }] }],
        });
        for (const part of response.candidates[0].content.parts) { if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`; }
        return null;
    } catch (e) { return null; }
};

export const generateReportChapter = async (title: string, template: string, example: string, context: any, language: Language) => "";
export const auditReportContent = async (title: string, content: string, standards: string, context: any, language: Language) => "";
export const generateComplianceAssessment = async (scores: any, language: Language) => "";
export const performMapQuery = async (query: string, language: Language) => ({ text: "", sources: [] });
export const predictFutureTrends = async (metric: string, history: number[], context: string, language: Language) => Promise.resolve();
export const verifyQuestImage = async (questTitle: string, questDesc: string, file: File, language: Language) => ({ success: true, reason: "" });
export const performWebSearch = performLocalRAG;
export const quantizeData = async (input: string, language: Language) => [{ id: `q-1`, atom: 'Scope 1', vector: ['Direct'], weight: 0.9, connections: [] }];
export const inferSemanticContext = async (query: string, language: Language): Promise<SemanticContext> => ({ intent: 'exploration', keywords: [], requiredConfidence: 0.8 });
