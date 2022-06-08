const DEF_STATE = {
  purchased: "orange",
  activated: "green",
  deactivated: "red"
};

export default function activityPanel({ state = "deactivated", children }) {
  return (
    <div className="p-3">
      <div
        className={`w-2/3 items-center flex justify-between bg-${DEF_STATE[state]}-100 sleading-none text-purple-600 rounded-lg p-2 shadow text-teal text-md`}
      >
        <span className="inline-flex px-2">{children} </span>

        {/* <span className="inline-flex  cursor-pointer text-purple hover:text-red rounded-full h-6 px-3 justify-center items-center">
          x
        </span> */}
      </div>
    </div>
  );
}
