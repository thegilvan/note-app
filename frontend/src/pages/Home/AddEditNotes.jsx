import React, { useState } from "react";
import TagInput from "../../components/Input/TagInput";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";

const AddEditNotes = ({ noteData, type, getAllNotes, onClose, showToastMessage }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);

  //add NoteCard
  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post("/add-note", { title, content, tags });
      if (response.data && response.data.note) {
        showToastMessage("Nota adicionada com sucesso!", "add");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
    }
  };

  //edit NoteCard
  const editNote = async () => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put("/edit-note/" + noteId, { title, content, tags });
      if (response.data && response.data.note) {
        showToastMessage("Nota alterada com sucesso!", "edit");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
    }
  };
  const handleAddNote = () => {
    if (!title) {
      setError("Favor adicionar um título");
      return;
      // não esquecer do return!
    }

    if (!content) {
      setError("Favor adicionar um conteúdo");
      return;
    }
    setError("");

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };
  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>
      {/* text input do título da nota */}
      <div className="flex flex-col gap-2">
        <label className="input-label">Título</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Caminhar às 05:00"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      {/* textArea do conteúdo da nota */}
      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">Conteúdo</label>
        <textarea
          type="text"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="Lembrar de caminhar no parque às 5 da manhã para aproveitar o nascer do sol e começar o dia com energia."
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        />
      </div>
      {/* input de add Tags */}
      <div className="mt-3">
        <label className="input-label">TAGS</label>
        {/* tem que finalizar o componente antes de rodar senão dá erro */}
        <TagInput tags={tags} setTags={setTags} />
        {error && <p className="text-red-500 text-xs pt-4">{error}</p>}
        <button className="btn-primary font-medium mt-5 p-3" onClick={handleAddNote}>
          {type === "edit" ? "UPDATE" : "ADD"}
        </button>
      </div>
    </div>
  );
};

export default AddEditNotes;
