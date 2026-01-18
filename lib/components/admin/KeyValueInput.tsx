"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface KeyValueInputProps {
  value: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
  label: string;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
}

export function KeyValueInput({
  value,
  onChange,
  label,
  keyPlaceholder = "Key",
  valuePlaceholder = "Value",
}: KeyValueInputProps) {
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const handleAdd = () => {
    if (newKey.trim() && newValue.trim()) {
      onChange({
        ...value,
        [newKey.trim()]: newValue.trim(),
      });
      setNewKey("");
      setNewValue("");
    }
  };

  const handleRemove = (key: string) => {
    const newValues = { ...value };
    delete newValues[key];
    onChange(newValues);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground">
        {label}
      </label>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          placeholder={keyPlaceholder}
          className="flex-1 px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={valuePlaceholder}
          className="flex-1 px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* List */}
      {Object.keys(value).length > 0 && (
        <div className="space-y-2">
          {Object.entries(value).map(([key, val]) => (
            <div
              key={key}
              className="flex items-center gap-2 p-3 bg-muted rounded-lg group"
            >
              <span className="flex-1 text-sm">
                <strong>{key}:</strong> {val}
              </span>
              <button
                type="button"
                onClick={() => handleRemove(key)}
                className="p-1 hover:bg-red-100 rounded transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
