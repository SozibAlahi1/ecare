"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Edit2, Trash2, Globe, MessageSquare, Check, AlertTriangle, Star } from "lucide-react";
import ImageUploader from "@/components/blocks/image-uploader";
import { Dropdown } from "@/components/ui/dropdown";

interface TestimonialItem {
  _id: string;
  author: string;
  company: string;
  quote: string;
  rating: number;
  locale: "en" | "bn";
  videoUrl?: string;
  avatar?: string;
  logo?: string;
  translationGroupId?: string;
}

interface TestimonialGroup {
  id: string; // translationGroupId or _id (if standalone)
  en?: TestimonialItem;
  bn?: TestimonialItem;
  avatar?: string;
  logo?: string;
  rating: number;
  videoUrl?: string;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Active tab for localized fields
  const [activeTab, setActiveTab] = useState<"en" | "bn">("en");

  // Shared Fields
  const [avatar, setAvatar] = useState("");
  const [logo, setLogo] = useState("");
  const [rating, setRating] = useState(5);
  const [videoUrl, setVideoUrl] = useState("");

  // English Fields
  const [authorEn, setAuthorEn] = useState("");
  const [companyEn, setCompanyEn] = useState("");
  const [quoteEn, setQuoteEn] = useState("");

  // Bengali Fields
  const [authorBn, setAuthorBn] = useState("");
  const [companyBn, setCompanyBn] = useState("");
  const [quoteBn, setQuoteBn] = useState("");

  const [saving, setSaving] = useState(false);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/testimonials");
      const data = await res.json();
      if (res.ok) {
        setTestimonials(data.data);
      } else {
        throw new Error(data.error || "Failed to load testimonials");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const getGroupedTestimonials = (): TestimonialGroup[] => {
    const groups: TestimonialGroup[] = [];
    const visitedIds = new Set<string>();

    testimonials.forEach((item) => {
      if (visitedIds.has(item._id)) return;

      if (item.translationGroupId) {
        const related = testimonials.filter((t) => t.translationGroupId === item.translationGroupId);
        const en = related.find((t) => t.locale === "en");
        const bn = related.find((t) => t.locale === "bn");

        related.forEach((t) => visitedIds.add(t._id));

        groups.push({
          id: item.translationGroupId,
          en,
          bn,
          avatar: en?.avatar || bn?.avatar || "",
          logo: en?.logo || bn?.logo || "",
          rating: en?.rating ?? bn?.rating ?? 5,
          videoUrl: en?.videoUrl || bn?.videoUrl || "",
        });
      } else {
        visitedIds.add(item._id);
        groups.push({
          id: item._id,
          en: item.locale === "en" ? item : undefined,
          bn: item.locale === "bn" ? item : undefined,
          avatar: item.avatar,
          logo: item.logo,
          rating: item.rating,
          videoUrl: item.videoUrl,
        });
      }
    });

    return groups;
  };

  const groupedTestimonials = getGroupedTestimonials();

  const resetForm = () => {
    // English Reset
    setAuthorEn("");
    setCompanyEn("");
    setQuoteEn("");

    // Bengali Reset
    setAuthorBn("");
    setCompanyBn("");
    setQuoteBn("");

    // Shared Reset
    setAvatar("");
    setLogo("");
    setRating(5);
    setVideoUrl("");

    setEditingId(null);
    setFormOpen(false);
    setActiveTab("en");
  };

  const handleEdit = (group: TestimonialGroup) => {
    setEditingId(group.id);

    // English Populate
    if (group.en) {
      setAuthorEn(group.en.author);
      setCompanyEn(group.en.company);
      setQuoteEn(group.en.quote);
    } else {
      setAuthorEn("");
      setCompanyEn("");
      setQuoteEn("");
    }

    // Bengali Populate
    if (group.bn) {
      setAuthorBn(group.bn.author);
      setCompanyBn(group.bn.company);
      setQuoteBn(group.bn.quote);
    } else {
      setAuthorBn("");
      setCompanyBn("");
      setQuoteBn("");
    }

    // Shared Populate
    setAvatar(group.avatar || "");
    setLogo(group.logo || "");
    setRating(group.rating);
    setVideoUrl(group.videoUrl || "");

    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial translation group?")) return;

    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Testimonial deleted successfully!");
        fetchTestimonials();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        throw new Error(data.error || "Deletion failed");
      }
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(""), 4000);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload: any = {
      avatar,
      logo,
      rating,
      videoUrl,
      en: null,
      bn: null,
    };

    if (authorEn) {
      payload.en = {
        author: authorEn,
        company: companyEn,
        quote: quoteEn,
      };
    }

    if (authorBn) {
      payload.bn = {
        author: authorBn,
        company: companyBn,
        quote: quoteBn,
      };
    }

    try {
      const url = editingId ? `/api/admin/testimonials/${editingId}` : "/api/admin/testimonials";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save testimonial");
      }

