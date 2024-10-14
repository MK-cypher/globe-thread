import React from "react";
import ResetPass from "../components/ResetPass";

export default function page({searchParams}: {searchParams: {[key: string]: string}}) {
  return <ResetPass searchParams={searchParams} />;
}
