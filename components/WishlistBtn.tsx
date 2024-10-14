"use client";
import {addWishlist, removeWishlist} from "@/actions/wishlist";
import {Heart} from "lucide-react";
import React, {useState} from "react";
import {toast} from "./ui/use-toast";

export default function WishlistBtn({wishlist, id}: {wishlist: number[]; id: number}) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(wishlist.includes(id));

  const handleAdd = async () => {
    setLoading(true);
    setAdded(true);
    const res = await addWishlist(id);
    if (!res) {
      setAdded(false);
      toast({
        title: "something went wrong",
        variant: "destructive",
      });
    }
    setLoading(false);
  };
  const handleRemove = async () => {
    setLoading(true);
    setAdded(false);
    const res = await removeWishlist(id);
    if (!res) {
      setAdded(true);
      toast({
        title: "something went wrong",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <button
      className={`${added ? "bg-red-400" : "bg-secondary"} p-2 rounded-lg ${loading ? "disabled-btn" : ""}`}
      onClick={added ? handleRemove : handleAdd}
    >
      <Heart />
    </button>
  );
}
