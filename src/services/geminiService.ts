import { GoogleGenAI, Type } from '@google/genai';
import { Mode, Relationship, RewriteResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `あなたは次世代のチャットメッセージ最適化AI「NextMsg AI」です。ユーザーが入力した「ラフな下書き」を、指定された「相手との関係性」に合わせ、LINEなどのチャットツールに最適な形にリライトします。

【絶対遵守ルール】
1. 「お世話になっております」「お疲れ様です（社外や友人に対して）」「〜と存じます」などの形式的なビジネスメールの定型句は**絶対に**使用しないでください。
2. チャットツール（LINE等）でのやり取りを想定し、テンポが良く、画面上で読みやすい短めの文章にしてください。
3. 句読点（、。）は固くなりすぎないよう、適度にスペースや改行、絵文字、感嘆符（！、？）に置き換えるなど、現代のチャット文化に即した自然な表現にしてください。
4. 相手との「心の距離感（関係性）」を正確に反映してください。
5. 以下の3つのトーン（Soft, Standard, Short）で出力してください。
   - Soft (丁寧): 敬語は使うが、堅苦しくない柔らかい表現。相手への配慮が感じられる。
   - Standard (自然): その関係性における標準的な距離感。
   - Short (簡潔): 要件をスマートに伝える。冷たくならない程度の短さ。
6. 【返信モードの場合】相手からのメッセージのテンション、絵文字の有無、文体（長文か短文か）を解析し、それに同調（ミラーリング）しつつ、下書きの意図を伝える返信を作成してください。
7. 出力は必ず指定されたJSONスキーマに従ってください。`;

export async function rewriteMessage(
  mode: Mode,
  draft: string,
  relationship: Relationship,
  receivedMessage?: string
): Promise<RewriteResult[]> {
  const model = 'gemini-3.1-pro-preview';
  
  let prompt = `【関係性】: ${relationship}\n【下書き】: ${draft}`;
  if (mode === 'reply' && receivedMessage) {
    prompt = `【関係性】: ${relationship}\n【相手からのメッセージ】: ${receivedMessage}\n【返信の下書き】: ${draft}\n\n※相手のメッセージのテンションや絵文字の使い方に同調して返信を作成してください。`;
  }

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: {
              type: Type.STRING,
              description: 'Soft, Standard, or Short',
            },
            text: {
              type: Type.STRING,
              description: 'The rewritten message text',
            },
          },
          required: ['type', 'text'],
        },
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error('No response from AI');
  
  try {
    return JSON.parse(text) as RewriteResult[];
  } catch (e) {
    console.error('Failed to parse JSON response', text);
    throw new Error('Invalid response format');
  }
}
