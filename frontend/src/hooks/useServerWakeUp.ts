import { useEffect } from "react";
import { toast } from "sonner";
import api from "../api/axios";

export function useServerWakeUp() {
  useEffect(() => {
    const timer = setTimeout(() => {
      toast.loading("Le serveur démarre, cela peut prendre jusqu'à une minute…", {
        id: "server-wake-up",
      });
    }, 3000);
    api
      .get("/health")
      .catch(() => {
        // Le serveur ne répond pas : les autres requêtes de la page afficheront leurs propres erreurs
      })
      .finally(() => {
        clearTimeout(timer);
        toast.dismiss("server-wake-up");
      });
    return () => clearTimeout(timer);
  }, []);
}
