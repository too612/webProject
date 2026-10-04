import { FormEvent, useCallback, useEffect, useState } from "react";
import { useWorkspaceDirty } from "../../../common/workspace/workspaceHook";
import { myprofileApi } from "./myprofileApi";
import {
  toMyProfileContactUpdate,
  type MyProfile,
  type MyProfileContactUpdate,
} from "./myprofileModel";

export function useMyProfilePage() {
  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [form, setForm] = useState<MyProfileContactUpdate>({
    email: "",
    phone: "",
    postalCode: "",
    addressLine1: "",
    addressLine2: "",
  });
  const [initialForm, setInitialForm] = useState(form);
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useWorkspaceDirty(
    isEditing && JSON.stringify(form) !== JSON.stringify(initialForm),
  );

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const result = await myprofileApi.getMyProfile();
      const contact = toMyProfileContactUpdate(result);
      setProfile(result);
      setForm(contact);
      setInitialForm(contact);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "내 정보를 불러오지 못했습니다.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const handleContactChange = useCallback(
    (field: keyof MyProfileContactUpdate, value: string) => {
      setForm((current) => ({ ...current, [field]: value }));
      setMessage("");
    },
    [],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSaving(true);
      setError("");
      setMessage("");
      try {
        await myprofileApi.updateContactInfo(form);
        setProfile((current) => (current ? { ...current, ...form } : current));
        setInitialForm(form);
        setIsEditing(false);
        setMessage("연락처 정보가 저장되었습니다.");
      } catch (cause) {
        setError(
          cause instanceof Error
            ? cause.message
            : "연락처 정보를 저장하지 못했습니다.",
        );
      } finally {
        setSaving(false);
      }
    },
    [form],
  );

  const handleCancelEdit = useCallback(() => {
    setForm(initialForm);
    setIsEditing(false);
    setError("");
    setMessage("");
  }, [initialForm]);

  const handleStartEdit = useCallback(() => {
    setError("");
    setMessage("");
    setIsEditing(true);
  }, []);

  return {
    profile,
    form,
    activeTab,
    loading,
    saving,
    isEditing,
    error,
    message,
    setActiveTab,
    handleContactChange,
    handleSubmit,
    handleCancelEdit,
    handleStartEdit,
    loadProfile,
  };
}
