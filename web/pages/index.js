import Link from "next/link";

export default function Home() {
  return (
    <div className="center">
      <div className="flex flex-col justify-center space-y-4">
        <Link href="/host">
          <div className="btn btn-primary">Host a Livestream</div>
        </Link>
        <Link href="/view">
          <div className="btn btn-primary">View a Livestream</div>
        </Link>
      </div>
    </div>
  );
}
