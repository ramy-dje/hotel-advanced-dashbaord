"use client";

import { useRef, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import InlineAlert from "@/components/ui/inline-alert";
import DropZone from "@/components/upload-files/drop-zone";
import { HiUser, HiDocumentText } from "react-icons/hi";

interface ProfileCoverAvatarFieldProps {
  disabled?: boolean;
  maxFileSize?: number;
}

export default function ProfileCoverAvatarField({ disabled = false, maxFileSize = 2 * 1024 * 1024 }: ProfileCoverAvatarFieldProps) {
  const { control, formState: { errors } } = useFormContext();

  // cover controllers
  const coverFile = useController({ control, name: "cover_file", defaultValue: null });
  const coverUrl = useController({ control, name: "cover_url", defaultValue: '' });
  // avatar controllers
  const avatarFile = useController({ control, name: "picture_file", defaultValue: null });
  const avatarUrl = useController({ control, name: "picture_url", defaultValue: '' });

  // state for additional documents
  const [docs, setDocs] = useState<{
    file: File;
    url: string;
    label: string;
    showLabelInput: boolean;
  }[]>([]);

  // refs for file inputs
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  // handlers
  const onCoverSelect = () => coverInputRef.current?.click();
  const onAvatarSelect = () => avatarInputRef.current?.click();

  const onDocsDrop = (files: File[]) => {
    const newDocs = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      label: '',
      showLabelInput: false,
    }));
    setDocs(prev => [...prev, ...newDocs]);
  };

  const handleLabelChange = (index: number, value: string) => {
    setDocs(prev => {
      const copy = [...prev];
      copy[index].label = value;
      return copy;
    });
  };

  const openLabelInput = (index: number) => {
    setDocs(prev => prev.map((d, i) => ({ ...d, showLabelInput: i === index })));  
  };
  const closeLabelInput = (index: number, save = false) => {
    setDocs(prev => prev.map((d, i) => {
      if (i !== index) return d;
      return {
        file: d.file,
        url: d.url,
        label: save ? d.label : '',
        showLabelInput: false,
      };
    }));
  };

  return (
    <div className="col-span-2 w-full">
      {/* <Label htmlFor="firstname">Profile Gallery</Label> */}
      {/* Cover (Facebook-style) */}
      <div className="relative w-full h-32 bg-muted rounded-lg overflow-hidden">
        {coverUrl.field.value && <img src={coverUrl.field.value} alt="Cover" className="w-full h-full object-cover" />}
      </div>

      {/* Avatar overlaid on left */}
      <div className="relative -mt-16 ml-4">
        <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
          {avatarUrl.field.value ? (
            <AvatarImage src={avatarUrl.field.value} alt="Profile" />
          ) : (
            <AvatarFallback className="bg-muted text-foreground">
              <HiUser className="size-8" />
            </AvatarFallback>
          )}
        </Avatar>
      </div>

      {/* Action Buttons to trigger file dialogs */}
      <div className="mt-4 flex gap-4 ml-4">
        <Button variant="quickAdd" size="null" onClick={onAvatarSelect}>
          {avatarUrl.field.value ? 'Change Profile Picture' : '+ Upload Profile Picture'}
        </Button>
        <Button variant="quickAdd" size="null" onClick={onCoverSelect}>
          {coverUrl.field.value ? 'Change Cover' : '+ Upload Cover'}
        </Button>
      </div>

      {/* Hidden inputs for buttons */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={el => { coverInputRef.current = el; coverFile.field.ref(el); }}
        onChange={e => {
          const file = e.target.files?.[0];
          if (!file) return;
          if (coverUrl.field.value) URL.revokeObjectURL(coverUrl.field.value);
          const url = URL.createObjectURL(file);
          coverUrl.field.onChange(url);
          coverFile.field.onChange(file);
        }}
      />
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={el => { avatarInputRef.current = el; avatarFile.field.ref(el); }}
        onChange={e => {
          const file = e.target.files?.[0];
          if (!file) return;
          if (avatarUrl.field.value) URL.revokeObjectURL(avatarUrl.field.value);
          const url = URL.createObjectURL(file);
          avatarUrl.field.onChange(url);
          avatarFile.field.onChange(file);
        }}
      />

      {/* DropZone for other files (ID, docs...) */}
      <div className="mt-4 px-4">
        <Label htmlFor="documents">Additional Documents</Label>
        <DropZone
          disabled={disabled}
          placeholder="Drop or select documents (ID, etc...)"
          setFiles={onDocsDrop}
          className="border-border border rounded-md w-full h-24 flex items-center justify-center"
          maxSize={maxFileSize}
          maxFiles={5}
          multiple={true}
          accept={{
            "image/png": [], "image/jpeg": [], "image/jpg": [], "image/webp": [],
            "application/pdf": []
          }}
        />

        {/* Render uploaded docs list */}
        {docs.map((doc, idx) => (
          <div key={idx} className="mt-3 flex items-center gap-3">
            {/* thumbnail */}
            {doc.file.type.startsWith('image/') ? (
              <img src={doc.url} alt={doc.file.name} className="w-12 h-12 object-cover rounded" />
            ) : (
              <HiDocumentText className="size-8" />
            )}
            {/* name & size */}
            <div className="flex-1">
              <p className="text-sm font-medium">{doc.file.name}</p>
              <p className="text-xs text-muted-foreground">{(doc.file.size / 1024).toFixed(1)} KB</p>
            </div>
            {/* label section */}
            {!doc.showLabelInput ? (
              <Button variant="outline" size="sm" onClick={() => openLabelInput(idx)}>
                {doc.label ? doc.label : '+ Add Label'}
              </Button>
            ) : (
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  className="border border-input rounded px-2 py-1"
                  placeholder="Enter label"
                  value={doc.label}
                  onChange={e => handleLabelChange(idx, e.target.value)}
                />
                <Button size="sm" variant="secondary" onClick={() => closeLabelInput(idx, true)}>
                  Save
                </Button>
                <Button size="sm" variant="destructive" onClick={() => closeLabelInput(idx, false)}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        ))}

      </div>

    </div>
  );
}