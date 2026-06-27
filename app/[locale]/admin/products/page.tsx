"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Edit2, Trash2, Globe, Package, Check, AlertTriangle } from "lucide-react";
import ImageUploader from "@/components/blocks/image-uploader";
import { Dropdown } from "@/components/ui/dropdown";

interface PortfolioItem {
  _id: string;
  title: string;
  slug: string;
  category: string;
  cover: string;
  gallery: string[];
  caseStudy?: string;
  content?: string;
  excerpt?: string;
  locale: "en" | "bn";
  price?: number;
  supportPrice?: number;
  sales?: number;
  rating?: number;
  ratingsCount?: number;
  features?: string[];
  demoUrl?: string;
  videoUrl?: string;
  icon?: string;
  downloadFile?: string;
  productType?: "internal" | "external";
  translationGroupId?: string;
}

interface PortfolioGroup {
  id: string; // translationGroupId or _id (if standalone)
  en?: PortfolioItem;
  bn?: PortfolioItem;
  category: string;
  cover: string;
  gallery: string[];
  caseStudy?: string;
  downloadFile?: string;
  price?: number;
  supportPrice?: number;
  sales?: number;
  rating?: number;
  ratingsCount?: number;
  demoUrl?: string;
  videoUrl?: string;
  icon?: string;
  productType?: "internal" | "external";
}

