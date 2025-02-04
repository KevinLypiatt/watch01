
export type SupportedAIModel = 'claude-3-opus-20240229' | 'gpt-4o';

export interface AIModelConfig {
  name: SupportedAIModel;
  apiEndpoint: string;
  maxTokens: number;
  requiresUserPrompt: boolean;
  promptFormat: 'single' | 'split';
  headers: (apiKey: string) => Record<string, string>;
}

export const AI_MODEL_CONFIGS: Record<SupportedAIModel, AIModelConfig> = {
  'claude-3-opus-20240229': {
    name: 'claude-3-opus-20240229',
    apiEndpoint: 'https://api.anthropic.com/v1/messages',
    maxTokens: 1024,
    requiresUserPrompt: false,
    promptFormat: 'single',
    headers: (apiKey: string) => ({
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    }),
  },
  'gpt-4o': {
    name: 'gpt-4o',
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    maxTokens: 1024,
    requiresUserPrompt: true,
    promptFormat: 'split',
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }),
  },
};

export const isValidAIModel = (model: string): model is SupportedAIModel => {
  return model in AI_MODEL_CONFIGS;
};

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GenerationOptions {
  systemPrompt: string;
  styleGuide: string;
  userPrompt?: string;
  data: Record<string, any>;
}

export const formatPrompt = (
  modelConfig: AIModelConfig,
  options: GenerationOptions
): AIMessage[] | string => {
  const { systemPrompt, styleGuide, userPrompt, data } = options;

  if (modelConfig.promptFormat === 'single') {
    return `${systemPrompt}\n\nStyle Guide:\n${styleGuide}\n\nData:\n${JSON.stringify(data, null, 2)}`;
  }

  return [
    { 
      role: 'system', 
      content: `${systemPrompt}\n\nStyle Guide:\n${styleGuide}` 
    },
    {
      role: 'user',
      content: `${userPrompt || ''}\n\nData:\n${JSON.stringify(data, null, 2)}`
    }
  ];
};
