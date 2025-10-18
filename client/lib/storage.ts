import { supabase, STORAGE_BUCKET } from "./supabase";

export async function uploadImage(
  file: File,
  path?: string
): Promise<string | null> {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
}

export async function deleteImage(url: string): Promise<boolean> {
  try {
    const path = url.split(`${STORAGE_BUCKET}/`)[1];
    if (!path) return false;

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([path]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting image:", error);
    return false;
  }
}

export async function uploadMultipleImages(
  files: File[],
  path?: string
): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadImage(file, path));
  const results = await Promise.all(uploadPromises);
  return results.filter((url): url is string => url !== null);
}
