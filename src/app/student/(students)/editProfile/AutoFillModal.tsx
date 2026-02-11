// components/AIAutofillModal.tsx
"use client"

import React, { useState, useRef } from "react"
import { X, Upload, FileText, Briefcase, School, FileCheck, Sparkles, CheckCircle, AlertCircle, File, ExternalLink, Eye, Save } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export type DocumentType = "10th_marksheet" | "12th_marksheet" | "undergraduate_marksheet" | "resume" | "passport" | "transcripts"

interface DocumentOption {
  id: DocumentType
  label: string
  description: string
  icon: React.ComponentType<any>
  fields: {
    personal?: number
    academics?: number
    work?: number
  }
}

interface ExtractedData {
  salutation?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  email?: string | null;
  phone?: string | null;
  passport_number?: string;
  dob?: string;
  gender?: string;
  citizenship?: string;
  country_code?: string;
  state_code?: string;
  city_code?: string;
  address?: string;
  postal_code?: string;
  emergency_c_name?: string | null;
  emergency_c_relation?: string | null;
  emergency_c_email?: string | null;
  emergency_c_phone?: string | null;
}

interface UploadedDocument {
  id: DocumentType
  name: string
  size: string
  date: string
  status: "uploaded" | "processing" | "completed" | "failed"
  extractedData?: ExtractedData
}

interface AIAutofillModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadComplete?: (data?: ExtractedData) => void
}

