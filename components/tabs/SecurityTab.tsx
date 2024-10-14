import React from "react";
import ChangePassword from "./changePassword";
import SignoutOther from "./SignoutOther";

export default function SecurityTab({userData}: {userData: any}) {
  return (
    <div>
      <ChangePassword userData={userData} />
      <SignoutOther />
    </div>
  );
}
