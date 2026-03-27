import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { X, Upload, ImagePlus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ImageUploadZoneProps {
  onImagesChange: (files: File[]) => void
  maxFiles?: number
  maxSize?: number
}

export default function ImageUploadZone({
  onImagesChange,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024 // 10MB
}: ImageUploadZoneProps) {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Limit number of files
    const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles)
    setFiles(newFiles)
    onImagesChange(newFiles)

    // Generate previews
    const newPreviews = newFiles.map(file => URL.createObjectURL(file))
    setPreviews(newPreviews)
  }, [files, maxFiles, onImagesChange])

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)

    setFiles(newFiles)
    setPreviews(newPreviews)
    onImagesChange(newFiles)

    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(previews[index])
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxSize,
    maxFiles,
    disabled: files.length >= maxFiles
  })

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-purple-500 bg-purple-50'
            : files.length >= maxFiles
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
            : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
        }`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-3">
          {isDragActive ? (
            <ImagePlus className="w-12 h-12 text-purple-500" />
          ) : (
            <Upload className="w-12 h-12 text-gray-400" />
          )}

          {files.length >= maxFiles ? (
            <p className="text-gray-500">Maximum {maxFiles} images reached</p>
          ) : (
            <>
              <p className="text-lg font-medium text-gray-700">
                {isDragActive ? 'Drop images here' : 'Drop cake images here'}
              </p>
              <p className="text-sm text-gray-500">
                or click to browse ({maxFiles - files.length} remaining)
              </p>
              <p className="text-xs text-gray-400">
                PNG, JPG, WEBP up to 10MB each
              </p>
            </>
          )}
        </div>
      </div>

      {/* Preview Grid */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
          >
            {previews.map((preview, index) => (
              <motion.div
                key={preview}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group"
              >
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* File size */}
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {(files[index].size / 1024 / 1024).toFixed(1)} MB
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
