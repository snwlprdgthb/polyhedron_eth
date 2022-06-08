import { toast } from "react-toastify";

export const toastCreator = promise => {
  toast.promise(promise, {
    pending: {
      render() {
        return <div>Waiting to...</div>;
      },
      icon: false
    },
    success: {
      render({ data }) {
        return (
          <div>
            <p className="mb-2 text-lg text-green-400 font-bold">Success!</p>
            <p className="mb-2">{`TX: ${data.transactionHash.slice(
              0,
              19
            )}...`}</p>
            <a
              target="_blank"
              href={`https://ropsten.etherscan.io/tx/${data.transactionHash}`}
            >
              See on etherscan
            </a>
          </div>
        );
      },

      icon: "🟢"
    },
    error: {
      render({ data }) {
        return (
          <div className="p-3">
            <div className="text-red-500 text-xl font-bold">
              <span>Error</span>
            </div>
            <div>{data.message} </div>
          </div>
        );
      }
    },
    closeButton: true
  });
};
