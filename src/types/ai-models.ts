
export type SupportedAIModel = 'claude-3-opus-20240229' | 'gpt-4o';

export interface AIModelConfig {
  name: SupportedAIModel;
  apiEndpoint: string;
  maxTokens: number;
  requiresUserPrompt: boolean;
}

export const AI_MODEL_CONFIGS: Record<SupportedAIModel, AIModelConfig> = {
  'claude-3-opus-20240229': {
    name: 'claude-3-opus-20240229',
    apiEndpoint: 'https://api.anthropic.com/v1/messages',
    maxTokens: 1024,
    requiresUserPrompt: false,
  },
  'gpt-4o': {
    name: 'gpt-4o',
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    maxTokens: 1024,
    requiresUserPrompt: true,
  },
};

export const isValidAIModel = (model: string): model is SupportedAIModel => {
  return model in AI_MODEL_CONFIGS;
};
