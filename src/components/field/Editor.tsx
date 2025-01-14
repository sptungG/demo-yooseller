import dynamic from "next/dynamic";
import { ReactQuillProps } from "react-quill";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

type TEditorProps = ReactQuillProps & {};

const Editor = ({ value, onChange, ...props }: TEditorProps) => {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={(value, ...rest) =>
        onChange?.(
          value.replace(/(^([ ]*<p><br><\/p>)*)|((<p><br><\/p>)*[ ]*$)/gi, "").trim(),
          ...rest,
        )
      }
      {...props}
    />
  );
};

export default Editor;
