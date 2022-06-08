import { useState, useEffect } from "react";
import { useEthPrice } from "@components/hooks/useEthPrice";

const defaultOrder = {
  price: "",
  email: "",
  repeatEmail: ""
};

export default function Modal({ item, onClose, purchaseItem, isNewPurchase }) {
  const [showModal, setShowModal] = useState(false);
  const [order, setOrder] = useState(defaultOrder);
  const [enablePrice, setEnablePrice] = useState(false);

  const { eth } = useEthPrice();

  useEffect(() => {
    if (item !== null) {
      setShowModal(true);
      setOrder(prev => {
        return {
          ...prev,
          price: eth.forItem
        };
      });
    }
  }, [item]);

  const closeModal = () => {
    setShowModal(false);
    onClose();
  };

  const onSubmit = () => {
    setShowModal(false);
    purchaseItem(order);
  };

  return (
    <>
      {showModal ? (
        <>
          <div className=" justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-gray-800 text-white font-abeezee outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">{item.title}</h3>
                </div>

                <div className="relative p-6 flex-auto">
                  <form className="p-4">
                    <div className="mb-4">
                      <input
                        checked={enablePrice}
                        type="checkbox"
                        className="default:ring-2 mr-4"
                        onChange={({ target: { checked } }) => {
                          setOrder(prev => {
                            return {
                              ...prev,
                              price: checked ? order.price : eth.forItem
                            };
                          });

                          setEnablePrice(prev => !prev);
                        }}
                      />
                      <span className="text-xs">
                        Adjust price - only when the price isnt correct
                      </span>
                      <label
                        className="block text-gray-400 text-sm font-bold mb-2"
                        htmlFor="username"
                      >
                        Price (ETH)
                      </label>

                      <input
                        disabled={!enablePrice}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="price"
                        type="text"
                        onChange={({ target: { value } }) => {
                          if (isNaN(value)) {
                            return;
                          }
                          setOrder(prevO => ({ ...prevO, price: value }));
                        }}
                        value={order.price}
                      />
                      <span className="text-xs">
                        Price will be verified at the time of the order.If the
                        price will be lower, order can be declined.
                      </span>
                    </div>

                    {isNewPurchase && (
                      <>
                        <div className="mb-4">
                          <label
                            className="block text-gray-400 text-sm font-bold mb-2"
                            htmlFor="username"
                          >
                            Email
                          </label>
                          <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="username"
                            type="text"
                            placeholder="Username"
                            value={order.email}
                            onChange={({ target: { value } }) => {
                              setOrder(prev => {
                                return {
                                  ...prev,
                                  email: value
                                };
                              });
                            }}
                          />
                          <span className="text-xs">
                            Its important to fill a correct email, otherwise the
                            order cannot be verified. We are not storing u email
                            anywhere
                          </span>
                        </div>

                        <div className="mb-6">
                          <label
                            className="block text-gray-400 text-sm font-bold mb-2"
                            htmlFor="repeatEmail"
                          >
                            Repeat Email
                          </label>
                          <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="repeatEmail"
                            type="text"
                            value={order.repeatEmail}
                            onChange={({ target: { value } }) => {
                              setOrder(prev => {
                                return {
                                  ...prev,
                                  repeatEmail: value
                                };
                              });
                            }}
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <input type="checkbox" className="default:ring-2 mr-4" />
                      <span className="text-xs">
                        I acccept Terms of Service and i agree that my order can
                        be rejected in the case data provided above arent
                        correct
                      </span>
                      {/* <p className="text-red-500 text-xs italic">
                        Please choose a password.
                      </p> */}
                    </div>
                  </form>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      purchaseItem(order);
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-80 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
