
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { ReferenceData } from './types.ts';

interface AIPrompt {
  name: string;
  content: string;
}

export async function getAIPrompts(supabaseClient: any, activeModel: string) {
  const { data: prompts, error: promptsError } = await supabaseClient
    .from('ai_prompts')
    .select('*')
    .eq('purpose', 'reference')
    .eq('ai_model', activeModel);

  if (promptsError) {
    throw new Error(`Error fetching prompts: ${promptsError.message}`);
  }

  return prompts as AIPrompt[];
}

export async function generateWithAI(
  modelConfig: any,
  apiKey: string,
  systemPrompt: string,
  styleGuide: string,
  userPrompt: string | undefined,
  reference: ReferenceData
) {
  const prompt = modelConfig.promptFormat === 'single'
    ? `${systemPrompt}\n\nStyle Guide:\n${styleGuide}\n\nBrand: ${reference.brand}\nReference Name: ${reference.reference_name}`
    : [
        { 
          role: 'system', 
          content: `${systemPrompt}\n\nStyle Guide:\n${styleGuide}` 
        },
        {
          role: 'user',
          content: `${userPrompt}\n\nBrand: ${reference.brand}\nReference Name: ${reference.reference_name}`
        }
      ];

  console.log('Sending request to AI service:', {
    endpoint: modelConfig.apiEndpoint,
    model: modelConfig.name,
    promptFormat: modelConfig.promptFormat,
  });

  const response = await fetch(modelConfig.apiEndpoint, {
    method: 'POST',
    headers: modelConfig.headers(apiKey),
    body: JSON.stringify(
      modelConfig.promptFormat === 'single'
        ? {
            model: modelConfig.name,
            max_tokens: modelConfig.maxTokens,
            messages: [{ role: 'user', content: prompt as string }],
          }
        : {
            model: modelConfig.name,
            max_tokens: modelConfig.maxTokens,
            messages: prompt,
          }
    ),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('AI API error:', errorData);
    throw new Error(`AI API error: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  console.log('AI response received:', data);
  
  return modelConfig.name === 'claude-3-opus-20240229'
    ? data.content[0].text
    : data.choices[0].message.content;
}
