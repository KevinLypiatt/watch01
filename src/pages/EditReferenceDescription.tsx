import { useParams } from "react-router-dom";
import { PageHeaderWithModel } from "@/components/shared/PageHeaderWithModel";
import { ReferenceDescriptionForm } from "@/components/reference-descriptions/ReferenceDescriptionForm";

const EditReferenceDescription = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeaderWithModel title="Edit Reference Description" />
      <div className="container mx-auto pt-24 pb-12">
        <ReferenceDescriptionForm id={id} />
      </div>
    </div>
  );
};

export default EditReferenceDescription;