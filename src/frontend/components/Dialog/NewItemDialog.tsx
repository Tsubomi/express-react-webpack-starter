import * as Dialog from "@radix-ui/react-dialog";
import React, { useState, useRef, useEffect } from "react";

import type { IsValidNewItemFormDataReturn } from "../../../types";

type NewItemDialogProps = {
  isOpen: boolean;
  isValidFormData: (formData: FormData) => IsValidNewItemFormDataReturn;
  onClose: () => void;
  onAddNewItem: (name: string, type: "file" | "directory") => void;
};

export default function NewItemDialog({ isOpen, isValidFormData, onClose, onAddNewItem }: NewItemDialogProps) {
  const [nameInvalidMessage, setNameInvalidMessage] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Reset validity when message changes
  useEffect(() => {
    if (nameInputRef.current) {
      if (nameInvalidMessage) {
        nameInputRef.current.setCustomValidity(nameInvalidMessage);
      } else {
        nameInputRef.current.setCustomValidity('');
      }
    }
  }, [nameInvalidMessage]);

  function onFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const rawName = fd.get("name");
    const name = typeof rawName === "string" ? rawName.trim() : "";
    const type = (fd.get("type") as "file" | "directory") || "file";

    const {isValid, errorMessage} = isValidFormData(fd);

    if (isValid) {
      setNameInvalidMessage(null);
      onAddNewItem(name, type);
      onClose();
    } else {
      const message = errorMessage || 'Invalid name';

      // Set both the React state and the DOM element's validity directly
      setNameInvalidMessage(message);

      // Set validity directly without waiting for useEffect
      if (nameInputRef.current) {
        nameInputRef.current.setCustomValidity(message);
        nameInputRef.current.reportValidity();
      }
    }
  }

  // Add input reset handler
  const handleInputChange = () => {
    if (nameInvalidMessage && nameInputRef.current) {
      setNameInvalidMessage(null);
    }
  };

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" onClick={onClose} />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 w-[92vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4 shadow-lg">
          <Dialog.Title className="text-lg font-semibold">Create</Dialog.Title>
          <Dialog.Description className="text-sm text-gray-600 mb-3">
            Add a file or folder.
          </Dialog.Description>
          <form
            onSubmit={onFormSubmit}
            className="space-y-3"
          >
            <label className="block">
              <span className="mb-1 block text-sm">Name</span>
              <input
                ref={nameInputRef}
                name="name"
                required
                onChange={handleInputChange}
                className="w-full rounded border px-3 py-2 outline-none focus:ring"
                placeholder="untitled.txt"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm">Type</span>
              <select name="type" className="w-full rounded border px-3 py-2">
                <option value="file">File</option>
                <option value="directory">Directory</option>
              </select>
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <Dialog.Close asChild>
                <button type="button" className="rounded px-3 py-1.5" onClick={onClose}>Cancel</button>
              </Dialog.Close>
              <button type="submit" className="rounded bg-black px-3 py-1.5 text-white">Create</button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