export default function AdminProductsPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Active tab for localized fields
  const [activeTab, setActiveTab] = useState<"en" | "bn">("en");
  const [editorTab, setEditorTab] = useState<"edit" | "preview">("edit");

  // Shared Form Fields
  const [category, setCategory] = useState("");
  const [cover, setCover] = useState("");
  const [caseStudy, setCaseStudy] = useState("");
  const [price, setPrice] = useState<number>(24);
  const [supportPrice, setSupportPrice] = useState<number>(7.13);
  const [sales, setSales] = useState<number>(1442);
  const [rating, setRating] = useState<number>(5.0);
  const [ratingsCount, setRatingsCount] = useState<number>(101);
  const [demoUrl, setDemoUrl] = useState<string>("/services");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [icon, setIcon] = useState("");
  const [downloadFile, setDownloadFile] = useState("");
  const [productType, setProductType] = useState<"internal" | "external">("external");
  const [typeSelected, setTypeSelected] = useState(false);
  const [gallery, setGallery] = useState<string[]>([]);

  // English Fields
  const [titleEn, setTitleEn] = useState("");
  const [slugEn, setSlugEn] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [excerptEn, setExcerptEn] = useState("");
  const [featuresEn, setFeaturesEn] = useState("");

  // Bengali Fields
  const [titleBn, setTitleBn] = useState("");
  const [slugBn, setSlugBn] = useState("");
  const [contentBn, setContentBn] = useState("");
  const [excerptBn, setExcerptBn] = useState("");
  const [featuresBn, setFeaturesBn] = useState("");

  const [saving, setSaving] = useState(false);
  const [editorUploading, setEditorUploading] = useState(false);
  const [dbCategories, setDbCategories] = useState<any[]>([]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories?type=product");
      const data = await res.json();
      if (res.ok) {
        // Group by translationGroupId to assemble { en: string, bn: string }
        const groups: Record<string, { en: string; bn: string }> = {};
        data.data.forEach((cat: any) => {
          const groupId = cat.translationGroupId || cat._id;
          if (!groups[groupId]) {
            groups[groupId] = { en: "", bn: "" };
          }
          if (cat.locale === "en") groups[groupId].en = cat.name;
          if (cat.locale === "bn") groups[groupId].bn = cat.name;
        });

        // Map to flat array of categories
        const list = Object.entries(groups).map(([id, val]) => ({
          id,
          en: val.en || val.bn || "Untitled",
          bn: val.bn || val.en || "Untitled",
        }));
        setDbCategories(list);
      }
    } catch (err) {}
  };

  const insertHTML = (locale: "en" | "bn", before: string, after: string = "") => {
    const textarea = document.getElementById(`product-overview-textarea-${locale}`) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = before + (selected || "") + after;

    if (locale === "en") {
      setContentEn(text.substring(0, start) + replacement + text.substring(end));
    } else {
      setContentBn(text.substring(0, start) + replacement + text.substring(end));
    }
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + (selected || "").length);
    }, 0);
  };

  const handleMultipleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, locale: "en" | "bn") => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setEditorUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        return data.url;
      });

      const urls = await Promise.all(uploadPromises);
      
      const colsInput = prompt(`Successfully uploaded ${urls.length} images. Enter Grid Columns count (1, 2, 3, or 4):`, "2");
      const num = parseInt(colsInput || "2", 10);
      
      let gridClass = "grid grid-cols-1 md:grid-cols-2 gap-6 my-6";
      if (num === 1) {
        gridClass = "my-6 space-y-6";
      } else if (num === 3) {
        gridClass = "grid grid-cols-1 md:grid-cols-3 gap-6 my-6";
      } else if (num === 4) {
        gridClass = "grid grid-cols-2 md:grid-cols-4 gap-6 my-6";
      }

      let html = `<div class="${gridClass}">\n`;
      urls.forEach((url) => {
        html += `  <div>\n    <img src="${url}" alt="image" class="w-full rounded-xl" />\n  </div>\n`;
      });
      html += `</div>\n`;

      insertHTML(locale, html);
    } catch (err: any) {
      alert("Failed to upload some images: " + err.message);
    } finally {
      setEditorUploading(false);
      e.target.value = "";
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (res.ok) {
        setItems(data.data);
      } else {
        throw new Error(data.error || "Failed to load product items");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const getGroupedProducts = (): PortfolioGroup[] => {
    const groups: PortfolioGroup[] = [];
    const visitedIds = new Set<string>();

    items.forEach((item) => {
      if (visitedIds.has(item._id)) return;

      if (item.translationGroupId) {
        const related = items.filter((p) => p.translationGroupId === item.translationGroupId);
        const en = related.find((p) => p.locale === "en");
        const bn = related.find((p) => p.locale === "bn");

        related.forEach((p) => visitedIds.add(p._id));

        groups.push({
          id: item.translationGroupId,
          en,
          bn,
          category: en?.category || bn?.category || "",
          cover: en?.cover || bn?.cover || "",
          gallery: en?.gallery || bn?.gallery || [],
          caseStudy: en?.caseStudy || bn?.caseStudy || "",
          price: en?.price ?? bn?.price,
          supportPrice: en?.supportPrice ?? bn?.supportPrice,
          sales: en?.sales ?? bn?.sales,
          rating: en?.rating ?? bn?.rating,
          ratingsCount: en?.ratingsCount ?? bn?.ratingsCount,
          demoUrl: en?.demoUrl || bn?.demoUrl || "/services",
          videoUrl: en?.videoUrl || bn?.videoUrl || "",
          icon: en?.icon || bn?.icon || "",
          productType: en?.productType || bn?.productType || "external"
        });
      } else {
        visitedIds.add(item._id);
        groups.push({
          id: item._id,
          en: item.locale === "en" ? item : undefined,
          bn: item.locale === "bn" ? item : undefined,
          category: item.category,
          cover: item.cover,
          gallery: item.gallery || [],
          caseStudy: item.caseStudy,
          price: item.price,
          supportPrice: item.supportPrice,
          sales: item.sales,
          rating: item.rating,
          ratingsCount: item.ratingsCount,
          demoUrl: item.demoUrl,
          videoUrl: item.videoUrl,
          icon: item.icon,
          productType: item.productType || "external"
        });
      }
    });

    return groups;
  };

  const groupedProducts = getGroupedProducts();

  const resetForm = () => {
    // English Reset
    setTitleEn("");
    setSlugEn("");
    setContentEn("");
    setExcerptEn("");
    setFeaturesEn("");

    // Bengali Reset
    setTitleBn("");
    setSlugBn("");
    setContentBn("");
    setExcerptBn("");
    setFeaturesBn("");

    // Shared Reset
    setCategory("");
    setCover("");
    setCaseStudy("");
    setPrice(24);
    setSupportPrice(7.13);
    setSales(1442);
    setRating(5.0);
    setRatingsCount(101);
    setDemoUrl("/services");
    setVideoUrl("");
    setIcon("");
    setDownloadFile("");
    setProductType("external");
    setTypeSelected(false);
    setGallery([]);

    setEditingId(null);
    setFormOpen(false);
    setActiveTab("en");
    setEditorTab("edit");
  };

  const handleEdit = (group: PortfolioGroup) => {
    setEditingId(group.id);

    // English Populate
    if (group.en) {
      setTitleEn(group.en.title);
      setSlugEn(group.en.slug);
      setContentEn(group.en.content || "");
      setExcerptEn(group.en.excerpt || "");
      setFeaturesEn(group.en.features ? group.en.features.join(", ") : "");
    } else {
      setTitleEn("");
      setSlugEn("");
      setContentEn("");
      setExcerptEn("");
      setFeaturesEn("");
    }

    // Bengali Populate
    if (group.bn) {
      setTitleBn(group.bn.title);
      setSlugBn(group.bn.slug);
      setContentBn(group.bn.content || "");
      setExcerptBn(group.bn.excerpt || "");
      setFeaturesBn(group.bn.features ? group.bn.features.join(", ") : "");
    } else {
      setTitleBn("");
      setSlugBn("");
      setContentBn("");
      setExcerptBn("");
      setFeaturesBn("");
    }

    // Shared Populate
    setCategory(group.category);
    setCover(group.cover);
    setGallery(group.gallery || []);
    setCaseStudy(group.caseStudy || "");
    setPrice(group.price ?? 24);
    setSupportPrice(group.supportPrice ?? 7.13);
    setSales(group.sales ?? 1442);
    setRating(group.rating ?? 5.0);
    setRatingsCount(group.ratingsCount ?? 101);
    setDemoUrl(group.demoUrl || "/services");
    setVideoUrl(group.videoUrl || "");
    setIcon(group.icon || "");
    setDownloadFile(group.downloadFile || "");
    setProductType(group.productType || "external");
    setTypeSelected(true);

    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product translation group?")) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Product deleted successfully!");
        fetchItems();
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
      category,
      cover,
      gallery,
      caseStudy,
      price: Number(price),
      supportPrice: Number(supportPrice),
      sales: Number(sales),
      rating: Number(rating),
      ratingsCount: Number(ratingsCount),
      demoUrl,
      videoUrl,
      icon,
      downloadFile,
      productType,
      en: null,
      bn: null,
    };

    if (titleEn) {
      payload.en = {
        title: titleEn,
        slug: slugEn,
        content: contentEn,
        excerpt: excerptEn,
        features: featuresEn.split(",").map((f) => f.trim()).filter(Boolean),
      };
    }

    if (titleBn) {
      payload.bn = {
        title: titleBn,
        slug: slugBn,
        content: contentBn,
        excerpt: excerptBn,
        features: featuresBn.split(",").map((f) => f.trim()).filter(Boolean),
      };
    }

    try {
      const url = editingId ? `/api/admin/products/${editingId}` : "/api/admin/products";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save product");
      }

      setSuccess(editingId ? "Product updated successfully!" : "Product created successfully!");
      resetForm();
      fetchItems();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Generate English slug dynamically
  useEffect(() => {
    if (!editingId && titleEn) {
      setSlugEn(
        titleEn
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
      );
    }
  }, [titleEn, editingId]);

  // Generate Bengali slug dynamically
  useEffect(() => {
    if (!editingId && titleBn) {
      setSlugBn(
        titleBn
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
      );
    }
  }, [titleBn, editingId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Products Manager</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Display your custom apps, SaaS builders, and dynamic products bilingually.
          </p>
        </div>
        <Button
          onClick={() => { resetForm(); setFormOpen(true); }}
          className="bg-[#e8000e] hover:bg-[#e8000e]/90 text-white font-bold inline-flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Product
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
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-md animate-fade-in">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
            {editingId ? "Edit Multilingual Product" : "Create New Multilingual Product"}
          </h2>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Shared Fields */}
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-border/40 p-5 rounded-2xl">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4">Shared Metadata</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Dropdown
                  label="Product Type"
                  value={productType}
                  onChange={(val) => {
                    setProductType(val as "internal" | "external");
                    setTypeSelected(true);
                  }}
                >
                  <option value="external">External Redirect Link</option>
                  <option value="internal">Internal Detailed Page</option>
                </Dropdown>

                <Dropdown
                  label="Category"
                  value={category}
                  onChange={(val) => setCategory(val)}
                >
                  <option value="">Select Category...</option>
                  {dbCategories.map((cat: any) => (
                    <option key={cat.id} value={cat.en}>
                      {activeTab === "en" ? cat.en : cat.bn}
                    </option>
                  ))}
                  {/* Fallbacks if empty */}
                  {dbCategories.length === 0 && (
                    <>
                      <option value="WordPress">WordPress</option>
                      <option value="SaaS">SaaS</option>
                      <option value="Analytics">Analytics</option>
                      <option value="Plugins">Plugins</option>
                    </>
                  )}
                </Dropdown>

                {/* Cover Image */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Cover Thumbnail</label>
                  <div className="flex gap-2 items-center">
                    <Input
                      required
                      value={cover}
                      onChange={(e) => setCover(e.target.value)}
                      placeholder="Thumbnail cover URL"
                      className="flex-1"
                    />
                    <ImageUploader value={cover} onChange={setCover} />
                  </div>
                </div>
              </div>

              {/* Shared Product Details - always visible for both internal and external products */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4 border-t border-slate-200 dark:border-slate-800/60 pt-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">Price (BDT)</label>
                  <Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">Support Price/mo (BDT)</label>
                  <Input type="number" value={supportPrice} onChange={(e) => setSupportPrice(Number(e.target.value))} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">Demo Sales Count</label>
                  <Input type="number" value={sales} onChange={(e) => setSales(Number(e.target.value))} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">Rating Stars</label>
                  <Input type="number" step="0.1" value={rating} onChange={(e) => setRating(Number(e.target.value))} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">Ratings Count</label>
                  <Input type="number" value={ratingsCount} onChange={(e) => setRatingsCount(Number(e.target.value))} />
                </div>
              </div>

              {/* Links & Video URL & Downloadable Plugin ZIP */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 border-t border-slate-200 dark:border-slate-800/60 pt-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Demo/External URL</label>
                  <Input value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} placeholder="/services or external URL" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Header Icon (SVG/Class/Upload)</label>
                  <div className="flex gap-2 items-center">
                    <Input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="Icon identifier or upload" className="flex-1" />
                    <ImageUploader value={icon} onChange={setIcon} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Intro/Loop Video (Muted Auto-Play)</label>
                  <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="YouTube / Shorts URL" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Downloadable Plugin File (ZIP)</label>
                  <div className="flex gap-2 items-center">
                    <Input value={downloadFile} onChange={(e) => setDownloadFile(e.target.value)} placeholder="Plugin file path or upload" className="flex-1" />
                    <ImageUploader value={downloadFile} onChange={setDownloadFile} label="Upload File" />
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
                English Version {titleEn ? "✓" : ""}
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
                Bengali Version {titleBn ? "✓" : ""}
              </button>
            </div>

            {/* English Version */}
            {activeTab === "en" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">English Title</label>
                    <Input
                      required={!!titleEn || (!titleEn && !titleBn)}
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      placeholder="e.g. Dokan Multivendor Marketplace"
                    />
                  </div>

                  {/* Slug */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">English Slug (URL)</label>
                    <Input
                      required={!!titleEn}
                      value={slugEn}
                      onChange={(e) => setSlugEn(e.target.value)}
                      placeholder="e.g. dokan-multivendor"
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">English Short Description</label>
                  <Input
                    value={excerptEn}
                    onChange={(e) => setExcerptEn(e.target.value)}
                    placeholder="Brief intro about this product..."
                  />
                </div>

                {/* Features (Internal Page Only) */}
                {productType === "internal" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">English Core Features (Comma-separated)</label>
                    <Input
                      value={featuresEn}
                      onChange={(e) => setFeaturesEn(e.target.value)}
                      placeholder="e.g. Responsive, Future updates, 6 months support"
                    />
                  </div>
                )}

                {/* Content HTML Editor (Internal Page Only) */}
                {productType === "internal" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-400">English Overview / Description (HTML format supported)</label>
                      <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => setEditorTab("edit")}
                          className={`px-3 py-1 rounded-md cursor-pointer ${
                            editorTab === "edit" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white" : "text-slate-500"
                          }`}
                        >
                          Edit HTML
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditorTab("preview")}
                          className={`px-3 py-1 rounded-md cursor-pointer ${
                            editorTab === "preview" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white" : "text-slate-500"
                          }`}
                        >
                          Live Preview
                        </button>
                      </div>
                    </div>

                    {editorTab === "edit" ? (
                      <div className="space-y-2 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/30">
                        {/* Editor Toolbar */}
                        <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
                          <button
                            type="button"
                            title="Bold"
                            onClick={() => insertHTML("en", "<strong>", "</strong>")}
                            className="p-1.5 px-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-755 text-xs font-bold rounded-lg cursor-pointer text-slate-700 dark:text-slate-200"
                          >
                            B
                          </button>
                          <button
                            type="button"
                            title="Italic"
                            onClick={() => insertHTML("en", "<em>", "</em>")}
                            className="p-1.5 px-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-755 text-xs italic rounded-lg cursor-pointer text-slate-700 dark:text-slate-200"
                          >
                            I
                          </button>
                          <button
                            type="button"
                            title="Heading 2"
                            onClick={() => insertHTML("en", "<h2 class=\"text-2xl font-bold text-slate-800 dark:text-white mt-6 mb-3\">", "</h2>")}
                            className="p-1.5 px-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-755 text-xs font-bold rounded-lg cursor-pointer text-slate-700 dark:text-slate-200"
                          >
                            H2
                          </button>
                          <button
                            type="button"
                            title="Heading 3"
                            onClick={() => insertHTML("en", "<h3 class=\"text-xl font-bold text-slate-800 dark:text-white mt-4 mb-2\">", "</h3>")}
                            className="p-1.5 px-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-755 text-xs font-bold rounded-lg cursor-pointer text-slate-700 dark:text-slate-200"
                          >
                            H3
                          </button>
                          <button
                            type="button"
                            title="Paragraph"
                            onClick={() => insertHTML("en", "<p class=\"text-slate-600 dark:text-slate-300 leading-relaxed mb-4\">", "</p>")}
                            className="p-1.5 px-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-755 text-xs rounded-lg cursor-pointer text-slate-700 dark:text-slate-200"
                          >
                            P
                          </button>
                          <span className="w-px h-5 bg-slate-250 dark:bg-slate-700 mx-1" />
                          <button
                            type="button"
                            title="Insert Link"
                            onClick={() => {
                              const url = prompt("Enter Link URL:", "https://");
                              if (url) insertHTML("en", `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">`, "</a>");
                            }}
                            className="p-1.5 px-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-755 text-xs font-semibold rounded-lg cursor-pointer text-slate-700 dark:text-slate-200"
                          >
                            Link
                          </button>
                          <ImageUploader
                            value=""
                            onChange={(url) => {
                              if (url) insertHTML("en", `<img src="${url}" alt="image" class="w-full rounded-xl my-6" />\n`);
                            }}
                            label="Upload Image"
                          />
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => handleMultipleImageUpload(e, "en")}
                              id="editor-multiple-uploader-en"
                              className="hidden"
                            />
                            <label htmlFor="editor-multiple-uploader-en" className="cursor-pointer">
                              <span className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-xs font-semibold text-foreground hover:bg-slate-50 dark:hover:bg-slate-755 transition-colors gap-1.5">
                                {editorUploading ? "Uploading..." : "Upload Gallery/Grid"}
                              </span>
                            </label>
                          </div>
                        </div>
                        <textarea
                          id="product-overview-textarea-en"
                          value={contentEn}
                          onChange={(e) => setContentEn(e.target.value)}
                          placeholder="Write or insert HTML here..."
                          rows={8}
                          className="flex w-full border-0 bg-transparent px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-0 font-mono"
                        />
                      </div>
                    ) : (
                      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-white dark:bg-slate-900 max-h-[350px] overflow-y-auto prose dark:prose-invert max-w-none">
                        {contentEn ? (
                          <div dangerouslySetInnerHTML={{ __html: contentEn }} />
                        ) : (
                          <p className="text-slate-400 dark:text-slate-500 text-sm italic">Nothing to preview.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Bengali Version */}
            {activeTab === "bn" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Bengali Title</label>
                    <Input
                      value={titleBn}
                      onChange={(e) => setTitleBn(e.target.value)}
                      placeholder="যেমনঃ দোকান মাল্টিভেন্ডর মার্কেটপ্লেস"
                    />
                  </div>

                  {/* Slug */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Bengali Slug (URL)</label>
                    <Input
                      required={!!titleBn}
                      value={slugBn}
                      onChange={(e) => setSlugBn(e.target.value)}
                      placeholder="যেমনঃ dokan-multivendor"
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Bengali Short Description</label>
                  <Input
                    value={excerptBn}
                    onChange={(e) => setExcerptBn(e.target.value)}
                    placeholder="পণ্য সম্পর্কে ছোট ভূমিকা..."
                  />
                </div>

                {/* Features (Internal Page Only) */}
                {productType === "internal" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Bengali Core Features (Comma-separated)</label>
                    <Input
                      value={featuresBn}
                      onChange={(e) => setFeaturesBn(e.target.value)}
                      placeholder="যেমনঃ রেসপনসিভ, ফিউচার আপডেট, ৬ মাস সাপোর্ট"
                    />
                  </div>
                )}

                {/* Content HTML Editor (Internal Page Only) */}
                {productType === "internal" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Bengali Overview / Description (HTML format supported)</label>
                      <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => setEditorTab("edit")}
                          className={`px-3 py-1 rounded-md cursor-pointer ${
                            editorTab === "edit" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white" : "text-slate-500"
                          }`}
                        >
                          Edit HTML
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditorTab("preview")}
                          className={`px-3 py-1 rounded-md cursor-pointer ${
                            editorTab === "preview" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white" : "text-slate-500"
                          }`}
                        >
                          Live Preview
                        </button>
                      </div>
                    </div>

                    {editorTab === "edit" ? (
                      <div className="space-y-2 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/30">
                        {/* Editor Toolbar */}
                        <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
                          <button
                            type="button"
                            title="Bold"
                            onClick={() => insertHTML("bn", "<strong>", "</strong>")}
                            className="p-1.5 px-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-755 text-xs font-bold rounded-lg cursor-pointer text-slate-700 dark:text-slate-200"
                          >
                            B
                          </button>
                          <button
                            type="button"
                            title="Italic"
                            onClick={() => insertHTML("bn", "<em>", "</em>")}
                            className="p-1.5 px-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-755 text-xs italic rounded-lg cursor-pointer text-slate-700 dark:text-slate-200"
                          >
                            I
                          </button>
                          <button
                            type="button"
                            title="Heading 2"
                            onClick={() => insertHTML("bn", "<h2 class=\"text-2xl font-bold text-slate-800 dark:text-white mt-6 mb-3\">", "</h2>")}
                            className="p-1.5 px-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-755 text-xs font-bold rounded-lg cursor-pointer text-slate-700 dark:text-slate-200"
                          >
                            H2
                          </button>
                          <button
                            type="button"
                            title="Heading 3"
                            onClick={() => insertHTML("bn", "<h3 class=\"text-xl font-bold text-slate-800 dark:text-white mt-4 mb-2\">", "</h3>")}
                            className="p-1.5 px-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-755 text-xs font-bold rounded-lg cursor-pointer text-slate-700 dark:text-slate-200"
                          >
                            H3
                          </button>
                          <button
                            type="button"
                            title="Paragraph"
                            onClick={() => insertHTML("bn", "<p class=\"text-slate-600 dark:text-slate-300 leading-relaxed mb-4\">", "</p>")}
                            className="p-1.5 px-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-755 text-xs rounded-lg cursor-pointer text-slate-700 dark:text-slate-200"
                          >
                            P
                          </button>
                          <span className="w-px h-5 bg-slate-250 dark:bg-slate-700 mx-1" />
                          <button
                            type="button"
                            title="Insert Link"
                            onClick={() => {
                              const url = prompt("Enter Link URL:", "https://");
                              if (url) insertHTML("bn", `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">`, "</a>");
                            }}
                            className="p-1.5 px-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-755 text-xs font-semibold rounded-lg cursor-pointer text-slate-700 dark:text-slate-200"
                          >
                            Link
                          </button>
                          <ImageUploader
                            value=""
                            onChange={(url) => {
                              if (url) insertHTML("bn", `<img src="${url}" alt="image" class="w-full rounded-xl my-6" />\n`);
                            }}
                            label="Upload Image"
                          />
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => handleMultipleImageUpload(e, "bn")}
                              id="editor-multiple-uploader-bn"
                              className="hidden"
                            />
                            <label htmlFor="editor-multiple-uploader-bn" className="cursor-pointer">
                              <span className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-xs font-semibold text-foreground hover:bg-slate-50 dark:hover:bg-slate-755 transition-colors gap-1.5">
                                {editorUploading ? "Uploading..." : "Upload Gallery/Grid"}
                              </span>
                            </label>
                          </div>
                        </div>
                        <textarea
                          id="product-overview-textarea-bn"
                          value={contentBn}
                          onChange={(e) => setContentBn(e.target.value)}
                          placeholder="Write or insert HTML here..."
                          rows={8}
                          className="flex w-full border-0 bg-transparent px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-0 font-mono"
                        />
                      </div>
                    ) : (
                      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-white dark:bg-slate-900 max-h-[350px] overflow-y-auto prose dark:prose-invert max-w-none">
                        {contentBn ? (
                          <div dangerouslySetInnerHTML={{ __html: contentBn }} />
                        ) : (
                          <p className="text-slate-400 dark:text-slate-500 text-sm italic">Nothing to preview.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 justify-end border-t border-slate-200 dark:border-slate-800 pt-4">
              <Button type="button" variant="outline" onClick={resetForm} className="cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="bg-[#e8000e] hover:bg-[#e8000e]/90 text-white font-bold cursor-pointer">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Product Group"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Grouped Products List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          </div>
        ) : groupedProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            <Package className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
            No products found. Click "Add Product" or populate seed data!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase">Cover</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase">Product Title</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase">Category</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase">Languages</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {groupedProducts.map((group) => {
                  const hasEn = !!group.en;
                  const hasBn = !!group.bn;

                  return (
                    <tr key={group.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20">
                      <td className="p-4">
                        <img src={group.cover} alt="Cover" className="w-12 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-800" />
                      </td>
                      <td className="p-4">
                        {group.en && (
                          <div className="font-bold text-slate-800 dark:text-white flex items-center gap-2 flex-wrap">
                            <span>{group.en.title}</span>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                              {group.productType}
                            </span>
                          </div>
                        )}
                        {group.bn && (
                          <div className={`text-slate-700 dark:text-slate-300 text-sm flex items-center gap-2 flex-wrap ${group.en ? "mt-1 italic font-medium" : "font-bold"}`}>
                            <span>{group.bn.title}</span>
                            {!group.en && (
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                                {group.productType}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="text-[10px] space-y-0.5 font-mono text-slate-400 mt-1">
                          {group.en && <div><span className="font-bold">EN:</span> {group.en.slug}</div>}
                          {group.bn && <div><span className="font-bold">BN:</span> {group.bn.slug}</div>}
                        </div>
                      </td>
                      <td className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">{group.category}</td>
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
