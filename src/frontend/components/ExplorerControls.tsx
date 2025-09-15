import React from "react";

interface ExplorerControlsProps {
  showDeleteItemButton?: boolean;
  onDeleteItem: () => void;
  onOpenFileDialog: () => void;
  onStartDemo: () => void;
}

export function ExplorerControls({
  showDeleteItemButton,
  onDeleteItem,
  onOpenFileDialog,
  onStartDemo
}: ExplorerControlsProps) {

  return (
    <div className="explorer-controls grid grid-cols-3 gap-2">
      <button className="rounded bg-green-300 px-3 py-1.5 text-black" onClick={() => onOpenFileDialog()}>Add Item</button>
      {showDeleteItemButton && <button className="rounded bg-red-300 px-3 py-1.5 text-black" onClick={onDeleteItem}>Delete Item</button>}
      <button className="rounded bg-blue-300 px-3 py-1.5 text-black col-start-3" onClick={() => onStartDemo()}>Example</button>
    </div>
  );
}
