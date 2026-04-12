interface TextPreviewProps {
  backgroundColor: string;
  textColor: string;
}

export default function TextPreview(props: TextPreviewProps) {
  const { backgroundColor, textColor } = props;

  return (
    <div className="text-preview" style={{ backgroundColor, color: textColor }}>
      The quick brown fox jumps over the lazy dog
    </div>
  );
}
