export type Mode = 'new' | 'reply';
export type Relationship = '上司' | '仲の良い上司' | '友達' | '親友' | '初対面' | '知り合い' | '知り合い以上友達未満';
export type Tone = 'Soft' | 'Standard' | 'Short';

export interface RewriteResult {
  type: Tone;
  text: string;
}
