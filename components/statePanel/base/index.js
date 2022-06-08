const DEF_STATE = {
  purchased: "bg-yellow-600",
  activated: "bg-green-600",
  deactivated: "bg-red-600"
};

export default function statePanel(state) {
  const current = DEF_STATE[state.toLowerCase()];

  return (
    <div className={`p-2  rounded-md text-xs ${current}`}>
      <span>{state}</span>
    </div>
  );
}
