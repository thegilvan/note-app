import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; //import padrão para o tailwindcss

// https://vite.dev/config/

export default defineConfig({
  plugins: [react(), tailwindcss()], //e tem que adicionar como plugin também
  server: {
    host: true, //na minha máquina foi necessário colocar este parâmetro para o localhost funcionar
    port: 5173,
  },
});
