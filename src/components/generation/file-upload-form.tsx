"use client";

import { generateMockExamAction } from "@/app/_actions/mock-exam";
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

  useEffect(() => {
    // Trigger a re-render or perform any side-effect here
  }, [state.success, state.context]);

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
          {state.success && state.context && (
            <div className="space-y-6 mt-6">
              {/* 1. Math-related flag */}

              {/* 2. Organized chunks */}
              <div>
                <h2 className="text-xl font-semibold mb-3">
                  📦 Organized Chunks
                </h2>
                <div className="space-y-4">
                  {state.context.organizedChunks.map((chunk, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm whitespace-pre-wrap text-sm"
                    >
                      <div className="text-gray-600 mb-2 font-medium">
                        Chunk {index + 1}
                      </div>
                      {chunk}
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Final combined organized content */}
              <div>
                <h2 className="text-xl font-semibold mb-3">
                  🧩 Combined Organized Content
                </h2>
                <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm whitespace-pre-wrap text-sm">
                  {state.context.organizedContent}
                </div>
              </div>
            </div>
          )}

          {/* {state.success && state.chunkedText && (
            <div>
              <h2>Chunked Text: {state.chunkedText.length}</h2>
              <ul>
                {state.chunkedText.map((chunk, index) => (
                  <li key={index}>
                    <h1>Chunk: {index}</h1>
                    <p>{chunk}</p>
                    <hr />
                  </li>
                ))}
              </ul>
            </div>
          )} */}
          {/* {state.success && state.summarizedText && (
            <div>
              <h1>Summarized Text From DEEPSEEK: </h1>
              <pre>{state.summarizedText}</pre>
            </div>
          )} */}

          {/* {state.success && state.mockExam && (
            <div className="mt-4">
              <a
                href={`data:application/pdf;base64,${state.mockExam}`}
                download="mock_exam.pdf"
                className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                <DownloadIcon className="h-5 w-5" />
                Download Mock Exam PDF
              </a>
            </div>
          )} */}
        </form>
      </Form>
    </div>
  );
};
