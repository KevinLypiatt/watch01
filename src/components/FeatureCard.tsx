interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

export const FeatureCard = ({ title, description, icon }: FeatureCardProps) => {
  return (
    <div className="group p-8 rounded-2xl bg-soft-white border border-gray-100 hover:border-gray-200 transition-all duration-300">
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-accent-light text-accent-dark mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-medium text-accent-dark mb-3">{title}</h3>
      <p className="text-accent">{description}</p>
    </div>
  );
};