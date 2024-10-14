import {getUser} from "@/actions/users";
import GeneralTab from "@/components/tabs/GeneralTab";
import SecurityTab from "@/components/tabs/SecurityTab";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {CreditCard, Home, MapPinIcon, Shield} from "lucide-react";

export default async function page() {
  const userData = await getUser();

  return (
    <div>
      <div className="w-full max-sm:px-3 sm:container">
        <Tabs defaultValue={"general"} className="px-2 pb-2 h-full">
          <div className="flex max-sm:flex-col h-full">
            <TabsList className="h-[calc(100vh-90px)] sticky top-[80px] flex sm:flex-col sm:justify-start sm:items-start sm:w-[250px] max-md:flex-wrap">
              <TabsTrigger value="general" className="w-full max-md:w-fit text-base text-start justify-start gap-3">
                <Home size={18} />
                General
              </TabsTrigger>
              <TabsTrigger value="security" className="w-full max-md:w-fit text-base text-start justify-start gap-3">
                <Shield size={18} />
                Security
              </TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="sm:pl-5 sm:pr-2 w-full grow">
              <GeneralTab userData={userData} />
            </TabsContent>
            <TabsContent value="security" className="sm:pl-5 sm:pr-2 w-full grow">
              <SecurityTab userData={userData} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
