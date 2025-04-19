"use client";

import { generateMockExamAction } from "@/app/_actions/generate-mock-exam";
import { FilesSchema } from "@/app/_schemas/files.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { CircleCheckIcon, CircleX, DownloadIcon, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ACCEPTED_FILE_TYPES } from "@/config/constants";

export const FileUploadForm = () => {
  const [state, formAction, isPending] = useActionState(
    generateMockExamAction,
    {
      success: false,
      message: "",
    }
  );

  const form = useForm({
    resolver: zodResolver(FilesSchema),
    mode: "onSubmit",
    defaultValues: {
      files: undefined,
    },
  });

  const handleFormAction = async (formData: FormData) => {
    const valid = await form.trigger();
    if (!valid) return;

    const files = form.getValues("files") as File[];

    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
    }
    startTransition(() => {
      formAction(formData);
    });
  };

  // useEffect(() => {
  //   if (state?.mockExam) {
  //     const mockExam = state.mockExam;
  //     const cleanJson = mockExam
  //       .replace(/```json\n?/, "")
  //       .replace(/```$/, "")
  //       .trim();
  //     const exam = JSON.parse(cleanJson);
  //   }
  // }, [state?.mockExam]);

  return (
    <div>
      <Form {...form}>
        <form action={handleFormAction} className="space-y-4">
          <FormField
            control={form.control}
            name="files"
            render={({ field: { onChange } }) => (
              <FormItem>
                <FormLabel>Upload Course Files</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    multiple
                    accept={ACCEPTED_FILE_TYPES.join(",")}
                    onChange={(e) => onChange(e.target.files)}
                    className="bg-white"
                  />
                </FormControl>
                <FormDescription>
                  You can upload up to 3 files (PDF, DOCX, PPTX, etc.)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={isPending}
            type="submit"
            className="w-full font-bold uppercase"
          >
            {isPending && (
              <Loader2
                className="h-4 w-4 shrink-0 animate-spin"
                aria-hidden="true"
              />
            )}
            Generate Mock Exam
          </Button>

          {state.success && (
            <div className="flex items-center gap-2 rounded-md bg-green-500 p-3 text-white">
              <CircleCheckIcon className="h-5 w-5" />
              <span>Success! {state.message}</span>
            </div>
          )}

          {!state.success && state.message && (
            <div className="flex items-center gap-2 rounded-md bg-red-500 p-3 text-white">
              <CircleX className="h-5 w-5" />
              <span>Error! {state.message}</span>
            </div>
          )}
          {state.success && state.pdf && (
            <div className="mt-4">
              <a
                href={`data:application/pdf;base64,${state.pdf}`}
                download="mock_exam.pdf"
                className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                <DownloadIcon className="h-5 w-5" />
                Download Mock Exam PDF
              </a>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};
