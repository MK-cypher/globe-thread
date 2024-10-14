import Form from "../components/Form";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: "Shop Wave | Signup",
  description: "",
};

export default async function page({searchParams}: {searchParams: {[key: string]: string}}) {
  return (
    <main className="flex justify-center items-center min-h-lvh">
      <Form signin={false} searchParams={searchParams} />
    </main>
  );
}
