function QuillContent({ content }) {
  return (
    <div
      className="quillContent"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

export default QuillContent;
