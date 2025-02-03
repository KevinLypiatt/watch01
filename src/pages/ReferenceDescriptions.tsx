import { useState } from "react";
import { PageHeaderWithModel } from "@/components/shared/PageHeaderWithModel";
import { ReferenceDescriptionHeader } from "@/components/reference-descriptions/ReferenceDescriptionHeader";
import { ReferenceDescriptionTable } from "@/components/reference-descriptions/ReferenceDescriptionTable";
import { useGenerateDescriptions } from "@/hooks/useGenerateDescriptions";

const ReferenceDescriptions = () => {
  const { isGenerating, handleGenerateAll } = useGenerateDescriptions();

  return (
    <div className="container mx-auto py-8">
      <PageHeaderWithModel title="Reference Descriptions" />
      <div className="pt-16">
        <ReferenceDescriptionHeader
          isGenerating={isGenerating}
          handleGenerateAll={handleGenerateAll}
        />
        <ReferenceDescriptionTable />
      </div>
    </div>
  );
};

export default ReferenceDescriptions;