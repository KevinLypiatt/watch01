import * as React from "react";
import { createToast } from "./toast-store";
import { reducer } from "./toast-reducer";
import type { ToasterToast } from "./toast-types";
import type { ToastActionElement } from "@/components/ui/toast";

const listeners: Array<(state: { toasts: ToasterToast[] }) => void> = [];
let memoryState: { toasts: ToasterToast[] } = { toasts: [] };

function dispatch(action: any) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Toast = Omit<ToasterToast, "id">;

function toast({ ...props }: Toast) {
  const newToast = createToast(props);

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id: newToast.id },
    });
    
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: newToast.id });

  dispatch({
    type: "ADD_TOAST",
    toast: newToast,
  });

  return {
    id: newToast.id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = React.useState<{ toasts: ToasterToast[] }>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };
export type { Toast, ToastActionElement };