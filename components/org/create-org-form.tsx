"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { orgSchema, OrgFormData } from "@/lib/schemas/org";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { createOrg } from "@/lib/actions/org.action";

const CreateOrgForm = () => {
  const form = useForm<OrgFormData>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      // logo: null,
    },
  });

  const { handleSubmit, control, reset } = form;

  const onSubmit = async (data: OrgFormData) => {
    const result = await createOrg(data);
    reset();

    if (!result.success) {
      toast({
        title: "Lỗi",
        description: "Tạo tổ chức thất bại",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Thành công",
        description: "Tổ chức đã được tạo",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="min-w-[380px] max-w-[600px]">
          <CardHeader>
            <CardTitle>Create a New Team</CardTitle>
            <CardDescription>
              You will become the owner of the new team.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              name="name"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Team Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="slug"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="my-team" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="description"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your team..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              name="logo"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              className="w-full"
            >
              Create Team
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default CreateOrgForm;
