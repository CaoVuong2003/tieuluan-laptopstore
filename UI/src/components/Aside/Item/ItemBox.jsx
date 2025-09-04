const ItemBox = ({ title, items, onSelect, selected }) => {

  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">{title}</h3>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect && onSelect(item.id)}
            className={`p-2 rounded-md border text-left ${
              selected === item.id
                ? "bg-blue-500 text-white border-blue-500"
                : "hover:bg-gray-100"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ItemBox;
