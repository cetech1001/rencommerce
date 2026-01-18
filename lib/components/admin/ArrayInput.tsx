"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface ArrayInputProps {
  value: string[];
  onChange: (values: string[]) => void;
  label: string;
  placeholder?: string;
}

export function ArrayInput({ value, onChange, label, placeholder }: ArrayInputProps) {
  const [newItem, setNewItem] = useState("");

  const handleAdd = () => {
    if (newItem.trim()) {
      onChange([...value, newItem.trim()]);
      setNewItem("");
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
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
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
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
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 bg-muted rounded-lg group"
            >
              <span className="flex-1 text-sm">{item}</span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
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
