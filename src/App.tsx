import { useState, useRef } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  Upload,
  Loader2,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  X,
  Scale,
} from "lucide-react";

const API_BASE_URL = "/api";

const DOCUMENT_TYPES: Record<string, { title: string; fields: string[] }> = {
  employment_contract: {
    title: "Employment Contract",
    fields: [
      "employer_name",
      "employee_name",
      "position",
      "start_date",
      "salary",
      "work_location",
      "employment_type",
    ],
  },
  lease_agreement: {
    title: "Lease Agreement",
    fields: [
      "landlord_name",
      "tenant_name",
      "property_address",
      "lease_start",
      "lease_end",
      "monthly_rent",
      "security_deposit",
    ],
  },
  nda: {
    title: "Non-Disclosure Agreement",
    fields: [
      "disclosing_party",
      "receiving_party",
      "effective_date",
      "jurisdiction",
      "term_years",
    ],
  },
  partnership_agreement: {
    title: "Partnership Agreement",
    fields: [
      "partner_one",
      "partner_two",
      "business_name",
      "business_address",
      "start_date",
      "profit_sharing",
      "duration",
    ],
  },
  service_agreement: {
    title: "Service Agreement",
    fields: [
      "service_provider",
      "client_name",
      "service_description",
      "start_date",
      "end_date",
      "payment_amount",
      "payment_terms",
    ],
  },
  settlement_agreement: {
    title: "Settlement Agreement",
    fields: [
      "party_one",
      "party_two",
      "dispute_description",
      "settlement_amount",
      "settlement_date",
      "confidentiality_required",
    ],
  },
  freelance_contract: {
    title: "Freelance Contract",
    fields: [
      "freelancer_name",
      "client_name",
      "project_description",
      "start_date",
      "deadline",
      "total_payment",
      "milestone_payment",
    ],
  },
  terms_of_service: {
    title: "Terms of Service",
    fields: [
      "company_name",
      "website_url",
      "effective_date",
      "governing_law",
      "minimum_age",
    ],
  },
  domicile_agreement: {
    title: "Domicile Agreement",
    fields: [
      "resident_name",
      "property_owner",
      "property_address",
      "start_date",
      "monthly_fee",
      "services_included",
    ],
  },
};

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "text/plain",
];
const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".doc", ".txt"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

type View = "home" | "generate" | "result" | "upload";

interface GeneratedDoc {
  document_type: string;
  document_title: string;
  document_text: string;
}

interface UploadResult {
  filename: string;
  extracted_text: string;
  analysis: string | null;
}

