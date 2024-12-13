"use client";

import { Button } from "components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components/ui/dialog";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Textarea } from "components/ui/textarea";
import { Trip, validateTripForm } from "lib/schema";
import { useEffect, useState } from "react";

interface EditTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
}

export default function EditTripModal({ isOpen, onClose, trip }: EditTripModalProps) {
  const [formData, setFormData] = useState<Trip>(trip);
  const [errors, setErrors] = useState<Partial<Record<keyof Trip, string[]>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(trip);
  }, [trip]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validateField = (name: keyof Trip, value: any) => {
    const result = validateTripForm({ ...formData, [name]: value });
    if (!result.success) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: result.errors[name] || [],
      }));
    } else {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    validateField(name as keyof Trip, value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = validateTripForm(formData);
    if (!result.success) {
      setErrors(result.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/trips/${trip.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update trip");
      }

      onClose();
    } catch (error) {
      console.error("Error updating trip:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = Object.keys(errors).length === 0 && formData.title && formData.start_date && formData.end_date;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Trip</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} onBlur={handleBlur} />
            {errors.title && <p className="text-red-500 text-sm">{errors.title[0]}</p>}
          </div>
          <div>
            <Label htmlFor="start_date">Start Date</Label>
            <Input
              id="start_date"
              name="start_date"
              type="date"
              value={formData.start_date instanceof Date ? formData.start_date.toISOString().split("T")[0] : ""}
              onChange={handleChange}
              onBlur={handleBlur}
              max={formData.end_date instanceof Date ? formData.end_date.toISOString().split("T")[0] : undefined}
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
              onChange={handleChange}
              onBlur={handleBlur}
              min={formData.start_date instanceof Date ? formData.start_date.toISOString().split("T")[0] : undefined}
            />
            {errors.end_date && <p className="text-red-500 text-sm">{errors.end_date[0]}</p>}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description[0]}</p>}
          </div>
          <Button type="submit" disabled={!isFormValid || isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Trip"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
