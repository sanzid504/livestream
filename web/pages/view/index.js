import Link from "next/link";
import { useState } from "react";

export default function LivestreamView() {
  const [callid, setCallid] = useState("");

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="space-y-4 flex flex-col">
        <div>
          <label>Call id</label>
          <input onChange={(e) => setCallid(e.target.value)} value={callid} />
        </div>
        <Link className="btn btn-primary w-full" href={`/view/${callid}`}>
          Enter Live Stream
        </Link>
      </div>
    </div>
  );
}
