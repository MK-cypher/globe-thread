import Link from "next/link";

export default function Logo() {
  return (
    <div className="text-primary max-md:z-50 whitespace-nowrap text-xl shrink-0 font-bold">
      <Link href="/">
        {/* <img src="/logo.png" alt="logo" className="w-full h-full object-cover shrink-0" /> */}
        <div className="">Globe Thread</div>
      </Link>
    </div>
  );
}
