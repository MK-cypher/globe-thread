"use client";

import {updatePassword} from "@/actions/users";
import {toast} from "@/components/ui/use-toast";
import {useState} from "react";

interface password {
  password: string;
  newPassword: string;
  confirmPassword: string;
}
export default function ChangePassword({userData}: {userData: any}) {
  const [loading, setLoading] = useState(false);
  const [Password, setPassword] = useState<password>({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  const savePassword = async () => {
    setLoading(true);
    const valuesCheck = Object.values(Password).every((value) => value.length >= 6);
    if (valuesCheck) {
      if (Password.newPassword == Password.confirmPassword) {
        const {error, success} = JSON.parse(await updatePassword(Password));
        if (error) {
          toast({
            title: error,
            variant: "destructive",
          });
        } else {
          toast({
            title: success,
            variant: "success",
          });
        }
      } else {
        toast({
          title: "password no not match",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "password must be between 6 and 30 characters",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <>
      {userData.provider == "email" && (
        <div className="bg-secondary/90 rounded-lg p-5 mb-5">
          <h3 className="text-lg font-bold mb-5">Password</h3>
          <div className="grid grid-cols-5 items-center my-2">
            <label htmlFor="password" className="col-span-2">
              Password
            </label>
            <input
              className="col-span-2"
              id="password"
              placeholder="******"
              onChange={(e) => {
                setPassword((prev: password) => ({
                  ...prev,
                  password: e.target.value,
                }));
              }}
            />
          </div>
          <div className="grid grid-cols-5 items-center my-2">
            <label htmlFor="new-password" className="col-span-2">
              New Password
            </label>
            <input
              className="col-span-2"
              id="new-password"
              placeholder="******"
              onChange={(e) => {
                setPassword((prev: password) => ({
                  ...prev,
                  newPassword: e.target.value,
                }));
              }}
            />
          </div>
          <div className="grid grid-cols-5 items-center my-2">
            <label htmlFor="confirm-password" className="col-span-2">
              Confirm New Password
            </label>
            <input
              className="col-span-2"
              id="confirm-password"
              placeholder="******"
              onChange={(e) => {
                setPassword((prev: password) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }));
              }}
            />
          </div>
          <div className="flex justify-end gap-3 mt-3">
            <button
              className="cancel-btn"
              onClick={() => {
                setPassword({
                  password: "",
                  newPassword: "",
                  confirmPassword: "",
                });
              }}
            >
              cancel
            </button>
            <button className={`save-btn ${loading ? "loading" : ""}`} onClick={savePassword}>
              Save
              <span></span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
