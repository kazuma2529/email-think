import { GoogleGenAI, Type } from '@google/genai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

type Mode = 'new' | 'reply';
type Relationship = '上司' | '仲の良い上司' | '友達' | '親友' | '初対面' | '知り合い' | '知り合い以上友達未満';
type Tone = 'Soft' | 'Standard' | 'Short';

interface RewriteResult {
  type: Tone;
  text: string;
}

interface RequestBody {
  mode: Mode;
  draft: string;
  relationship: Relationship;
  receivedMessage?: string;
}

const SYSTEM_PROMPT = `あなたは次世代のチャットメッセージ最適化AI「NextMsg AI」です。ユーザーが入力した「ラフな下書き」を、指定された「相手との関係性」に合わせ、LINEなどのチャットツールに最適な形にリライトします。

【絶対遵守ルール】
1. 「お世話になっております」「お疲れ様です(社外や友人に対して)」「〜と存じます」などの形式的なビジネスメールの定型句は**絶対に**使用しないでください。
2. チャットツール(LINE等)でのやり取りを想定し、テンポが良く、画面上で読みやすい短めの文章にしてください。
3. 句読点(、。)は固くなりすぎないよう、適度にスペースや改行、絵文字、感嘆符(!、?)に置き換えるなど、現代のチャット文化に即した自然な表現にしてください。
4. 相手との「心の距離感(関係性)」を正確に反映してください。
5. 以下の3つのトーン(Soft, Standard, Short)で出力してください。
   - Soft (丁寧): 敬語は使うが、堅苦しくない柔らかい表現。相手への配慮が感じられる。
   - Standard (自然): その関係性における標準的な距離感。
   - Short (簡潔): 要件をスマートに伝える。冷たくならない程度の短さ。
6. 【返信モードの場合】相手からのメッセージのテンション、絵文字の有無、文体(長文か短文か)を解析し、それに同調(ミラーリング)しつつ、下書きの意図を伝える返信を作成してください。
7. 出力は必ず指定されたJSONスキーマに従ってください。`;

async function rewriteMessage(
  mode: Mode,
  draft: string,
  relationship: Relationship,
  receivedMessage?: string
): Promise<RewriteResult[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const ai = new GoogleGenAI({ apiKey });
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

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORSヘッダーを設定
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // OPTIONSリクエスト(プリフライト)への対応
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // POSTメソッドのみ許可
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { mode, draft, relationship, receivedMessage } = req.body as RequestBody;

    // バリデーション
    if (!mode || !draft || !relationship) {
      return res.status(400).json({ 
        error: 'Missing required fields: mode, draft, relationship' 
      });
    }

    const result = await rewriteMessage(mode, draft, relationship, receivedMessage);
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in rewrite handler:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
}
