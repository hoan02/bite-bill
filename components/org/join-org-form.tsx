"use client";

// import { useActionState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
// import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
// import { joinOrg } from "@/lib/actions/org.action";

const JoinOrgForm = () => {
  // const initialState = { errorMessage: "" };
  // const [state, formAction, pending] = useActionState(joinOrg, initialState);

  // useEffect(() => {
  //   if (state.errorMessage.length) {
  //     toast.error(state.errorMessage);
  //   }
  // }, [state.errorMessage]);

  return (
    <Card className="min-w-[380px]">
      <CardHeader>
        <CardTitle>Join a Team</CardTitle>
        <CardDescription>Select a method to join the team.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tab nhỏ bên trong cho slug/code */}
        <Tabs defaultValue="slug" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="slug">By Slug</TabsTrigger>
            <TabsTrigger value="code">By Code</TabsTrigger>
          </TabsList>

          {/* JOIN BY SLUG */}
          <TabsContent value="slug" className="mt-4">
            <div className="space-y-2">
              <Label>Team Slug</Label>
              <Input type="text" required name="slug" id="slug" />
            </div>
          </TabsContent>

          {/* JOIN BY CODE */}
          <TabsContent value="code" className="mt-4">
            <div className="space-y-2">
              <Label>Invite Code</Label>
              <div className="flex justify-center">
                <InputOTP maxLength={8}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                    <InputOTPSlot index={6} />
                    <InputOTPSlot index={7} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter>
        <Button className="w-full">Join Team</Button>
      </CardFooter>
    </Card>
  );
};

export default JoinOrgForm;
