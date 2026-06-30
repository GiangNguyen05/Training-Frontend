import { useForm } from "react-hook-form";
import { Plus, X } from "lucide-react";
import { useNotes } from "../context/NotesContext";

export default function NoteForm({ editingNote, onDone }) {
  const { addNote, updateNote } = useNotes();
  const isEditing = Boolean(editingNote);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: editingNote?.title ?? "",
      content: editingNote?.content ?? "",
    },
  });

  const onSubmit = async (data) => {
    if (isEditing) {
      updateNote(editingNote.id, data);
    } else {
      addNote(data);
    }
    reset({ title: "", content: "" });
    onDone?.();
  };

  return (
    <form className="note-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="field">
        <input
          className={`title-input ${errors.title ? "has-error" : ""}`}
          placeholder="Tiêu đề ghi chú"
          {...register("title", {
            required: "Vui lòng nhập tiêu đề",
            maxLength: { value: 60, message: "Tối đa 60 ký tự" },
          })}
        />
        {errors.title && (
          <span className="error-text">{errors.title.message}</span>
        )}
      </div>

      <div className="field">
        <textarea
          className={`content-input ${errors.content ? "has-error" : ""}`}
          placeholder="Nội dung..."
          rows={4}
          {...register("content", {
            required: "Vui lòng nhập nội dung",
            minLength: { value: 3, message: "Tối thiểu 3 ký tự" },
          })}
        />
        {errors.content && (
          <span className="error-text">{errors.content.message}</span>
        )}
      </div>

      <div className="form-actions">
        {isEditing && (
          <button type="button" className="btn ghost" onClick={onDone}>
            <X size={16} /> Huỷ
          </button>
        )}
        <button type="submit" className="btn primary" disabled={isSubmitting}>
          {isEditing ? (
            "Lưu thay đổi"
          ) : (
            <>
              <Plus size={16} /> Thêm ghi chú
            </>
          )}
        </button>
      </div>
    </form>
  );
}
