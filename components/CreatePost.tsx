"use client";
import {savePost} from "@/actions/posts";
import {priceFormat} from "@/lib/numberFormats";
import {type PostType} from "@/lib/types";
import {Plus} from "lucide-react";
import {useState} from "react";
import ImageUploader from "./ImageUploader";
import {Button, buttonVariants} from "./ui/button";
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "./ui/dialog";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "./ui/select";
import {toast} from "./ui/use-toast";

type props = {
  type: string;
  post?: PostType;
};

export default function CreatePost({type, post}: props) {
  const [activeType, setActiveType] = useState(post ? post.type : type);
  const [img, setimg] = useState(post && post.img ? post?.img : "");
  const [imgFile, setImgFile] = useState(null);
  const [price, setPrice] = useState<{type: string; price: number}>({
    type: post && post?.price_type ? post?.price_type : type == "jobs" || type == "Hiring" ? "perhour" : "fixed",
    price: post && post.price ? post.price : 0,
  });
  const [postData, setPostData] = useState<any>(post || {});
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);

    const data = {
      type: activeType,
      title: postData.title,
      description: postData.description,
      img,
      price: price.price,
      price_type: price.type,
    };

    const res = await savePost(data, post?.id, post?.img);
    if (!res) {
      toast({title: "Something went wrong", variant: "destructive"});
    } else toast({title: "Your post has been saved successfully", variant: "success"});
    setLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger className={`${buttonVariants()}`}>
        <Plus />
        Create Post
      </DialogTrigger>
      <DialogContent aria-describedby={undefined} className="overflow-auto max-h-[99svh] md:w-[700px] md:max-w-none">
        <DialogTitle></DialogTitle>
        <PostType type={type} activeType={activeType} setActiveType={setActiveType} />
        <div className="space-y-5 mt-3">
          <div className="md:flex">
            <div className="md:w-1/3 shrink-0">
              <ImageUploader img={img} setImg={setimg} imgFile={imgFile} setImgFile={setImgFile} />
            </div>
            <div className="md:w-2/3 shrink-0 md:pl-10 space-y-5 max-md:mt-5">
              <div>
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Post Title"
                  className="w-full"
                  value={postData?.title}
                  readOnly={false}
                  onChange={(e) => {
                    setPostData((prev: any) => ({...prev, title: e.target.value}));
                  }}
                />
              </div>
              <div>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Post Description"
                  className="w-full"
                  value={postData?.description}
                  readOnly={false}
                  onChange={(e) => {
                    setPostData((prev: any) => ({...prev, description: e.target.value}));
                  }}
                />
              </div>
            </div>
          </div>

          {/* TODO-- Price all 4 types */}
          {activeType == "Buying" || activeType == "Selling" ? (
            <div className="space-y-1">
              <label htmlFor="price" className="block">
                Price
              </label>
              <input
                type="number"
                name="price"
                id="price"
                value={price.price}
                readOnly={false}
                onKeyDown={(e) => {
                  const value = e.key;
                  const pass = ["e", "-", "+", "="];
                  if (pass.includes(value)) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  const price = e.target.value;
                  setPrice((prev: any) => ({...prev, price}));
                }}
              />
            </div>
          ) : activeType == "Jobs" || activeType == "Hiring" ? (
            <>
              <div className="flex items-center gap-5">
                <div className="space-y-1">
                  <label htmlFor="priceType" className="block">
                    Payment Type
                  </label>
                  <Select
                    onValueChange={(e) => {
                      setPrice((prev: any) => ({...prev, type: e}));
                    }}
                    defaultValue={postData.price_type || "perhour"}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue id="priceType" placeholder="Price Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="perhour">Per Hour</SelectItem>
                      <SelectItem value="salary">Fixed Salary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label htmlFor="price" className="block">
                    amount
                  </label>
                  <input
                    type="number"
                    step={0.01}
                    name="price"
                    id="price"
                    value={price.price}
                    readOnly={false}
                    onKeyDown={(e) => {
                      const value = e.key;
                      const pass = ["e", "-", "+", "="];
                      if (pass.includes(value)) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const price = e.target.value;
                      setPrice((prev: any) => ({...prev, price}));
                    }}
                  />
                </div>
              </div>
            </>
          ) : (
            <div></div>
          )}
          <div>
            <div>
              <span>${priceFormat(price.price)}</span>
              <span>{price.type == "perhour" ? "/h" : price.type == "salary" ? "k/year" : ""}</span>{" "}
            </div>
          </div>
          <div>
            <Button className={`${loading ? "loading" : ""} w-full`} onClick={submit}>
              Save <span></span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type PostTypeProps = {
  type: string;
  activeType: string;
  setActiveType: any;
};

const PostType = ({type, activeType, setActiveType}: PostTypeProps) => {
  return (
    <div className="flex justify-center items-center gap-10">
      <button
        className={`${
          activeType == "Buying" || activeType == "Hiring"
            ? "border-blue-500 text-blue-500 outline-blue-500"
            : "outline-transparent border-foreground/50"
        } w-40 h-20 border rounded-lg  flex justify-center items-center text-xl transition-all duration-300 outline `}
        onClick={() => {
          setActiveType(type == "Buying" ? "Buying" : "Hiring");
        }}
      >
        {type == "Buying" ? "Buying" : "Hiring"}
      </button>
      <button
        className={`${
          activeType == "Selling" || activeType == "Jobs"
            ? "border-emerald-500 text-emerald-500 outline-emerald-500"
            : "outline-transparent border-foreground/50"
        } w-40 h-20 border rounded-lg  flex justify-center items-center text-xl transition-all duration-300 outline `}
        onClick={() => {
          setActiveType(type == "Buying" ? "Selling" : "Jobs");
        }}
      >
        {type == "Buying" ? "Selling" : "Looking for Job"}
      </button>
    </div>
  );
};
