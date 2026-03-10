export default function ImageUploadBox({ onUpload }) {
  return (
    <div style={{ margin: "30px 0" }}>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onUpload(e.target.files[0])}
      />
    </div>
  );
}