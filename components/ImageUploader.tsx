import React from "react";
import {buttonVariants} from "./ui/button";
import {Trash, UploadCloud} from "lucide-react";

type props = {
  img: string;
  setImg: any;
  imgFile: any;
  setImgFile: any;
};

export default function ImageUploader({img, setImg, imgFile, setImgFile}: props) {
  const imgUpload = async (logo: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(logo);
      reader.onloadend = () => {
        setImg(reader.result);
        resolve(reader.result);
      };
    });
  };

  return (
    <div className="flex flex-col gap-2 max-sm:w-full">
      <div className="flex items-center justify-between">
        <label htmlFor="post-img">Post Image</label>
        <div
          className="text-destructive cursor-pointer"
          onClick={() => {
            setImg(null);
            setImgFile(null);
          }}
        >
          <Trash />
        </div>
      </div>
      <div className="w-full h-56">
        <div className="w-full h-full relative flex justify-center items-center border border-dashed border-muted-foreground rounded-lg">
          <input
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0 && e.target.files[0].type.includes("image")) {
                setImgFile(e.target.files[0]);
                imgUpload(e.target.files[0]);
              } else {
                return;
              }
            }}
            id="post-img"
            type="file"
            accept="image/*"
            className="opacity-0 w-full h-full cursor-pointer"
          />
          {imgFile ? (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg z-[-1] h-full">
              <img src={URL.createObjectURL(imgFile)} alt="Logo" className="h-full object-cover rounded-lg mx-auto" />
            </div>
          ) : img ? (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg z-[-1] h-full">
              <img src={`${img}`} alt="post" className="h-full object-cover rounded-lg mx-auto" />
            </div>
          ) : (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg z-[-1] h-full text-center flex flex-col gap-2 items-center justify-center">
              <UploadCloud className="mx-auto text-muted-foreground" />
              <div className="text-muted-foreground">Drag Image here</div>
              <div>OR</div>
              <div className={`${buttonVariants()}`}>Click Here</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
