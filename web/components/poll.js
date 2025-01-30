const { post, get } = require("@/utils/fetch");
const { default: axios } = require("axios");
const { useState, useEffect } = require("react");
const { TbChartBar } = require("react-icons/tb");
const { default: Modal } = require("./modal");

function Polls({ callid }) {
  const [poll, setPoll] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  async function fn() {
    const rs = await get(`/highlight/${callid}`);
    if (rs) {
      setPoll(rs);
      if (rs.visibility === "public") {
        setIsOpen(true);
      }
    }
  }

  useEffect(() => {
    fn();
    const interval = setInterval(() => {
      fn();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!poll) return null;

  return (
    <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
      <Poll poll={poll} />
    </Modal>
  );
}

function Poll({ poll }) {
  const [_poll, setPoll] = useState(poll.data);
  const [totalVote, setTotalVote] = useState(
    poll.data.options.reduce((acc, option) => acc + option.vote, 0)
  );

  const handleVote = async (index) => {
    if (poll.visibility === "private") return;
    const newPoll = { ..._poll };
    newPoll.options[index].vote += 1;
    const newTotalVote = totalVote + 1;

    setPoll(newPoll);
    setTotalVote(newTotalVote);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SOCKET_URL}/highlight/action/${poll._id}`,
        {
          option: index,
        }
      );
    } catch (error) {
      console.error("Failed to post vote", error);
      newPoll.options[index].vote -= 1;
      setPoll(newPoll);
      setTotalVote(totalVote);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-center">{_poll.name}</h3>
      <div className="flex flex-col space-y-2">
        {_poll.options.map((option, index) => {
          const votePercentage = (option.vote / totalVote) * 100;
          return (
            <button
              onClick={() => handleVote(index)}
              key={index}
              className="text-sm font-semibold"
            >
              <div className="flex justify-between mb-1">
                <span>{option.name}</span>
                <span>{votePercentage.toFixed(2)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded h-4">
                <div
                  className="bg-red-500 h-4 rounded"
                  style={{ width: `${votePercentage}%` }}
                ></div>
              </div>
            </button>
          );
        })}
      </div>

      {poll.visibility === "private" && (
        <div className="flex justify-center items-center">
          <div className="bg-blue-500 text-white px-4 py-2 font-semibold text-sm rounded-full">
            Finished
          </div>
        </div>
      )}
    </div>
  );
}

function HostPoll({ callid }) {
  const [isOpen, setIsOpen] = useState(false);
  const [_public, setPublic] = useState(false);
  const [poll, setPoll] = useState(null);
  const [totalVote, setTotalVote] = useState(0);

  async function fn() {
    const rs = await get(`/highlight/${callid}`);
    if (rs) {
      setPoll({ ...rs.data, _id: rs._id });
      setPublic(rs.visibility === "public");
      setTotalVote(
        rs.data.options.reduce((acc, option) => acc + option.vote, 0)
      );
    }
  }

  useEffect(() => {
    fn();
    const interval = setInterval(() => {
      fn();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
        <h3>Create Poll</h3>

        <div className="space-y-4">
          <div>
            <label>Text</label>
            <input
              onChange={(e) => setPoll({ ...poll, name: e.target.value })}
              value={poll?.name}
            />
          </div>

          {poll?._id ? (
            <div className="flex flex-col space-y-2">
              {poll.options.map((option, index) => {
                const votePercentage = (option.vote / totalVote) * 100;
                return (
                  <button key={index} className="text-sm font-semibold">
                    <div className="flex justify-between mb-1">
                      <span>{option.name}</span>
                      <span>{votePercentage.toFixed(2)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded h-4">
                      <div
                        className="bg-red-500 h-4 rounded"
                        style={{ width: `${votePercentage}%` }}
                      ></div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-1 flex flex-col">
              {poll?.options?.map((option, index) => {
                return (
                  <div
                    key={index}
                    className="text-sm font-semibold bg-stone-100 rounded-xl p-2"
                  >
                    <span>{option.name}</span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                const optionName = window.prompt("Enter option name");
                if (
                  optionName &&
                  !poll?.options?.find((o) => o.name === optionName)
                )
                  setPoll((prevP) => {
                    if (!prevP?.options) {
                      prevP = { options: [], name: prevP.name };
                    }
                    return {
                      ...prevP,
                      options: [
                        ...prevP.options,
                        { name: optionName, vote: 0 },
                      ],
                    };
                  });
              }}
              className="btn btn-primary"
            >
              Add Option
            </button>
            <button
              onClick={async () => {
                if (!poll?._id) {
                  const rs = await post(`/highlight/${callid}`, {
                    type: "poll",
                    data: poll,
                  });

                  console.log(rs, "rs");
                  setPoll(rs);
                  return;
                }

                if (!_public) {
                  await post(`/highlight/${poll._id}/publishing`, {
                    visibility: "public",
                  });
                  setPublic(true);
                } else {
                  await post(`/highlight/${poll._id}/publishing`, {
                    visibility: "private",
                  });
                  setPublic(false);
                }
              }}
              className="btn btn-primary"
            >
              {_public ? "Unpublish" : "Publish"}
            </button>

            {poll?._id && (
              <button
                onClick={async () => {
                  await post(`/highlight/${poll?._id}/publishing`, {
                    visibility: "archive",
                  });
                  setPoll(null);
                  setPublic(false);
                }}
                className="btn btn-primary"
              >
                New
              </button>
            )}
          </div>
        </div>
      </Modal>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full bg-blue-500 z-50 fixed bottom-16 right-4"
      >
        <TbChartBar className="h-4 w-4 text-blue-900" />
      </button>
    </>
  );
}

module.exports = { HostPoll, Polls };