      setSuccess(editingId ? "Testimonial updated successfully!" : "Testimonial created successfully!");
      resetForm();
      fetchTestimonials();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Testimonials Manager</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Create, update, and manage your dynamic bilingual testimonials/video loops.
          </p>
        </div>
        <Button
          onClick={() => { resetForm(); setFormOpen(true); }}
          className="bg-[#e8000e] hover:bg-[#e8000e]/90 text-white font-bold inline-flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </Button>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-400 rounded-2xl text-sm font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          {success}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 rounded-2xl text-sm font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      {formOpen && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-md">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
            {editingId ? "Edit Multilingual Testimonial" : "Create New Multilingual Testimonial"}
          </h2>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Shared Fields */}
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-border/40 p-5 rounded-2xl">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4">Shared Metadata</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Avatar */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">User Avatar</label>
                  <div className="flex gap-2 items-center">
                    <Input
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="Avatar image URL"
                      className="flex-1"
                    />
                    <ImageUploader value={avatar} onChange={setAvatar} />
                  </div>
                </div>

                {/* Company Logo */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Company Logo (Optional)</label>
                  <div className="flex gap-2 items-center">
                    <Input
                      value={logo}
                      onChange={(e) => setLogo(e.target.value)}
                      placeholder="Company logo URL"
                      className="flex-1"
                    />
                    <ImageUploader value={logo} onChange={setLogo} />
                  </div>
                </div>

                {/* Rating & Video URL */}
                <div className="grid grid-cols-2 gap-3">
                  <Dropdown
                    label="Rating (1-5)"
                    value={rating}
                    onChange={(val) => setRating(parseInt(val))}
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </Dropdown>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Video Embed URL</label>
                    <Input
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="e.g. YouTube Shorts URL"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Language Tab Selector */}
            <div className="flex border-b border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab("en")}
                className={`py-2.5 px-5 font-semibold text-sm border-b-2 transition-colors cursor-pointer ${
                  activeTab === "en"
                    ? "border-red-600 text-red-600 dark:text-red-500"
                    : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                English Version {authorEn ? "✓" : ""}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("bn")}
                className={`py-2.5 px-5 font-semibold text-sm border-b-2 transition-colors cursor-pointer ${
                  activeTab === "bn"
                    ? "border-red-600 text-red-600 dark:text-red-500"
                    : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                Bengali Version {authorBn ? "✓" : ""}
              </button>
            </div>

            {/* English Version */}
            {activeTab === "en" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">English Author Name</label>
                    <Input
                      required={!!authorEn || (!authorEn && !authorBn)}
                      value={authorEn}
                      onChange={(e) => setAuthorEn(e.target.value)}
                      placeholder="e.g. Sarah Connor"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">English Company Name</label>
                    <Input
                      required={!!authorEn}
                      value={companyEn}
                      onChange={(e) => setCompanyEn(e.target.value)}
                      placeholder="e.g. Cyberdyne Systems"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bengali Version */}
            {activeTab === "bn" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Bengali Author Name</label>
                    <Input
                      value={authorBn}
                      onChange={(e) => setAuthorBn(e.target.value)}
                      placeholder="যেমনঃ সারা কোনর"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Bengali Company Name</label>
                    <Input
                      required={!!authorBn}
                      value={companyBn}
                      onChange={(e) => setCompanyBn(e.target.value)}
                      placeholder="যেমনঃ সাইবারডাইন সিস্টেমস"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-end border-t border-slate-200 dark:border-slate-800 pt-4">
              <Button type="button" variant="outline" onClick={resetForm} className="cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="bg-[#e8000e] hover:bg-[#e8000e]/90 text-white font-bold cursor-pointer">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Testimonial Group"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Grouped Testimonials List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          </div>
        ) : groupedTestimonials.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            <MessageSquare className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
            No testimonials found. Click "Add Testimonial" or seed the database on the Dashboard!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase">User</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase">Video URL</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase">Rating</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase">Languages</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {groupedTestimonials.map((group) => {
                  const hasEn = !!group.en;
                  const hasBn = !!group.bn;

                  return (
                    <tr key={group.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border/40 bg-slate-100 shrink-0">
                            {group.avatar ? (
                              <img src={group.avatar} alt="Avatar" className="object-cover w-full h-full" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold uppercase text-sm">
                                {(group.en?.author || group.bn?.author || "?").substring(0, 1)}
                              </div>
                            )}
                          </div>
                          <div>
                            {group.en && (
                              <div className="font-bold text-slate-800 dark:text-white text-sm">{group.en.author} <span className="text-xs text-slate-400">({group.en.company})</span></div>
                            )}
                            {group.bn && (
                              <div className={`text-slate-700 dark:text-slate-300 text-xs ${group.en ? "mt-0.5 italic" : "font-bold"}`}>{group.bn.author} <span className="text-[10px] text-slate-400">({group.bn.company})</span></div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 max-w-xs md:max-w-md">
                        <div className="text-xs font-mono text-slate-500 truncate" title={group.videoUrl || ""}>
                          {group.videoUrl || "No Video URL"}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-0.5 text-amber-500 items-center">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="text-xs font-bold ml-1 text-slate-700 dark:text-slate-300">{group.rating}.0</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {hasEn && (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
                              <Globe className="w-3 h-3" />
                              EN
                            </span>
                          )}
                          {hasBn && (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 border border-orange-100 dark:border-orange-900/40">
                              <Globe className="w-3 h-3" />
                              BN
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-2 justify-end">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(group)} className="h-8 w-8 p-0 cursor-pointer">
                            <Edit2 className="w-4 h-4 text-blue-500" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(group.id)} className="h-8 w-8 p-0 cursor-pointer">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
