
import { useState, useEffect } from "react";
import { AIPromptHeader } from "@/components/ai-prompts/AIPromptHeader";
import { AIPromptManager } from "@/components/ai-prompts/AIPromptManager";
import { PageHeaderWithModel } from "@/components/shared/PageHeaderWithModel";

export const EditAIPrompts = () => {
  const [activeGenerationModel, setActiveGenerationModel] = useState<string>(() => {
    const saved = localStorage.getItem("activeGenerationModel");
    return saved || "claude-3-opus-20240229";
  });

  useEffect(() => {
    localStorage.setItem("activeGenerationModel", activeGenerationModel);
  }, [activeGenerationModel]);

  return (
    <div className="container mx-auto py-8">
      <PageHeaderWithModel activeModel={activeGenerationModel} title="Edit AI Prompts" />
      <div className="pt-16">
        <AIPromptHeader
          activeGenerationModel={activeGenerationModel}
          setActiveGenerationModel={setActiveGenerationModel}
        />
        <AIPromptManager activeGenerationModel={activeGenerationModel} />
      </div>
    </div>
  );
};
