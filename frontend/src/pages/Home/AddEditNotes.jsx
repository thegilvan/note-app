import React from "react";

const AddEditNotes = () => {
  return (
    <div>
      <div className="flex flex-col gap-2">
        <label className="input-label">Título</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Caminhar às 05:00"
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">Conteúdo</label>
        <textarea
          type="text"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="Conteúdo"
          rows={10}
        />
      </div>

      <div className="mt-3">
        <label className="input-label">TAGS</label>
        <TagInput />
        <button className="btn-primary font-medium mt-5 p-3" onClick={() => {}}>
          Add
        </button>
      </div>
    </div>
  );
};

export default AddEditNotes;
