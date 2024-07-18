declare module 'file-upload-with-preview' {
  interface FileUploadWithPreviewOptions {
    accept?: string;
    multiple?: boolean;
    text?: {
      chooseFile?: string;
      browse?: string;
      selectedCount?: string;
    };
    images?: {
      baseImage?: string;
    };
  }

  export class FileUploadWithPreview {
    constructor(options: FileUploadWithPreviewOptions);
    selectedFiles: File[];
    clearPreviewPanel(): void;
  }
}
