"use client";

import { createTrip } from "@/app/actions/createTrip";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Textarea } from "components/ui/textarea";
import { Trip, validateTripForm } from "lib/schema";
import React, { useActionState, useState, useTransition } from "react";

export default function TripForm() {
  const [state, formAction] = useActionState(createTrip, null);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<Partial<Trip>>({
    title: "",
    start_date: new Date(),
    end_date: new Date(),
    description: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Trip, string[]>>>({});

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Validate the field
    const validationResult = validateTripForm({ ...formData, [name]: value });
    if (!validationResult.success) {
      setErrors((prev) => ({ ...prev, [name]: validationResult.errors[name as keyof Trip] }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let newValue: string | Date = value;

    if (name === "start_date" || name === "end_date") {
      newValue = new Date(value);
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof Date) {
          formDataToSubmit.append(key, value.toISOString().split("T")[0]);
        } else {
          formDataToSubmit.append(key, value.toString());
        }
      }
    });
    startTransition(() => {
      formAction(formDataToSubmit);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Trip Title"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title[0]}</p>}
      </div>

      <div>
        <Label htmlFor="start_date">Start Date</Label>
        <Input
          id="start_date"
          name="start_date"
          type="date"
          value={formData.start_date instanceof Date ? formData.start_date.toISOString().split("T")[0] : ""}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        {errors.start_date && <p className="text-red-500 text-sm">{errors.start_date[0]}</p>}
      </div>

      <div>
        <Label htmlFor="end_date">End Date</Label>
        <Input
          id="end_date"
          name="end_date"
          type="date"
          value={formData.end_date instanceof Date ? formData.end_date.toISOString().split("T")[0] : ""}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        {errors.end_date && <p className="text-red-500 text-sm">{errors.end_date[0]}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="Trip Description"
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description[0]}</p>}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Submitting..." : "Create Trip"}
      </Button>

      {state?.message && (
        <div className={`mt-4 ${state.errors ? "text-red-500" : "text-green-500"}`}>
          {state.message}
          {state.errors &&
            Object.entries(state.errors).map(([field, errors]) =>
              errors.map((error: string, index: number) => (
                <div key={`${field}-${index}`}>
                  {field}: {error}
                </div>
              ))
            )}
        </div>
      )}
    </form>
  );
}
