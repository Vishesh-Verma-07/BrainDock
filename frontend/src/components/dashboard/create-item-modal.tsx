"use client";

import { FormEvent, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Field, fieldClass, Modal, Select } from "@/components/dashboard/modal";
import type { Category, CreateContent, Tag } from "@/lib/api";

export type ItemDefaults = {
  title?: string;
  content?: string;
  link?: string;
  categoryId?: string;
};

const hostOf = (value: string) => {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

export function CreateItemModal({
  categories,
  tags,
  defaults,
  saving,
  onClose,
  onSubmit,
  onCreateCollection,
}: {
  categories: Category[];
  tags: Tag[];
  defaults: ItemDefaults;
  saving: boolean;
  onClose: () => void;
  onSubmit: (body: CreateContent) => void;
  onCreateCollection: () => void;
}) {
  const [title, setTitle] = useState(defaults.title ?? "");
  const [content, setContent] = useState(defaults.content ?? "");
  const [link, setLink] = useState(defaults.link ?? "");
  const [tagList, setTagList] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [categoryId, setCategoryId] = useState(
    defaults.categoryId || (categories.length === 1 ? categories[0]._id : ""),
  );

  const suggestions = tags
    .map((t) => t.name || t.title || "")
    .filter((name) => name && !tagList.some((t) => t.toLowerCase() === name.toLowerCase()))
    .slice(0, 8);

  function addTags(raw: string) {
    const incoming = raw.split(",").map((t) => t.trim()).filter(Boolean);
    if (!incoming.length) return;
    setTagList((current) => {
      const next = [...current];
      for (const tag of incoming)
        if (!next.some((t) => t.toLowerCase() === tag.toLowerCase())) next.push(tag);
      return next;
    });
    setTagInput("");
  }

  function onTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      // Enter inside the tag box should add the tag, not submit the whole form.
      e.preventDefault();
      addTags(tagInput);
    } else if (e.key === "Backspace" && !tagInput && tagList.length) {
      setTagList((current) => current.slice(0, -1));
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    onSubmit({
      title: title.trim(),
      content: content.trim(),
      link: link.trim() || undefined,
      categoryId: categoryId || undefined,
      tags: [
        ...tagList,
        ...tagInput.split(",").map((t) => t.trim()).filter((t) => t && !tagList.includes(t)),
      ],
    });
  }

  return (
    <Modal
      eyebrow="Add to your Brain Dock"
      title="Save something"
      accent="worth keeping."
      onClose={onClose}
      footer={
        <Button type="submit" form="create-item-form" className="w-full" disabled={saving}>
          {saving ? "Saving…" : "Save to Brain Dock"}
        </Button>
      }
    >
      <form id="create-item-form" onSubmit={submit} className="space-y-4">
        <Field label="Link" hint="Optional">
          <input
            name="link"
            type="url"
            value={link}
            autoFocus={!defaults.title && !defaults.link}
            onChange={(e) => setLink(e.target.value)}
            onBlur={() => !title && link && setTitle(hostOf(link))}
            placeholder="https://…"
            className={cn(fieldClass, "h-11")}
          />
        </Field>
        <Field label="Title">
          <input
            required
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What are you saving?"
            className={cn(fieldClass, "h-11")}
          />
        </Field>
        <Field label="Note">
          <textarea
            required
            name="content"
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a thought or a helpful summary…"
            className={cn(fieldClass, "py-2.5")}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Collection">
            <Select
              required
              name="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="h-11"
            >
              <option value="">Choose a collection</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Tags" hint="Enter or comma to add">
            <div
              className={cn(
                fieldClass,
                "flex min-h-11 flex-wrap items-center gap-1.5 py-1.5 focus-within:border-foreground/40 focus-within:ring-2 focus-within:ring-accent/30",
              )}
            >
              {tagList.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-accent-soft py-0.5 pl-2.5 pr-1 text-xs font-medium"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => setTagList((current) => current.filter((t) => t !== tag))}
                    aria-label={`Remove tag ${tag}`}
                    className="flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground hover:bg-surface hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <input
                name="tags"
                value={tagInput}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.includes(",")) addTags(value);
                  else setTagInput(value);
                }}
                onKeyDown={onTagKeyDown}
                onBlur={() => addTags(tagInput)}
                placeholder={tagList.length ? "" : "design, ideas"}
                aria-label="Add a tag"
                className="min-w-[4rem] flex-1 bg-transparent py-0.5 text-sm outline-none focus-visible:!outline-none placeholder:text-muted-foreground/70"
              />
            </div>
          </Field>
        </div>

        {suggestions.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Existing:</span>
            {suggestions.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => addTags(name)}
                className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              >
                + {name}
              </button>
            ))}
          </div>
        )}

        {categories.length === 0 && (
          <p className="rounded-md bg-amber-soft px-3 py-2 text-sm text-amber">
            You need a collection first.{" "}
            <button type="button" className="font-semibold underline" onClick={onCreateCollection}>
              Create one
            </button>
          </p>
        )}
      </form>
    </Modal>
  );
}
