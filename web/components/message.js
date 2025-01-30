import { TbUserFilled } from "react-icons/tb";

export default function Message({ message }) {
  console.log(message);
  return (
    <div className="flex items-center gap-2">
      {message.user?.logo ? (
        <img className="h-5 w-5 rounded-full" src={message.user.logo} />
      ) : (
        <div className="p-1 rounded-full bg-blue-500">
          <TbUserFilled className="h-3 w-3 text-blue-900" />
        </div>
      )}
      <div className={`space-x-2 text-sm`}>
        <span className="font-bold text-blue-500">
          {message.user?.name || (message.role == "user" ? "User" : "Host")}
        </span>
        <span className="text-white font-semibold">{message.message}</span>
      </div>
    </div>
  );
}
