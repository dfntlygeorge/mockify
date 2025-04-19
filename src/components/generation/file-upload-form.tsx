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
import { CircleCheckIcon, CircleX, Loader2 } from "lucide-react";
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

    // Get the files from the form state
    const files = form.getValues("files") as File[];

    // Clear the existing FormData and append files properly
    if (files) {
      console.log(files.length);
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
    }
    startTransition(() => {
      formAction(formData);
    });
  };

  useEffect(() => {
    if (state?.mockExam) {
      const mockExam = state.mockExam;
      const cleanJson = mockExam
        .replace(/```json\n?/, "")
        .replace(/```$/, "")
        .trim();
      const exam = JSON.parse(cleanJson);
      console.log("📝 Mock Exam JSON:", exam);
    }
  }, [state?.mockExam]);

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
        </form>
      </Form>
      {state.mockExam &&
        (() => {
          try {
            const clean = state.mockExam
              .replace(/```json\n?/, "")
              .replace(/```$/, "")
              .trim();
            const mockExam = JSON.parse(clean);

            return (
              <div className="mt-6 space-y-6 rounded-md border p-4">
                <h2 className="text-lg font-semibold">Generated Mock Exam</h2>

                {/* True/False */}
                {mockExam.true_false?.length > 0 && (
                  <div>
                    <h3 className="font-medium">True or False</h3>
                    <ul className="list-disc pl-6">
                      {mockExam.true_false.map((q: any, i: number) => (
                        <li key={i}>
                          {q.question} —{" "}
                          <strong>{q.answer ? "True" : "False"}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Multiple Choice */}
                {mockExam.multiple_choice?.length > 0 && (
                  <div>
                    <h3 className="font-medium">Multiple Choice</h3>
                    <ul className="space-y-4">
                      {mockExam.multiple_choice.map((q: any, i: number) => (
                        <li key={i}>
                          <p>{q.question}</p>
                          <ul className="list-decimal pl-6">
                            {q.options.map((opt: string, j: number) => (
                              <li key={j}>{opt}</li>
                            ))}
                          </ul>
                          <p className="mt-1">
                            Answer: <strong>{q.answer}</strong>
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Fill in the Blank */}
                {mockExam.fill_in_the_blank?.length > 0 && (
                  <div>
                    <h3 className="font-medium">Fill in the Blank</h3>
                    <ul className="list-disc pl-6">
                      {mockExam.fill_in_the_blank.map((q: any, i: number) => (
                        <li key={i}>
                          {q.question.replace("______", "____")} —{" "}
                          <strong>{q.answer}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          } catch (err) {
            console.error("Failed to parse mock exam:", err);
            return (
              <p className="text-red-500">Failed to parse generated exam.</p>
            );
          }
        })()}
    </div>
  );
};
