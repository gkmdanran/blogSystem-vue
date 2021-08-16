export type FileUploadStatus = 'ready' | 'uploading' | 'success' | 'fail'
export interface ElUploadInternalRawFile extends File {
    uid: number
  }
export interface ElUploadInternalFileDetail {
    status: FileUploadStatus,
    name: string,
    size: number,
    percentage: number,
    uid: number,
    raw: ElUploadInternalRawFile,
    response:any
    url?: string
  }