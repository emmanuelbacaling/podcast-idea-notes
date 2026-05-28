import { useEffect, useRef } from 'react';
import {
  Bold,
  Eraser,
  Heading,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
  Underline,
} from 'lucide-react';

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
};

type ToolbarAction = {
  label: string;
  command: string;
  value?: string;
  icon: typeof Bold;
};

const toolbar: ToolbarAction[] = [
  { label: 'Bold', command: 'bold', icon: Bold },
  { label: 'Italic', command: 'italic', icon: Italic },
  { label: 'Underline', command: 'underline', icon: Underline },
  { label: 'Strike', command: 'strikeThrough', icon: Strikethrough },
  { label: 'H3', command: 'formatBlock', value: '<h3>', icon: Heading },
  {
    label: 'Quote',
    command: 'formatBlock',
    value: '<blockquote>',
    icon: Quote,
  },
  { label: 'Bullets', command: 'insertUnorderedList', icon: List },
  { label: 'Numbers', command: 'insertOrderedList', icon: ListOrdered },
  {
    label: 'Highlight',
    command: 'hiliteColor',
    value: '#fef08a',
    icon: Highlighter,
  },
  { label: 'Clear', command: 'removeFormat', icon: Eraser },
];

const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const applyFormat = (command: string, commandValue?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    onChange(editorRef.current?.innerHTML ?? '');
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 p-1.5">
        {toolbar.map((item) => (
          <button
            type="button"
            key={item.label}
            className="cursor-pointer rounded-lg p-1.5 text-slate-700 transition duration-100 hover:bg-slate-200"
            onClick={() => applyFormat(item.command, item.value)}
            title={item.label}
          >
            <item.icon className="h-4 w-4" />
          </button>
        ))}
      </div>

      <div
        ref={editorRef}
        className="editor-content min-h-87.5 p-3.5 text-[0.95rem] leading-6 text-slate-800 outline-none"
        contentEditable
        onInput={(event) =>
          onChange((event.target as HTMLDivElement).innerHTML)
        }
        data-placeholder="Write your episode outline, bullets, hooks, and talking points..."
      />
    </section>
  );
};

export default RichTextEditor;
