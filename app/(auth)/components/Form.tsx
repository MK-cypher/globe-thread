"use client";

import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {zodResolver} from "@hookform/resolvers/zod";
import {AlertTriangle, CheckCircle2, Eye, EyeOff, Info} from "lucide-react";
import Link from "next/link";
import {redirect} from "next/navigation";
import {useState} from "react";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {checkUsername, signInWithEmail, signUpEmail} from "../actions";
import GoogleAuth from "./GoogleAuth";
import {useDebouncedCallback} from "use-debounce";

const signUpFormSchema = z
  .object({
    username: z
      .string()
      .min(2, {
        message: "Username must be at least 2 characters.",
      })
      .max(20, {
        message: "Username cannot be more than 20 characters.",
      }),
    emailAddress: z.string().email(),
    password: z
      .string()
      .min(6, {
        message: "Password must be at least 6 characters.",
      })
      .max(30, {
        message: "Password cannot be more than 30 characters.",
      }),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: "Password do not match",
      path: ["confirmPassword"],
    }
  );

const signInFormSchema = z.object({
  emailAddress: z.string().email(),
  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters.",
    })
    .max(30, {
      message: "Password cannot be more than 30 characters.",
    }),
});

interface props {
  signin: boolean;
  searchParams: {[key: string]: string};
}
interface message {
  status: boolean;
  message: string;
}

export default function form({signin, searchParams}: props) {
  const [showPassword, setshowPassword] = useState(false);
  const [message, setMessage] = useState<message>();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [typing, setTyping] = useState({
    username: false,
  });
  const [exist, setExist] = useState({
    username: false,
  });
  const origin = searchParams.origin;

  let form;
  let formSchema: any;
  if (signin) {
    formSchema = signInFormSchema;
    form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        emailAddress: "",
        password: "",
      },
    });
  } else {
    formSchema = signUpFormSchema;
    form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        username: "",
        emailAddress: "",
        password: "",
        confirmPassword: "",
      },
    });
  }

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    if (signin) {
      const result = JSON.parse(await signInWithEmail(data));
      if (result.error) {
        setMessage({status: false, message: result.error});
      } else {
        redirect(origin || "/dashboard");
      }
    } else {
      if (!exist.username) {
        const result = JSON.parse(await signUpEmail(data));
        if (result.error) {
          setMessage({status: false, message: result.error});
        } else {
          setMessage({
            status: true,
            message: "registration successfull! \n Please check you email for confirmation",
          });
        }
      } else setMessage({status: false, message: "Username Already exist"});
    }
    setIsLoading(false);
  };

  const usernameCheck = useDebouncedCallback(async (username: string) => {
    const exist = await checkUsername(username);
    if (exist) {
      setExist((prev) => ({...prev, username: true}));
    } else {
      setExist((prev) => ({...prev, username: false}));
    }
    setTyping((prev) => ({...prev, username: false}));
  }, 1000);

  return (
    <div className="">
      {!signin ? (
        <>
          <h3 className="text-2xl font-bold text-center mb-8">Get Started</h3>
        </>
      ) : (
        <>
          <h3 className="text-2xl font-bold text-center mb-8">Welcome back!</h3>
        </>
      )}

      <div className="w-[450px] p-10 bg-secondary rounded-lg inner-shadow text-center">
        {message?.message && (
          <div
            className={`w-fit mx-auto ${
              message?.status ? "bg-emerald-500/15 text-emerald-500" : "bg-red-300 text-red-700 "
            } px-3 py-2 rounded-lg flex items-center justify-center gap-3`}
          >
            {message.status ? <CheckCircle2 /> : <AlertTriangle />}
            <div>{message.message}</div>
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            {!signin && (
              <FormField
                control={form.control}
                name="username"
                render={({field}) => (
                  <FormItem className="my-5 relative">
                    <div className="absolute right-1 top-1/2 mt-1 -translate-y-1/2">
                      {typing.username && username ? (
                        <></>
                      ) : exist.username && username ? (
                        <Info className="text-red-600" />
                      ) : username ? (
                        <CheckCircle2 className="text-success" />
                      ) : (
                        <></>
                      )}
                    </div>
                    <FormControl>
                      <input
                        className={`${
                          typing.username && username
                            ? "border-orange-400 outline-none"
                            : exist.username && username
                            ? "border-red-600 outline-none"
                            : username
                            ? "border-success outline-none"
                            : ""
                        } w-full`}
                        type="text"
                        placeholder="Username"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setUsername(e.target.value);
                          setTyping((prev) => ({...prev, username: true}));
                          usernameCheck(e.target.value);
                          setMessage({status: false, message: ""});
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-start text-red-500" />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="emailAddress"
              render={({field}) => (
                <FormItem className="my-5">
                  <FormControl>
                    <input
                      className="w-full"
                      type="email"
                      placeholder="Email"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setMessage({status: false, message: ""});
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-start text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({field}) => (
                <FormItem className="my-5">
                  <FormControl>
                    <div className="relative">
                      <input
                        className="w-full"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setMessage({status: false, message: ""});
                        }}
                      />
                      <div
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={(e) => {
                          e.preventDefault();
                          setshowPassword(!showPassword);
                        }}
                      >
                        <div>{showPassword ? <Eye /> : <EyeOff />}</div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="text-start text-red-500" />
                </FormItem>
              )}
            />
            {!signin && (
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({field}) => (
                  <FormItem className="my-5">
                    <FormControl>
                      <div className="relative">
                        <input
                          className="w-full"
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setMessage({status: false, message: ""});
                          }}
                        />
                        <div
                          className="z-20 absolute right-3 top-1/2 transform -translate-y-1/2"
                          onClick={(e) => {
                            e.preventDefault();
                            setshowPassword(!showPassword);
                          }}
                        >
                          <div>{showPassword ? <Eye /> : <EyeOff />}</div>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-start text-red-500" />
                  </FormItem>
                )}
              />
            )}
            {signin && (
              <div className="mt-8 mb-5">
                <div className="mb-4 text-end">
                  <Link
                    href={"/forgort-password"}
                    className="text-blue-600 transition duration-300 hover:text-blue-400 link"
                  >
                    forgot password ?
                  </Link>
                </div>
              </div>
            )}
            <Button className={`w-full my-3 ${isLoading ? "loading" : ""}`} type="submit">
              <span></span>
              {!signin ? "sign up" : "signin"}
            </Button>
            or sign in with
          </form>
          <GoogleAuth searchParams={searchParams} />
          <div className="flex gap-1 items-center justify-center mt-8 mb-5 text-base">
            {signin ? (
              <>
                <p>Dont have an Account?</p>
                <Link href={"/signup"} className="text-blue-600 transition duration-300 hover:text-blue-400 link">
                  sign up
                </Link>
              </>
            ) : (
              <>
                <p>already have an Account?</p>
                <Link href={"/signin"} className="text-blue-600 transition duration-300 hover:text-blue-400 link">
                  signin
                </Link>
              </>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
}
