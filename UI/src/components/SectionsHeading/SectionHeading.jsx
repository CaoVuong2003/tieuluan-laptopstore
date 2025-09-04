const SectionHeading = ({ title }) => {
  return (
    <div className="flex items-center gap-2 px-2 md:px-4 my-3">
      <div className="w-1 h-5 bg-black rounded"></div>
      <p className="text-sm md:text-base font-semibold text-gray-800">
        {title}
      </p>
    </div>
  );
};

export default SectionHeading;
