import { useState, useEffect } from "react";
import { AIPromptHeader } from "@/components/ai-prompts/AIPromptHeader";
import { AIPromptManager } from "@/components/ai-prompts/AIPromptManager";

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
      <AIPromptHeader
        activeGenerationModel={activeGenerationModel}
        setActiveGenerationModel={setActiveGenerationModel}
      />
      <AIPromptManager />
    </div>
  );
};