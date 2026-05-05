type FileUploadProps = {
  onChange: (files: FileList | null) => void;
  multiple?: boolean;
};

export default function FileUpload({ onChange, multiple = true }: FileUploadProps) {
  return (
    <div className="flex items-center gap-3">
      <label htmlFor="file-upload-input" className="text-sm font-medium text-gray-700 shrink-0">첨부파일</label>
      <input
        id="file-upload-input"
        type="file"
        multiple={multiple}
        onChange={(event) => onChange(event.target.files)}
        className="flex-1 text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand-primary file:text-white hover:file:bg-[#4e5caf] cursor-pointer"
      />
    </div>
  );
}