function formatFieldLabel(field: string): string {
  return field
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function App() {
  const [view, setView] = useState<View>("home");
  const [selectedType, setSelectedType] = useState<string>("");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedDoc, setGeneratedDoc] = useState<GeneratedDoc | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function selectDocType(type: string) {
    setSelectedType(type);
    setFormData({});
    setError(null);
    setView("generate");
  }

  function handleFormChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleGenerate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ document_type: selectedType, details: formData }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Generation failed");
      }
      setGeneratedDoc(data);
      setView("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload() {
    if (!generatedDoc) return;
    setDownloading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/download-doc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document_type: generatedDoc.document_type,
          document_text: generatedDoc.document_text,
        }),
      });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        res.headers.get("Content-Disposition")?.split("filename=")[1]?.replace(/"/g, "") ||
        `LegalEase_${generatedDoc.document_title.replace(/ /g, "_")}.docx`;
      a.click();
      URL.revokeObjectURL(url);
      setSuccess("Document downloaded successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setDownloading(false);
    }
  }

  function validateFile(file: File): string | null {
    const rawExt = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() : undefined;
    const ext = rawExt ? "." + rawExt : "";
    if (!ALLOWED_EXTENSIONS.includes(ext) && !ALLOWED_TYPES.includes(file.type)) {
      return `File type not supported. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File exceeds the 10 MB size limit.";
    }
    return null;
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateFile(file);
    if (err) {
      setUploadError(err);
      setUploadFile(null);
      return;
    }
    setUploadError(null);
    setUploadFile(file);
    setUploadResult(null);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const err = validateFile(file);
    if (err) {
      setUploadError(err);
      setUploadFile(null);
      return;
    }
    setUploadError(null);
    setUploadFile(file);
    setUploadResult(null);
  }

  async function handleUpload() {
    if (!uploadFile) return;
    setUploading(true);
    setUploadError(null);
    setUploadResult(null);

    const formPayload = new FormData();
    formPayload.append("file", uploadFile);

    try {
      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formPayload,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }
      setUploadResult(data);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function resetUpload() {
    setUploadFile(null);
    setUploadError(null);
    setUploadResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => {
              setView("home");
              setError(null);
              setSuccess(null);
            }}
            className="flex items-center gap-2 text-indigo-700 font-bold text-xl hover:text-indigo-900 transition-colors"
          >
            <Scale className="w-6 h-6" />
            LegalEase
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setView("upload");
                setError(null);
                setSuccess(null);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              <Upload className="w-4 h-4" />
              Upload Document
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Toast notifications */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg"
            >
              <CheckCircle className="w-5 h-5" />
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Home View */}
        {view === "home" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-indigo-900 mb-3">
                AI-Powered Legal Documents
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Generate professional legal documents in seconds using Google Gemini AI.
                Choose a document type to get started.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(DOCUMENT_TYPES).map(([key, info]) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => selectDocType(key)}
                  className="bg-white rounded-xl p-6 shadow-sm border border-blue-100 hover:border-indigo-300 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                      <FileText className="w-5 h-5 text-indigo-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-sm">{info.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {info.fields.length} fields required
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-slate-500 text-sm mb-3">
                Have an existing document to review?
              </p>
              <button
                onClick={() => setView("upload")}
                className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors font-medium text-sm"
              >
                <Upload className="w-4 h-4" />
                Upload & Analyze Document
              </button>
            </div>
          </motion.div>
        )}

        {/* Generate Form View */}
        {view === "generate" && selectedType && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <button
              onClick={() => setView("home")}
              className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 mb-6 text-sm font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to document types
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8">
              <h2 className="text-2xl font-bold text-indigo-900 mb-1">
                {DOCUMENT_TYPES[selectedType].title}
              </h2>
              <p className="text-slate-500 text-sm mb-6">
                Fill in the details below to generate your document.
              </p>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleGenerate} className="space-y-4">
                {DOCUMENT_TYPES[selectedType].fields.map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {formatFieldLabel(field)}
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={formData[field] || ""}
                      onChange={handleFormChange}
                      required
                      placeholder={`Enter ${formatFieldLabel(field).toLowerCase()}`}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm"
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-medium mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating document...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Generate Document
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* Result View */}
        {view === "result" && generatedDoc && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setView("generate")}
                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to form
              </button>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-medium text-sm"
              >
                {downloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {downloading ? "Downloading..." : "Download as Word"}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8">
              <h2 className="text-2xl font-bold text-indigo-900 mb-6 text-center">
                {generatedDoc.document_title}
              </h2>
              <div className="prose prose-slate max-w-none text-sm leading-relaxed whitespace-pre-wrap font-mono bg-slate-50 rounded-lg p-6 border border-slate-100 max-h-[60vh] overflow-y-auto">
                {generatedDoc.document_text}
              </div>
            </div>
          </motion.div>
        )}

        {/* Upload View */}
        {view === "upload" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <button
              onClick={() => setView("home")}
              className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 mb-6 text-sm font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to home
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Upload className="w-5 h-5 text-indigo-700" />
                </div>
                <h2 className="text-2xl font-bold text-indigo-900">Upload Document</h2>
              </div>
              <p className="text-slate-500 text-sm mb-6">
                Upload an existing legal document (PDF, Word, or TXT) to extract and
                analyze its contents using AI.
              </p>

              {/* Drop zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  dragOver
                    ? "border-indigo-500 bg-indigo-50"
                    : uploadFile
                    ? "border-green-400 bg-green-50"
                    : "border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ALLOWED_EXTENSIONS.join(",")}
                  onChange={handleFileChange}
                  className="hidden"
                  aria-label="Upload legal document"
                />

                {uploadFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                    <p className="font-medium text-slate-700">{uploadFile.name}</p>
                    <p className="text-sm text-slate-500">
                      {(uploadFile.size / 1024).toFixed(1)} KB
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        resetUpload();
                      }}
                      className="mt-1 flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-10 h-10 text-slate-400" />
                    <p className="font-medium text-slate-600">
                      Drop your file here or click to browse
                    </p>
                    <p className="text-xs text-slate-400">
                      Supported: PDF, DOCX, DOC, TXT &nbsp;·&nbsp; Max size: 10 MB
                    </p>
                  </div>
                )}
              </div>

              {uploadError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mt-4 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {uploadError}
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!uploadFile || uploading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium mt-4"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing file...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload & Analyze
                  </>
                )}
              </button>
            </div>

            {/* Upload Result */}
            <AnimatePresence>
              {uploadResult && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 space-y-4"
                >
                  <div className="bg-white rounded-2xl shadow-sm border border-green-200 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-slate-800">
                        File uploaded successfully
                      </h3>
                    </div>
                    <p className="text-sm text-slate-600">
                      <span className="font-medium">Filename:</span>{" "}
                      {uploadResult.filename}
                    </p>
                  </div>

                  {uploadResult.analysis && (
                    <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
                      <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        AI Analysis
                      </h3>
                      <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50 rounded-lg p-4 border border-slate-100 max-h-80 overflow-y-auto">
                        {uploadResult.analysis}
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
                    <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      Extracted Text
                    </h3>
                    <div className="text-sm text-slate-600 whitespace-pre-wrap font-mono bg-slate-50 rounded-lg p-4 border border-slate-100 max-h-60 overflow-y-auto">
                      {uploadResult.extracted_text.length > 2000
                        ? uploadResult.extracted_text.slice(0, 2000) + "\n\n[truncated…]"
                        : uploadResult.extracted_text}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      <footer className="text-center py-8 text-xs text-slate-400 mt-8">
        <p>
          ⚠️ Documents are for informational purposes only. Please consult a qualified
          legal professional before use.
        </p>
        <p className="mt-1">© 2025 LegalEase · Built with Google Gemini AI</p>
      </footer>
    </div>
  );
}