export default function AIAutofillModal({ 
  isOpen, 
  onClose, 
  onUploadComplete, 
}: AIAutofillModalProps) {
  const {token} = useAuth();
  const [selectedDocType, setSelectedDocType] = useState<DocumentType | null>(null)
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [showExtractedPreview, setShowExtractedPreview] = useState<ExtractedData | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_BASE;

  const documentOptions: DocumentOption[] = [
    {
      id: "passport",
      label: "Passport",
      description: "Personal identification",
      icon: FileCheck,
      fields: { personal: 13 } // Number of fields it can fill
    },
    {
      id: "10th_marksheet",
      label: "10th Marksheet",
      description: "High school completion certificate",
      icon: School,
      fields: { academics: 10 }
    },
    {
      id: "12th_marksheet",
      label: "12th Marksheet",
      description: "Higher secondary school marks",
      icon: School,
      fields: { academics: 15 }
    },
    {
      id: "undergraduate_marksheet",
      label: "Undergrad Marksheet",
      description: "Bachelor's degree transcripts",
      icon: FileText,
      fields: { academics: 25 }
    },
    {
      id: "resume",
      label: "Resume/CV",
      description: "Professional experience",
      icon: Briefcase,
      fields: { work: 32 }
    },
  ]

  const handleFileUpload = async (file: File) => {
    if (!selectedDocType) return

    setUploading(true)
    setUploadProgress(0)
    setUploadError(null)

    try {
      // Simulate upload progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Create form data for API
      const formData = new FormData()
      formData.append('document', file)
      formData.append('document_type', selectedDocType)

      // Call the analyze API
      const response = await fetch(`${BASE_URL}/documents/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      clearInterval(progressInterval)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to analyze document')
      }

      const result = await response.json()
      setUploadProgress(100)

      if (result.success) {
        // Create the uploaded document record
        const newDoc: UploadedDocument = {
          id: selectedDocType,
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          date: new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }),
          status: "completed",
          extractedData: result.extracted_data
        }

        setUploadedDocs(prev => [...prev, newDoc])
        
        // Show the extracted data preview
        if (result.extracted_data) {
          setShowExtractedPreview(result.extracted_data)
        }
        
        if (onUploadComplete) {
          onUploadComplete(result.extracted_data)
        }
      } else {
        throw new Error(result.message || 'Failed to process document')
      }

    } catch (error) {
      console.error('Upload error:', error)
      setUploadError(error instanceof Error ? error.message : 'Failed to upload and analyze document')
      
      // Add failed document record
      const failedDoc: UploadedDocument = {
        id: selectedDocType,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        date: new Date().toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        status: "failed"
      }
      
      setUploadedDocs(prev => [...prev, failedDoc])
    } finally {
      setUploading(false)
      setSelectedDocType(null)
    }
  }

  const handleSaveExtractedData = async () => {
    if (!showExtractedPreview) return
    
    setIsSaving(true)
    setUploadError(null)

    try {
      const response = await fetch(`${BASE_URL}/documents/save/details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(showExtractedPreview)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to save data')
      }

      setSaveSuccess(true)
      
      // Close modal after successful save
      setTimeout(() => {
        onClose()
        // Reset state
        setShowExtractedPreview(null)
        setSaveSuccess(false)
      }, 1500)

    } catch (error) {
      console.error('Save error:', error)
      setUploadError(error instanceof Error ? error.message : 'Failed to save extracted data')
    } finally {
      setIsSaving(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && selectedDocType) {
      handleFileUpload(file)
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!selectedDocType) return
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleClose = () => {
    // Reset all state when closing
    setSelectedDocType(null)
    setUploadError(null)
    setShowExtractedPreview(null)
    setSaveSuccess(false)
    setUploadProgress(0)
    onClose()
  }

  const getStatusColor = (status: UploadedDocument['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'uploaded': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    }
  }

  const getStatusIcon = (status: UploadedDocument['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-3 h-3" />
      case 'processing': return <div className="animate-spin rounded-full border border-current border-t-transparent w-3 h-3" />
      case 'uploaded': return <Upload className="w-3 h-3" />
      case 'failed': return <AlertCircle className="w-3 h-3" />
    }
  }

  const selectedDocOption = selectedDocType 
    ? documentOptions.find(doc => doc.id === selectedDocType)
    : null

  // Get the latest passport upload with extracted data
  const latestPassportUpload = uploadedDocs
    .filter(doc => doc.id === 'passport' && doc.extractedData)
    .pop()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-99999 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-6xl rounded-2xl bg-white dark:bg-gray-900 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-blue-500">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  AI Document Autofill
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Upload documents to automatically fill your profile
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Success Message */}
            {saveSuccess && (
              <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-300">
                      Data Saved Successfully!
                    </h3>
                    <p className="text-xs text-green-700 dark:text-green-400 mt-0.5">
                      Your personal information has been updated.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Extracted Data Preview */}
            {showExtractedPreview && (
              <div className="mb-6 p-5 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-300">
                      Extracted Information from Passport
                    </h3>
                  </div>
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full text-xs">
                    Ready to save
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {showExtractedPreview.salutation && (
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-purple-100 dark:border-purple-900">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Salutation</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                        {showExtractedPreview.salutation}
                      </p>
                    </div>
                  )}
                  
                  {showExtractedPreview.first_name && (
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-purple-100 dark:border-purple-900">
                      <p className="text-xs text-gray-500 dark:text-gray-400">First Name</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                        {showExtractedPreview.first_name}
                      </p>
                    </div>
                  )}
                  
                  {showExtractedPreview.middle_name && (
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-purple-100 dark:border-purple-900">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Middle Name</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                        {showExtractedPreview.middle_name}
                      </p>
                    </div>
                  )}
                  
                  {showExtractedPreview.last_name && (
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-purple-100 dark:border-purple-900">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Last Name</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                        {showExtractedPreview.last_name}
                      </p>
                    </div>
                  )}
                  
                  {showExtractedPreview.dob && (
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-purple-100 dark:border-purple-900">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Date of Birth</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                        {new Date(showExtractedPreview.dob).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  
                  {showExtractedPreview.gender && (
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-purple-100 dark:border-purple-900">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Gender</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                        {showExtractedPreview.gender}
                      </p>
                    </div>
                  )}
                  
                  {showExtractedPreview.passport_number && (
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-purple-100 dark:border-purple-900">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Passport Number</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                        {showExtractedPreview.passport_number}
                      </p>
                    </div>
                  )}
                  
                  {showExtractedPreview.citizenship && (
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-purple-100 dark:border-purple-900">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Citizenship</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                        {showExtractedPreview.citizenship}
                      </p>
                    </div>
                  )}
                  
                  {showExtractedPreview.address && (
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-purple-100 dark:border-purple-900 md:col-span-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                        {showExtractedPreview.address}
                      </p>
                    </div>
                  )}
                  
                  {showExtractedPreview.country_code && (
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-purple-100 dark:border-purple-900">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Country</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                        {showExtractedPreview.country_code}
                      </p>
                    </div>
                  )}
                  
                  {showExtractedPreview.state_code && (
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-purple-100 dark:border-purple-900">
                      <p className="text-xs text-gray-500 dark:text-gray-400">State</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                        {showExtractedPreview.state_code}
                      </p>
                    </div>
                  )}
                  
                  {showExtractedPreview.city_code && (
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-purple-100 dark:border-purple-900">
                      <p className="text-xs text-gray-500 dark:text-gray-400">City</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                        {showExtractedPreview.city_code}
                      </p>
                    </div>
                  )}
                  
                  {showExtractedPreview.postal_code && (
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-purple-100 dark:border-purple-900">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Postal Code</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                        {showExtractedPreview.postal_code}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setShowExtractedPreview(null)}
                    className="px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveExtractedData}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full border-2 border-white border-t-transparent w-3 h-3" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        Save Personal Information
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {uploadError && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                      Upload Failed
                    </h3>
                    <p className="text-xs text-red-700 dark:text-red-400 mt-0.5">
                      {uploadError}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Document Selection */}
              <div className="lg:col-span-1">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
                  Select Document Type
                </h3>
                <div className="space-y-2">
                  {documentOptions.map((doc) => {
                    const Icon = doc.icon
                    const isSelected = selectedDocType === doc.id
                    const isUploaded = uploadedDocs.some(d => d.id === doc.id)
                    
                    return (
                      <button
                        key={doc.id}
                        onClick={() => setSelectedDocType(doc.id)}
                        disabled={uploading}
                        className={`w-full p-3 rounded-lg border transition-all duration-200 text-left flex items-start gap-3 ${
                          isSelected
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-600'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        } ${isUploaded ? 'opacity-80' : ''} ${
                          uploading ? 'cursor-not-allowed' : ''
                        }`}
                      >
                        <div className={`p-2 rounded-md ${
                          isSelected
                            ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {doc.label}
                            </h4>
                            {isUploaded && (
                              <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 ml-2" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                            {doc.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {doc.fields?.personal && (
                              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                                Personal: {doc.fields.personal} fields
                              </span>
                            )}
                            {doc.fields?.academics && (
                              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                Academics: {doc.fields.academics} fields
                              </span>
                            )}
                            {doc.fields?.work && (
                              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">
                                Work: {doc.fields.work} fields
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Right Column - Upload Area */}
              <div className="lg:col-span-2">
                {selectedDocType && selectedDocOption && !showExtractedPreview ? (
                  <div>
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        Upload {selectedDocOption.label}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        We'll extract information from your document and fill the relevant fields
                      </p>
                    </div>

                    {/* Upload Area */}
                    <div 
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                        uploading 
                          ? 'border-purple-300 dark:border-purple-800'
                          : 'border-gray-300 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600'
                      }`}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => !uploading && fileInputRef.current?.click()}
                    >
                      {uploading ? (
                        <div className="space-y-4">
                          <div className="w-12 h-12 mx-auto rounded-full border-3 border-gray-200 dark:border-gray-800 border-t-purple-500 animate-spin" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Processing...</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              AI is extracting information from your document
                            </p>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-blue-500 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {uploadProgress}% complete
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                            <Upload className="w-5 h-5 text-gray-400" />
                          </div>
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                              Drop file here or click to browse
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Upload your {selectedDocOption.label.toLowerCase()}
                            </p>
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileSelect}
                            disabled={uploading}
                          />
                          <button
                            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-2 text-xs font-medium text-white hover:from-purple-700 hover:to-blue-600 transition-all duration-200"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            Select File
                          </button>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                            PDF, JPG, PNG (Max 10MB)
                          </p>
                        </>
                      )}
                    </div>

                    {/* Cancel Button */}
                    {!uploading && (
                      <button
                        onClick={() => setSelectedDocType(null)}
                        className="w-full mt-3 px-4 py-2 mb-3 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                      >
                        Choose Different Document
                      </button>
                    )}

                    {/* Instructions */}
                    <div className="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                      <h4 className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Upload Guidelines
                      </h4>
                      <ul className="space-y-1.5 text-xs text-blue-700 dark:text-blue-400">
                        <li className="flex items-start gap-2">
                          <span className="mt-0.5">•</span>
                          Ensure document is clear and readable
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-0.5">•</span>
                          Max file size: 10MB
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-0.5">•</span>
                          Supported formats: PDF, JPG, PNG
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : !showExtractedPreview && (
                  /* Initial State - No document selected */
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                      <File className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Select a Document Type
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                      Choose a document type from the left panel to begin uploading and extracting information.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 px-6 py-4">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p>AI-powered extraction • Secure upload • Your data is encrypted</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}