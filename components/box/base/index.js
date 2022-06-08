export const STATE_OBJ = {
  0: "Purchased",
  1: "Activated",
  2: "Deactivated"
};

function Item({ title, value, gray }) {
  return (
    <div
      className={` ${gray &&
        "bg-gray-900"} p-3 bg-black border-b border-white"`}
    >
      <div>
        <div className="text-gray-600">{title}</div>
        <div className="break-words">{value}</div>
      </div>
    </div>
  );
}

export default function Box({ item, index, children }) {
  return (
    <>
      <div
        className={`flex font-abeezee text-white  border-4 mb-6   rounded-xl flex-col`}
      >
        <Item gray={true} title="Hash" value={item.hashItem} />
        <Item title="Owned Item Id" value={item.id} />
        <Item gray={true} title="Proof" value={item.proof} />
        <Item title="Owned" value={item.owner} />
        <Item gray={true} title="State" value={STATE_OBJ[item.state]} />

        {children}
      </div>
    </>
  );
}
