"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";

const priorities = [
  { value: "low", label: "Baja" },
  { value: "medium", label: "Media" },
  { value: "high", label: "Alta" },
] as const;

type EditableWish = {
  title: string;
  description: string | null;
  estimatedPrice: number;
  imageUrl: string | null;
  priority: "low" | "medium" | "high";
};

export function WishForm({
  daughterName,
  mode = "create",
  wishId,
  initialValues,
}: {
  daughterName: string;
  mode?: "create" | "edit";
  wishId?: string;
  initialValues?: EditableWish;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [forWhom, setForWhom] = useState<"mine" | "daughter">("mine");
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [price, setPrice] = useState(
    initialValues ? String(initialValues.estimatedPrice) : ""
  );
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    initialValues?.priority ?? "medium"
  );
  const [imageUrl, setImageUrl] = useState<string | null>(initialValues?.imageUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="flex flex-1 flex-col gap-4 px-5 pb-6"
      onSubmit={async (event) => {
        event.preventDefault();
        setSaving(true);
        setError(null);

        const response =
          mode === "edit"
            ? await fetch(`/api/wishes/${wishId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  title,
                  description: description || undefined,
                  estimatedPrice: Number(price),
                  imageUrl: imageUrl ?? undefined,
                  priority,
                }),
              })
            : await fetch("/api/wishes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  forWhom,
                  title,
                  description: description || undefined,
                  estimatedPrice: Number(price),
                  imageUrl: imageUrl ?? undefined,
                  priority,
                }),
              });

        setSaving(false);
        if (!response.ok) {
          setError("No se pudo guardar el deseo.");
          return;
        }

        router.push(mode === "edit" || forWhom === "mine" ? "/mine" : "/daughter");
        router.refresh();
      }}
    >
      <div
        onClick={() => fileInputRef.current?.click()}
        className="flex h-[130px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[18px] border-[1.5px] border-dashed border-border bg-surface text-text-faint"
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="h-full w-full rounded-[18px] object-cover" />
        ) : uploading ? (
          <span className="text-[13px] font-semibold text-text-soft">Subiendo...</span>
        ) : (
          <>
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 8h3l2-2h6l2 2h3v11H4V8z" />
              <circle cx="12" cy="13" r="3.5" />
            </svg>
            <span className="text-[13px] font-semibold text-text-soft">
              Toca para subir una foto
            </span>
            <span className="text-[11.5px]">JPG o PNG, máx. 5MB</span>
          </>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          setUploading(true);
          try {
            const blob = await upload(file.name, file, {
              access: "public",
              handleUploadUrl: "/api/upload",
            });
            setImageUrl(blob.url);
          } finally {
            setUploading(false);
          }
        }}
      />

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-text-soft">Título</span>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          className="rounded-2xl border border-border bg-surface px-3.5 py-3 text-sm outline-none focus:border-accent"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-text-soft">Descripción</span>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Talla, dirección, notas..."
          className="h-16 resize-none rounded-2xl border border-border bg-surface px-3.5 py-3 text-sm outline-none focus:border-accent"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-text-soft">Precio estimado</span>
        <div className="flex items-center gap-1 rounded-2xl border border-border bg-surface px-3.5 py-3">
          <span className="text-text-faint">$</span>
          <input
            type="number"
            min={0}
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            required
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </label>

      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-semibold text-text-soft">Prioridad</span>
        <div className="flex gap-2">
          {priorities.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPriority(option.value)}
              className={`flex-1 rounded-xl border py-2.5 text-[13px] font-semibold ${
                priority === option.value
                  ? "border-accent-ink bg-accent-soft text-accent-ink"
                  : "border-border bg-surface text-text-soft"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {mode === "create" ? (
        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-semibold text-text-soft">Para quién</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setForWhom("mine")}
              className={`flex-1 rounded-xl border py-2.5 text-[13px] font-semibold ${
                forWhom === "mine"
                  ? "border-accent bg-accent-soft text-accent-ink"
                  : "border-border bg-surface text-text-soft"
              }`}
            >
              Para mí
            </button>
            <button
              type="button"
              onClick={() => setForWhom("daughter")}
              className={`flex-1 rounded-xl border py-2.5 text-[13px] font-semibold ${
                forWhom === "daughter"
                  ? "border-accent bg-accent-soft text-accent-ink"
                  : "border-border bg-surface text-text-soft"
              }`}
            >
              Para {daughterName}
            </button>
          </div>
        </div>
      ) : null}

      {error ? <p className="text-sm text-priority-high-ink">{error}</p> : null}

      <button
        type="submit"
        disabled={saving || uploading}
        className="mt-2 rounded-2xl bg-accent py-4 text-base font-semibold text-white disabled:opacity-60"
      >
        {saving ? "Guardando..." : mode === "edit" ? "Guardar cambios" : "Guardar deseo"}
      </button>
    </form>
  );
}
