"use client";

import { createTrip } from "@/app/actions/createTrip";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Textarea } from "components/ui/textarea";
import { Trip, tripSchema } from "lib/schema";
import { useActionState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function TripForm() {
  const [state, formAction] = useActionState(createTrip, null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Trip>({
    resolver: zodResolver(tripSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<Trip> = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <>
      {state?.errors && (
        <div className="mb-6 p-4 border border-red-500 rounded bg-red-50">
          <p className="font-semibold text-red-700 mb-2">{state.message}</p>
          <ul className="list-disc list-inside text-red-600">
            {Object.entries(state.errors).map(([field, errors]) =>
              errors.map((error, index) => (
                <li key={`${field}-${index}`}>
                  {field}: {error}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register("title")} placeholder="Trip Title" />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        <div>
          <Label htmlFor="start_date">Start Date</Label>
          <Input id="start_date" type="date" {...register("start_date")} />
          {errors.start_date && <p className="text-red-500 text-sm">{errors.start_date.message}</p>}
        </div>

        <div>
          <Label htmlFor="end_date">End Date</Label>
          <Input id="end_date" type="date" {...register("end_date")} />
          {errors.end_date && <p className="text-red-500 text-sm">{errors.end_date.message}</p>}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register("description")} placeholder="Trip Description" />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Create Trip"}
        </Button>

        {state?.message && !state.errors && <p className="text-green-500 mt-4">{state.message}</p>}
      </form>
    </>
  );
}
