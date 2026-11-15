import { supabase } from "./supabase";

export type RosaImageFolder = "products" | "hero" | "brand";

const BUCKET = "rosa-images";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function getClient() {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  return supabase;
}

function createFileName(file: File, customName?: string) {
  const extension = MIME_EXTENSIONS[file.type];

  if (!extension) {
    throw new Error("Only JPG, PNG and WebP images are allowed.");
  }

  const rawName = customName || file.name.replace(/\.[^.]+$/, "");
  const safeName = rawName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!safeName) {
    throw new Error("Invalid image file name.");
  }

  return `${safeName}.${extension}`;
}

export async function uploadRosaImage(
  file: File,
  folder: RosaImageFolder,
  customName?: string
) {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Image size must be 5 MB or less.");
  }

  const client = getClient();
  const fileName = createFileName(file, customName);
  const path = `${folder}/${fileName}`;

  const { data, error } = await client.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    throw error;
  }

  const { data: publicData } = client.storage
    .from(BUCKET)
    .getPublicUrl(data.path);

  return {
    path: data.path,
    url: publicData.publicUrl,
  };
}

export function getRosaImageUrl(path: string) {
  const client = getClient();

  return client.storage
    .from(BUCKET)
    .getPublicUrl(path)
    .data.publicUrl;
}

export async function deleteRosaImage(path: string) {
  const client = getClient();

  const { error } = await client.storage
    .from(BUCKET)
    .remove([path]);

  if (error) {
    throw error;
  }
}
