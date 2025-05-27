"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

// Define the schema using zod
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  description: z.string().optional(),
  logo: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;

const FormCreateOrg = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      logo: null,
    },
  });

  const { handleSubmit, control, formState, reset } = form;
  const { errors } = formState;

  const onSubmit = (data: FormData) => {
    console.log("data", data);
    // Simulate form submission
    toast({
      title: "Success",
      description: `Team "${data.name}" created successfully!`,
    });
    reset();
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
                  <FormMessage>
                    {typeof errors.name?.message === "string"
                      ? errors.name.message
                      : null}
                  </FormMessage>
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
                  <FormMessage>
                    {typeof errors.slug?.message === "string"
                      ? errors.slug.message
                      : null}
                  </FormMessage>
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
                  <FormMessage>
                    {typeof errors.description?.message === "string"
                      ? errors.description.message
                      : null}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              name="logo"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) => field.onChange(e.target.files)}
                    />
                  </FormControl>
                  <FormMessage>
                    {typeof errors.logo?.message === "string"
                      ? errors.logo.message
                      : null}
                  </FormMessage>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Create Team
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default FormCreateOrg;
