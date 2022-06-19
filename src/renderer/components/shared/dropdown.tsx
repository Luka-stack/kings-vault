interface DropDownProps {
  label: string;
  option: string;
  options: string[];
  setOption: (option: string) => void;
  width?: string;
}

const DropDown: React.FC<DropDownProps> = ({
  label,
  option,
  options,
  setOption,
  width,
}) => {
  const generatedOptions = options.map((option) => (
    <li
      className="px-3 hover:bg-ksv-gray-300 py-0.5 rounded-lg"
      key={option}
      onClick={() => setOption(option)}
    >
      {option}
    </li>
  ));

  return (
    <div
      className={`relative px-3 py-0.5 mr-3 text-sm text-white rounded-full cursor-pointer ${
        width ? width : 'w-max'
      } bg-ksv-gray-500 hover:bg-ksv-gray-300 ksv--dropdown`}
    >
      {`${label}: ${option}`}
      <div className="absolute left-0 hidden w-full ksv--dropdown-item">
        <ul className="py-1 mt-2 text-sm text-right text-white rounded-lg bg-ksv-gray-500 ">
          {generatedOptions}
        </ul>
      </div>
    </div>
  );
};

export default DropDown;
