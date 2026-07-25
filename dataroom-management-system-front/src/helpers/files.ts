import { PDF_EXTENSION, PDF_MIME } from '@/constants/files'

export function isPdfFile(file: File): boolean {
  return (
    file.type === PDF_MIME ||
    file.name.toLowerCase().endsWith(PDF_EXTENSION)
  )
}
